/* eslint-disable react/no-unknown-property */
'use client';
import { Component, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import { BallCollider, CuboidCollider, Physics, RigidBody, useRopeJoint, useSphericalJoint } from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';

import cardGLB from '../assets/lanyard/card.glb';
import lanyard from '../assets/lanyard/lanyard.png';

import * as THREE from 'three';
import './Lanyard.css';

extend({ MeshLineGeometry, MeshLineMaterial });

// R3F only uses Canvas `camera.position` as the *initial* value. Keep the
// framed size in sync when the responsive distance changes (mobile/desktop).
function CameraFramer({ x, y, z, fov }) {
  const camera = useThree(state => state.camera);
  useEffect(() => {
    camera.position.set(x, y, z);
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }, [camera, x, y, z, fov]);
  return null;
}

// React's root touch listeners are passive, so preventDefault() in JSX
// onTouchMove is ignored. A non-passive listener on the canvas keeps the
// page from scrolling and stealing the drag (mobile-only freeze).
function TouchGuard() {
  const gl = useThree(state => state.gl);
  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = 'none';
    const preventScroll = event => event.preventDefault();
    el.addEventListener('touchstart', preventScroll, { passive: false });
    el.addEventListener('touchmove', preventScroll, { passive: false });
    return () => {
      el.removeEventListener('touchstart', preventScroll);
      el.removeEventListener('touchmove', preventScroll);
    };
  }, [gl]);
  return null;
}

// 1x1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb). Each
// custom image is composited into its own half so the two faces render
// independently, aspect-preserving (no stretching).
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

// Stepwise blit so a small source (e.g. 400² headshot) is not softened by a
// single 3× canvas upscale, then another GPU mipmap pass.
function blitHighQuality(ctx, img, dx, dy, dw, dh) {
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const sw = img.width;
  const sh = img.height;
  if (dw <= sw && dh <= sh) {
    ctx.drawImage(img, dx, dy, dw, dh);
    return;
  }
  let src = img;
  let cw = sw;
  let ch = sh;
  while (cw * 2 < dw || ch * 2 < dh) {
    const nw = Math.min(dw, cw * 2);
    const nh = Math.min(dh, ch * 2);
    const step = document.createElement('canvas');
    step.width = nw;
    step.height = nh;
    const stepCtx = step.getContext('2d');
    if (!stepCtx) break;
    stepCtx.imageSmoothingEnabled = true;
    stepCtx.imageSmoothingQuality = 'high';
    stepCtx.drawImage(src, 0, 0, nw, nh);
    src = step;
    cw = nw;
    ch = nh;
  }
  ctx.drawImage(src, dx, dy, dw, dh);
}

// Keeps a texture/WebGL failure inside the Canvas from unmounting the whole
// React root (drei's useTexture throws synchronously on a 404 image path).
// resetKey remounts after a live viewport change so a DevTools device-mode
// switch cannot leave this stuck on a blank fallback.
class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}

function useIsMobile(breakpoint = 768) {
  const query = `(max-width: ${breakpoint - 1}px)`;
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    window.addEventListener('resize', sync);
    window.visualViewport?.addEventListener('resize', sync);
    return () => {
      mq.removeEventListener('change', sync);
      window.removeEventListener('resize', sync);
      window.visualViewport?.removeEventListener('resize', sync);
    };
  }, [query]);

  return isMobile;
}

