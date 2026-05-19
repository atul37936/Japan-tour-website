import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 400 : 1200;
const PARTICLE_SIZE = 0.7;
const BG_COLORS = { r: 0.831, g: 0.659, b: 0.325 };
const SHADOW_COLORS = { r: 0.784, g: 0.722, b: 0.859 };
const OPACITY = 0.6;

const vertexShader = `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform vec2 uMouse;

  attribute vec3 aPosition;
  attribute float aRandom;

  varying float vRandom;

  #define MOUSE_FORCE 0.2

  vec2 getWindOffset(float time, float random) {
    return vec2(cos(time * 0.5 + random), sin(time * 0.3 + random * 2.0)) * 0.1;
  }

  void main() {
    vRandom = aRandom;

    vec2 windOffset = getWindOffset(uTime, aRandom);
    vec3 finalPosition = aPosition + vec3(windOffset.x, windOffset.y + uTime * 0.02, 0.0);

    vec2 mouseOffset = (uMouse - finalPosition.xy) * MOUSE_FORCE;
    finalPosition.xy -= mouseOffset;

    vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
    gl_PointSize = uSize * uPixelRatio * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uBgColor;
  uniform vec3 uShadowColor;
  uniform float uOpacity;

  varying float vRandom;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;

    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= 0.8 + vRandom * 0.2;

    vec3 shadow = vec3(1.0) - uShadowColor;
    vec3 shadowedBg = uBgColor - shadow * 0.5;
    vec3 color = mix(shadowedBg, uShadowColor, vRandom);

    gl_FragColor = vec4(color, uOpacity * alpha);
  }
`;

function ParticleField() {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef(new THREE.Vector2(0, 0));
  const targetMouseRef = useRef(new THREE.Vector2(0, 0));
  const { viewport } = useThree();

  const { geometry, uniforms } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const randoms = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      randoms[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aPosition', new THREE.BufferAttribute(positions.slice(), 3));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    const uni = {
      uTime: { value: 0 },
      uSize: { value: PARTICLE_SIZE },
      uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uBgColor: { value: new THREE.Color(BG_COLORS.r, BG_COLORS.g, BG_COLORS.b) },
      uShadowColor: { value: new THREE.Color(SHADOW_COLORS.r, SHADOW_COLORS.g, SHADOW_COLORS.b) },
      uOpacity: { value: OPACITY },
    };

    return { geometry: geo, uniforms: uni };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetMouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    mouseRef.current.x += (targetMouseRef.current.x * viewport.width * 0.5 - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (targetMouseRef.current.y * viewport.height * 0.5 - mouseRef.current.y) * 0.05;
    uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroParticles() {
  return (
    <div className="absolute inset-0 z-[1] pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: false }}
      >
        <ParticleField />
      </Canvas>
    </div>
  );
}
