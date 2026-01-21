"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export const Component = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current; // Capture ref for cleanup
        // SCENE SETUP
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x050505); // Match global dark
        scene.fog = new THREE.FogExp2(0x050505, 0.002);

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 5;
        camera.position.y = 1;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // PARTICLES / STARS
        const geometry = new THREE.BufferGeometry();
        const count = 2000;
        const posArray = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 50;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const material = new THREE.PointsMaterial({
            size: 0.05,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
        });

        const particlesMesh = new THREE.Points(geometry, material);
        scene.add(particlesMesh);

        // GRID / TERRAIN
        const planeGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
        const planeMaterial = new THREE.MeshBasicMaterial({
            color: 0x222222,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -1;
        scene.add(plane);


        // ANIMATION LOOP
        let frameId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            // Rotate particles
            particlesMesh.rotation.y = elapsedTime * 0.05;

            // Move plane to simulate forward motion
            plane.position.z = (elapsedTime * 2) % 2;

            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        };

        animate();

        // GSAP ENTRANCE
        const tl = gsap.timeline();
        tl.fromTo(
            titleRef.current,
            { opacity: 0, y: 100, scale: 1.2 },
            { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: "power3.out", delay: 0.5 }
        );

        // RESIZE HANDLER
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(frameId);
            if (container) {
                container.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            planeGeometry.dispose();
            planeMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* 3D Canvas Container */}
            <div ref={containerRef} className="absolute inset-0 z-0" />

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none">
                <h1
                    ref={titleRef}
                    className="text-[15vw] font-bold text-white leading-none tracking-tighter mix-blend-overlay opacity-0"
                    style={{ fontFamily: 'Inter, sans-serif' }} // Ensure font is loaded globally ideally
                >
                    LAVINE
                </h1>
                <p className="mt-4 text-sm uppercase tracking-[0.5em] text-gray-400">
                    Design Studio
                </p>
            </div>
        </div>
    );
};