// DevTools device-mode and flex reflow can briefly report 0×0 or lose the
// WebGL context. Keep the camera/backing store in sync, and ask the parent
// to remount if the context dies.
function CanvasResizer({ onContextLost }) {
  const { gl, camera, invalidate } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const apply = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 2 || h < 2) return;
      const pr = Math.min(window.devicePixelRatio || 1, 2);
      gl.setPixelRatio(pr);
      gl.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      invalidate();
    };

    apply();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(apply) : null;
    ro?.observe(canvas);
    window.addEventListener('resize', apply);
    window.visualViewport?.addEventListener('resize', apply);

    const onLost = event => {
      event.preventDefault();
      onContextLost?.();
    };
    const onRestored = () => apply();
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', apply);
      window.visualViewport?.removeEventListener('resize', apply);
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
    };
  }, [gl, camera, invalidate, onContextLost]);

  return null;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  // When true, the physics simulation is held so the card stays at its raised
  // spawn pose. Flip to false to start the gravity drop-in. Defaults to false so
  // standalone usage animates immediately as before.
  paused = false
}) {
  const isMobile = useIsMobile(768);
  const [contextEpoch, setContextEpoch] = useState(0);
  const bumpContext = useRef(() => setContextEpoch(n => n + 1));
  const wrapRef = useRef(null);
  const [slotReady, setSlotReady] = useState(true);
  const [glReady, setGlReady] = useState(false);
  const hasCustomImage = Boolean(frontImage || backImage);
  // World-space uniform scale so string + card grow together. Camera/FOV stay
  // at the caller values (no clip-from-zoom). Mobile is a bit smaller so the
  // stacked heading / Resume stay clear.
  const lanyardScale = isMobile ? 1.28 : 1.45;
  const camX = position[0];
  const camY = position[1];
  const camZ = position[2];
  const canvasKey = `${isMobile ? 'm' : 'd'}-${contextEpoch}`;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0]?.contentRect ?? {};
      setSlotReady(width > 2 && height > 2);
    });
    ro.observe(el);
    setSlotReady(el.clientWidth > 2 && el.clientHeight > 2);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setGlReady(false);
  }, [canvasKey]);

  return (
    <div
      className={`lanyard-wrapper${glReady ? ' gl-ready' : ''}`}
      ref={wrapRef}
      style={{ backgroundColor: '#000' }}
    >
      <CanvasErrorBoundary resetKey={canvasKey}>
      {slotReady && (
      <Canvas
        key={canvasKey}
        camera={{ position: [camX, camY, camZ], fov: fov }}
        dpr={[1, 2]}
        resize={{ scroll: false, debounce: 0 }}
        style={{
          touchAction: 'none',
          width: '100%',
          height: '100%',
          backgroundColor: '#000'
        }}
        gl={{
          // Transparent buffer so the CSS-black wrapper shows through the
          // 1–2 frames before setClearColor. alpha:false painted the UA's
          // default white bitmap over the whole hero slot (see reload flash).
          alpha: true,
          antialias: true,
          premultipliedAlpha: true,
          // ACES lifts blacks and desaturates portraits. Custom photos skip it
          // so headshot.png matches its file; the default card texture keeps ACES.
          toneMapping: hasCustomImage ? THREE.NoToneMapping : THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor(0x000000, 1);
          gl.clear();
          scene.background = new THREE.Color(0x000000);
          // Wait two painted frames so the cleared buffer, not the UA white
          // default, is what becomes visible.
          requestAnimationFrame(() => {
            gl.clear();
            requestAnimationFrame(() => setGlReady(true));
          });
        }}
      >
        <CanvasResizer onContextLost={bumpContext.current} />
        <CameraFramer x={camX} y={camY} z={camZ} fov={fov} />
        <TouchGuard />
        <ambientLight intensity={Math.PI} />
        {/* Band suspends on GLB/texture load. Keep that work off-screen so the
            white untextured card never paints; the canvas stays black. */}
        <Suspense fallback={null}>
        <Physics paused={paused} gravity={gravity} timeStep={1 / 60}>
          <Band
            isMobile={isMobile}
            frontImage={frontImage}
            backImage={backImage}
            imageFit={imageFit}
            lanyardImage={lanyardImage}
            lanyardWidth={lanyardWidth}
            lanyardScale={lanyardScale}
          />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
        </Suspense>
      </Canvas>
      )}
      </CanvasErrorBoundary>
    </div>
  );
}
function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  lanyardScale = 1
}) {
  const band = useRef(),
    fixed = useRef(),
    j1 = useRef(),
    j2 = useRef(),
    j3 = useRef(),
    card = useRef();
  const vec = new THREE.Vector3(),
    ang = new THREE.Vector3(),
    rot = new THREE.Vector3(),
    dir = new THREE.Vector3();
  // Sleeping mid-swing is a common mobile freeze (30–60ms steps + damping
  // drop the body under the sleep threshold). Desktop still feels the same
  // because wakeUp() already ran every drag frame; this only keeps the
  // post-flick settle alive on touch devices.
  const segmentProps = { type: 'dynamic', canSleep: !isMobile, colliders: false, angularDamping: 4, linearDamping: 4 };
  const gl = useThree(state => state.gl);
  const { nodes, materials } = useGLTF(cardGLB);
  const texture = useTexture(lanyardImage || lanyard);
  // useTexture must be called unconditionally; use a blank pixel when an image
  // isn't supplied for a given face, then skip compositing it below.
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  // Composite the front/back images into the card's texture atlas (front = left
  // half, back = right half). Each image is drawn aspect-preserving (no stretch).
  const cardMap = useMemo(() => {
    const baseMap = materials.base.map;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image;
    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    // Keep the original baked atlas for the card edges and any untouched face.
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img, rect) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      blitHighQuality(ctx, img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT);
    if (backImage && backTex.image) drawFitted(backTex.image, BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    // Mipmaps + LinearMipmapLinearFilter make a canvas-upscaled portrait look
    // soft (the card sits at an angle, so a lower mip is sampled). Keep the
    // baked pixels and let the GPU do a single linear filter.
    composite.generateMipmaps = false;
    composite.minFilter = THREE.LinearFilter;
    composite.magFilter = THREE.LinearFilter;
    composite.anisotropy = gl.capabilities.getMaxAnisotropy();
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map, gl]);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState(false);
  const [hovered, hover] = useState(false);

  const S = lanyardScale;

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.5, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => void (document.body.style.cursor = 'auto');
    }
  }, [hovered, dragged]);

  // Touch often fires pointercancel / drops capture when the UA starts a
  // scroll. If we only listen for pointerup on the mesh, `dragged` stays
  // truthy and the body is left kinematic (frozen). Window listeners are a
  // no-op on a normal desktop mouse-up (onPointerUp already cleared it).
  useEffect(() => {
    if (!dragged) return;
    const endDrag = () => drag(false);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
    return () => {
      window.removeEventListener('pointerup', endDrag);
      window.removeEventListener('pointercancel', endDrag);
    };
  }, [dragged]);

  useFrame((state, delta) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={card} {...segmentProps} type={dragged ? 'kinematicPosition' : 'dynamic'}>
          <CuboidCollider args={[0.8 * S, 1.125 * S, 0.01]} />
          <group
            scale={2.25 * S}
            position={[0, -1.2 * S, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerDown={e => {
              e.stopPropagation();
              gl.domElement.setPointerCapture?.(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
            onPointerUp={e => {
              if (gl.domElement.hasPointerCapture?.(e.pointerId)) {
                gl.domElement.releasePointerCapture(e.pointerId);
              }
              drag(false);
            }}
            onPointerCancel={() => drag(false)}
            onLostPointerCapture={() => drag(false)}
          >
            <mesh geometry={nodes.card.geometry}>
              {frontImage || backImage ? (
                // Custom photos must stay unlit. meshPhysicalMaterial + IBL
                // (metalness 0.8, clearcoat 1, Environment lightformers) treats
                // the albedo as a metallic reflector and ACES-tone-maps it,
                // which is what made headshot.png look faded/washed-out.
                <meshBasicMaterial
                  map={cardMap}
                  map-anisotropy={cardMap.anisotropy}
                  transparent={false}
                  opacity={1}
                  toneMapped={false}
                  envMap={null}
                />
              ) : (
                <meshPhysicalMaterial
                  map={cardMap}
                  map-anisotropy={16}
                  clearcoat={isMobile ? 0 : 1}
                  clearcoatRoughness={0.15}
                  roughness={0.9}
                  metalness={0.8}
                />
              )}
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={lanyardWidth * S}
        />
      </mesh>
    </>
  );
}
