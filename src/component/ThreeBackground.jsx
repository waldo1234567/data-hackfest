import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function FloatingParticles({ count = 500, spread = [20, 20, 20] }) {
    const ref = useRef();
    const positions = useRef(
        Float32Array.from({ length: count * 3 }, (_, i) =>
            (Math.random() - 0.5) * spread[i % 3]
        ));

    useFrame(({ clock }) => {
        ref.current.rotation.y = clock.getElapsedTime() * 0.02;
    })

    return (
        <Points ref={ref} positions={positions.current} stride={3}>
            <PointMaterial
                transparent
                color="#ffffff"
                size={0.05}
                sizeAttenuation={true}
                onUpdate={mat => (mat.needsUpdate = true)}
            />
        </Points>
    );
}

export default function ThreeBackground({ className }) {
    return (
        <Canvas className={className} camera={{ position: [0, 0, 5], fov: 75 }} gl={{ antialias: true }}
            onCreated={({ gl }) => {
                gl.setClearColor('#000000', 1);
            }}>
            <ambientLight intensity={0.5} />
            <FloatingParticles count={1000} />
            <pointLight position={[10, 10, 10]} />
        </Canvas>
    );
}