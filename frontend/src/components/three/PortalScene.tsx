"use client";

import React, { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";

/* ─── 3D Portal Ring ─── */
function PortalRing({ radius, color, speed, z }: { radius: number; color: string; speed: number; z: number }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z += delta * speed;
    // Move ring forward to create "passing through" effect
    meshRef.current.position.z += delta * 4;
    if (meshRef.current.position.z > 5) {
      meshRef.current.position.z = -15;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, z]}>
      <torusGeometry args={[radius, 0.05, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

/* ─── 3D Portal Particles ─── */
function TunnelParticles({ count = 1000 }) {
  const pointsRef = useRef<THREE.Points>(null!);
  
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const palette = [new THREE.Color("#6366f1"), new THREE.Color("#10b981"), new THREE.Color("#f43f5e")];
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 3;
      const z = (Math.random() - 0.5) * 40;
      
      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = Math.sin(theta) * radius;
      pos[i * 3 + 2] = z;
      
      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.z += delta * 0.2;
    const posArr = pointsRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3 + 2] += delta * 15; // Move particles fast towards camera
      if (posArr[i * 3 + 2] > 5) posArr[i * 3 + 2] = -35;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

/* ─── 3D Scene Content ─── */
function Portal3DContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <fog attach="fog" args={["#000000", 2, 20]} />
      
      {/* Series of glowing rings forming a tunnel */}
      {[...Array(12)].map((_, i) => (
        <PortalRing 
          key={i} 
          radius={2 + (i % 3) * 0.5} 
          color={i % 2 === 0 ? "#6366f1" : "#10b981"} 
          speed={i % 2 === 0 ? 0.5 : -0.3} 
          z={-15 + i * 1.5} 
        />
      ))}
      
      <TunnelParticles count={1500} />
      
      <Stars radius={50} depth={50} count={3000} factor={4} saturation={1} fade speed={2} />
    </>
  );
}

/* ─── 2D Animated CSS Fallback for Low-End Devices ─── */
function Portal2DFallback() {
  return (
    <div className="absolute inset-0 bg-black overflow-hidden flex items-center justify-center">
      {/* Deep Space Background */}
      <motion.div
        animate={{ scale: [1, 2], opacity: [0.2, 0.8] }}
        transition={{ duration: 3, ease: "easeIn" }}
        className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-black to-emerald-900/40"
      />
      
      {/* Hyperdrive "Warp" Effect Lines */}
      {[...Array(40)].map((_, i) => {
        const angle = (i * 360) / 40;
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 origin-left"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <motion.div
              initial={{ x: 50, width: 0, opacity: 0 }}
              animate={{ 
                x: [50, window.innerWidth], 
                width: [10, 150], 
                opacity: [0, 1, 0] 
              }}
              transition={{
                duration: Math.random() * 0.5 + 0.5,
                repeat: Infinity,
                ease: "easeIn",
                delay: Math.random() * 2
              }}
              className="h-[2px] bg-white rounded-full shadow-[0_0_10px_#fff]"
              style={{
                backgroundColor: i % 3 === 0 ? "#6366f1" : i % 3 === 1 ? "#10b981" : "#f43f5e"
              }}
            />
          </motion.div>
        );
      })}

      {/* Pulsing Central Portal Eye */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 5, 20] }}
        transition={{ duration: 2.5, ease: "easeIn" }}
        className="absolute w-[100px] h-[100px] bg-white rounded-full blur-[20px]"
      />
    </div>
  );
}

/* ─── Main Portal Scene Component ─── */
export default function PortalScene() {
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      if (gl) {
        setCanRender(true);
      }
    } catch (e) {
      // WebGL not supported
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Title that overlays the portal */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute z-10 flex flex-col items-center pointer-events-none"
      >
        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-widest text-center drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
          Entrando no
          <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-secondary animate-gradient">
            Clube do Livro
          </span>
        </h1>
        <p className="mt-4 text-white/80 font-medium tracking-widest uppercase text-sm drop-shadow-md">
          Preparando sua jornada literária...
        </p>
      </motion.div>

      {/* Render 3D Canvas if supported, else incredibly cool 2D warp fallback */}
      {canRender ? (
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <Portal3DContent />
          </Suspense>
        </Canvas>
      ) : (
        <Portal2DFallback />
      )}
    </div>
  );
}
