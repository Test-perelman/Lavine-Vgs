"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { Menu, ChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export const HorizonHeroSection = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLDivElement>(null);
    const scrollProgressRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const cameraVelocity = useRef({ x: 0, y: 0, z: 0 });

    const [scrollProgress, setScrollProgress] = useState(0);
    const [currentSection, setCurrentSection] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const totalSections = 3; // Changed to 3 to match the titles mapping length

    const threeRefs = useRef({
        scene: null as THREE.Scene | null,
        camera: null as THREE.PerspectiveCamera | null,
        renderer: null as THREE.WebGLRenderer | null,
        composer: null as EffectComposer | null,
        stars: [] as THREE.Points[],
        nebula: null as THREE.Mesh | null,
        mountains: [] as THREE.Mesh[],
        animationId: null as number | null,
        targetCameraX: 0,
        targetCameraY: 30,
        targetCameraZ: 100,
        locations: [] as number[],
    });

    // Initialize Three.js
    useEffect(() => {
        const initThree = () => {
            const { current: refs } = threeRefs;
            if (!canvasRef.current) return;

            // Theme Colors (Updated: Lavine Brand Blue & Yellow/Gold)
            const theme = {
                fog: 0x0a1014, // Dark Blue-Grey/Black for depth
                nebula1: new THREE.Color("#005c99"), // Brand Blue (Deep/Rich)
                nebula2: new THREE.Color("#e6b800"), // Brand Yellow/Gold (Warm)
                mountain1: 0x0a1014, // Darkest
                mountain2: 0x111a21,
                mountain3: 0x18242e,
                mountain4: 0x20303d, // Hint of blue in the mountains
            };

            // Scene setup
            refs.scene = new THREE.Scene();
            refs.scene.fog = new THREE.FogExp2(theme.fog, 0.00025);
            refs.scene.background = new THREE.Color(theme.fog);

            // Camera
            refs.camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth / window.innerHeight,
                0.1,
                4000
            );
            refs.camera.position.z = 100;
            refs.camera.position.y = 20;

            // Renderer
            refs.renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                antialias: true,
                alpha: true,
            });
            refs.renderer.setSize(window.innerWidth, window.innerHeight);
            refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            refs.renderer.toneMappingExposure = 0.5;

            // Post-processing
            refs.composer = new EffectComposer(refs.renderer);
            const renderPass = new RenderPass(refs.scene, refs.camera);
            refs.composer.addPass(renderPass);

            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                0.8, // Strength
                0.4, // Radius
                0.85 // Threshold
            );
            refs.composer.addPass(bloomPass);

            // Create scene elements
            createStarField(theme);
            createNebula(theme);
            createMountains(theme);
            createAtmosphere(theme);
            getLocation();

            // Start animation
            animate();

            // Mark as ready after Three.js is initialized
            setIsReady(true);
        };

        const createStarField = (theme: any) => {
            const { current: refs } = threeRefs;
            if (!refs.scene) return;

            const starCount = 5000;

            for (let i = 0; i < 3; i++) {
                const geometry = new THREE.BufferGeometry();
                const positions = new Float32Array(starCount * 3);
                const colors = new Float32Array(starCount * 3);
                const sizes = new Float32Array(starCount);

                for (let j = 0; j < starCount; j++) {
                    const radius = 200 + Math.random() * 800;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(Math.random() * 2 - 1);

                    positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
                    positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
                    positions[j * 3 + 2] = radius * Math.cos(phi);

                    // Color variation - Blue/Gold/White
                    const color = new THREE.Color();
                    const colorChoice = Math.random();
                    if (colorChoice < 0.6) {
                        color.setHSL(0.6, 0.4, 0.9); // Pale Blue-ish White
                    } else if (colorChoice < 0.8) {
                        color.setHSL(0.12, 0.8, 0.7); // Gold/Yellow tint
                    } else {
                        color.setHSL(0.6, 0.8, 0.7); // Blue tint
                    }

                    colors[j * 3] = color.r;
                    colors[j * 3 + 1] = color.g;
                    colors[j * 3 + 2] = color.b;

                    sizes[j] = Math.random() * 2 + 0.5;
                }

                geometry.setAttribute(
                    "position",
                    new THREE.BufferAttribute(positions, 3)
                );
                geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
                geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

                const material = new THREE.ShaderMaterial({
                    uniforms: {
                        time: { value: 0 },
                        depth: { value: i },
                    },
                    vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              
              // Slow rotation based on depth
              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
                    fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
                    transparent: true,
                    blending: THREE.AdditiveBlending,
                    depthWrite: false,
                });

                const stars = new THREE.Points(geometry, material);
                refs.scene.add(stars);
                refs.stars.push(stars);
            }
        };

        const createNebula = (theme: any) => {
            const { current: refs } = threeRefs;
            if (!refs.scene) return;

            const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color1: { value: theme.nebula1 },
                    color2: { value: theme.nebula2 },
                    opacity: { value: 0.3 }
                },
                vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
                fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
                transparent: true,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide,
                depthWrite: false,
            });

            const nebula = new THREE.Mesh(geometry, material);
            nebula.position.z = -1050;
            nebula.rotation.x = 0;
            refs.scene.add(nebula);
            refs.nebula = nebula;
        };

        const createMountains = (theme: any) => {
            const { current: refs } = threeRefs;
            const scene = refs.scene;
            if (!scene) return;

            const layers = [
                { distance: -50, height: 60, color: theme.mountain1, opacity: 1 },
                { distance: -100, height: 80, color: theme.mountain2, opacity: 0.8 },
                { distance: -150, height: 100, color: theme.mountain3, opacity: 0.6 },
                { distance: -200, height: 120, color: theme.mountain4, opacity: 0.4 },
            ];

            layers.forEach((layer, index) => {
                const points = [];
                const segments = 50;

                for (let i = 0; i <= segments; i++) {
                    const x = (i / segments - 0.5) * 1000;
                    const y =
                        Math.sin(i * 0.1) * layer.height +
                        Math.sin(i * 0.05) * layer.height * 0.5 +
                        Math.random() * layer.height * 0.2 -
                        100;
                    points.push(new THREE.Vector2(x, y));
                }

                points.push(new THREE.Vector2(5000, -300));
                points.push(new THREE.Vector2(-5000, -300));

                const shape = new THREE.Shape(points);
                const geometry = new THREE.ShapeGeometry(shape);
                const material = new THREE.MeshBasicMaterial({
                    color: layer.color,
                    transparent: true,
                    opacity: layer.opacity,
                    side: THREE.DoubleSide,
                });

                const mountain = new THREE.Mesh(geometry, material);
                mountain.position.z = layer.distance;
                mountain.position.y = layer.distance; // This seems weird in original but keeping it valid
                mountain.userData = { baseZ: layer.distance, index };
                scene.add(mountain);
                refs.mountains.push(mountain);
            });
        };

        const createAtmosphere = (theme: any) => {
            const { current: refs } = threeRefs;
            if (!refs.scene) return;

            const geometry = new THREE.SphereGeometry(600, 32, 32);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                },
                vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
                fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            // Atmosphere color - Deep Blue with a hint of Gold warmth
            vec3 atmosphere = vec3(0.0, 0.3, 0.6) * intensity; // Brand Blue base
            
            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;
            
            // Add golden rim light
            atmosphere += vec3(0.2, 0.15, 0.0) * intensity * 0.5;
            
            gl_FragColor = vec4(atmosphere, intensity * 0.3);
          }
        `,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                transparent: true,
            });

            const atmosphere = new THREE.Mesh(geometry, material);
            refs.scene.add(atmosphere);
        };

        const animate = () => {
            const { current: refs } = threeRefs;
            refs.animationId = requestAnimationFrame(animate);

            const time = Date.now() * 0.001;

            // Update stars
            refs.stars.forEach((starField) => {
                if (starField.material instanceof THREE.ShaderMaterial) {
                    starField.material.uniforms.time.value = time;
                }
            });

            // Update nebula
            if (
                refs.nebula &&
                refs.nebula.material instanceof THREE.ShaderMaterial
            ) {
                refs.nebula.material.uniforms.time.value = time * 0.5;
            }

            // Smooth camera movement with easing
            if (refs.camera && refs.targetCameraX !== undefined) {
                const smoothingFactor = 0.05;

                // Calculate smooth position with easing
                smoothCameraPos.current.x +=
                    (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
                smoothCameraPos.current.y +=
                    (refs.targetCameraY - smoothCameraPos.current.y) * smoothingFactor;
                smoothCameraPos.current.z +=
                    (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor;

                // Add subtle floating motion
                const floatX = Math.sin(time * 0.1) * 2;
                const floatY = Math.cos(time * 0.15) * 1;

                // Apply final position
                refs.camera.position.x = smoothCameraPos.current.x + floatX;
                refs.camera.position.y = smoothCameraPos.current.y + floatY;
                refs.camera.position.z = smoothCameraPos.current.z;
                refs.camera.lookAt(0, 10, -600);
            }

            // Parallax mountains with subtle animation
            refs.mountains.forEach((mountain, i) => {
                const parallaxFactor = 1 + i * 0.5;
                mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor;
                // Keep the y position relative to its initial placement but adding float
                // Note: original code overwrote Y in animate loop which might cause jump if not careful
                // but here we just add floating to it? The original code set absolute Y.
                // Let's stick to original logic:
                mountain.position.y = 50 + (Math.cos(time * 0.15) * 1 * parallaxFactor);
                // Wait, original logic set Y based on time completely, ignoring init Y?
                // Original: mountain.position.y = 50 + ...
                // I will keep it.
            });

            if (refs.composer) {
                refs.composer.render();
            }
        };

        initThree();

        // Handle resize
        const handleResize = () => {
            const { current: refs } = threeRefs;
            if (refs.camera && refs.renderer && refs.composer) {
                refs.camera.aspect = window.innerWidth / window.innerHeight;
                refs.camera.updateProjectionMatrix();
                refs.renderer.setSize(window.innerWidth, window.innerHeight);
                refs.composer.setSize(window.innerWidth, window.innerHeight);
            }
        };

        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            const { current: refs } = threeRefs;

            if (refs.animationId) {
                cancelAnimationFrame(refs.animationId);
            }

            window.removeEventListener("resize", handleResize);

            // Dispose Three.js resources
            refs.stars.forEach((starField) => {
                starField.geometry.dispose();
                if (starField.material instanceof THREE.Material) {
                    starField.material.dispose();
                }
            });

            refs.mountains.forEach((mountain) => {
                mountain.geometry.dispose();
                if (mountain.material instanceof THREE.Material) {
                    mountain.material.dispose();
                }
            });

            if (refs.nebula) {
                refs.nebula.geometry.dispose();
                if (refs.nebula.material instanceof THREE.Material) {
                    refs.nebula.material.dispose();
                }
            }

            if (refs.renderer) {
                refs.renderer.dispose();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getLocation = () => {
        const { current: refs } = threeRefs;
        const locations: number[] = [];
        refs.mountains.forEach((mountain, i) => {
            locations[i] = mountain.position.z;
        });
        refs.locations = locations;
    };

    // GSAP Animations - Run after component is ready
    useEffect(() => {
        if (!isReady) return;

        // Set initial states to prevent flash
        gsap.set(
            [menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current],
            {
                visibility: "visible",
            }
        );

        const tl = gsap.timeline();

        // Animate menu
        if (menuRef.current) {
            tl.from(menuRef.current, {
                x: -100,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
            });
        }

        // Animate title with split text
        if (titleRef.current) {
            const titleChars = titleRef.current.querySelectorAll(".title-char");
            tl.from(
                titleChars,
                {
                    y: 200,
                    opacity: 0,
                    duration: 1.5,
                    stagger: 0.05,
                    ease: "power4.out",
                },
                "-=0.5"
            );
        }

        // Animate subtitle lines
        if (subtitleRef.current) {
            const subtitleLines =
                subtitleRef.current.querySelectorAll(".subtitle-line");
            tl.from(
                subtitleLines,
                {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.2,
                    ease: "power3.out",
                },
                "-=0.8"
            );
        }

        // Animate scroll indicator
        if (scrollProgressRef.current) {
            tl.from(
                scrollProgressRef.current,
                {
                    opacity: 0,
                    y: 50,
                    duration: 1,
                    ease: "power2.out",
                },
                "-=0.5"
            );
        }

        return () => {
            tl.kill();
        };
    }, [isReady]);

    // Scroll handling
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const maxScroll = documentHeight - windowHeight;
            const progress = Math.min(scrollY / maxScroll, 1);

            setScrollProgress(progress);
            const newSection = Math.floor(progress * totalSections);
            setCurrentSection(newSection);

            const { current: refs } = threeRefs;

            // Calculate smooth progress through all sections
            const totalProgress = progress * totalSections;
            const sectionProgress = totalProgress % 1;

            // Define camera positions for each section
            const cameraPositions = [
                { x: 0, y: 30, z: 300 }, // Section 0 - HORIZON
                { x: 0, y: 40, z: -50 }, // Section 1 - COSMOS
                { x: 0, y: 50, z: -700 }, // Section 2 - INFINITY
                { x: 0, y: 60, z: -1200 }, // Extra for safety
            ];

            // Get current and next positions
            const currentPos = cameraPositions[newSection] || cameraPositions[0];
            const nextPos = cameraPositions[newSection + 1] || currentPos;

            // Set target positions (actual smoothing happens in animate loop)
            refs.targetCameraX =
                currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
            refs.targetCameraY =
                currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
            refs.targetCameraZ =
                currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

            // Smooth parallax for mountains
            refs.mountains.forEach((mountain, i) => {
                const speed = 1 + i * 0.9;
                const targetZ = mountain.userData.baseZ + scrollY * speed * 0.5;

                if (refs.nebula) {
                    refs.nebula.position.z = targetZ + progress * speed * 0.01 - 100;
                }

                // Use the same smoothing approach
                // mountain.userData.targetZ = targetZ; // Not used in current animate loop
                if (progress > 0.7) {
                    mountain.position.z = 60000; // Move far away
                } else {
                    // Reset to original-ish relative position if we scroll back up?
                    // The original code had: if (progress < 0.7) mountain.position.z = refs.locations[i]
                    // But wait, the parallax logic above: `targetZ = ...` overrides this?
                    // Let's use the logic from the snippet provided:
                    if (progress < 0.7 && refs.locations[i] !== undefined) {
                        // Actually the original code had:
                        // mountain.userData.targetZ = targetZ;
                        // const location = mountain.position.z (not used)
                        // if (progress > 0.7) mountain.position.z = 600000;
                        // if (progress < 0.7) mountain.position.z = refs.locations[i]

                        // This seems to Reset the mountain position abruptly? 
                        // I will trust the provided snippet but clean it up slightly.
                        mountain.position.z = refs.locations[i] + scrollY * speed * 0.5;
                    }
                }
            });

            if (refs.nebula && refs.mountains[3]) {
                // refs.nebula.position.z = refs.mountains[3].position.z; // This overrides the previous nebula set?
                // I will comment this out as it might conflict with the line above.
                // The provided code had both. I'll stick to a smooth interpolation.
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Set initial position

        return () => window.removeEventListener("scroll", handleScroll);
    }, [totalSections]);

    const splitTitle = (text: string) => {
        return text.split("").map((char, i) => (
            <span key={i} className="title-char inline-block">
                {char === " " ? "\u00A0" : char}
            </span>
        ));
    };

    return (
        <div ref={containerRef} className="hero-container relative w-full bg-[#1A1A1A] text-[#F4F2ED] overflow-x-hidden">
            <canvas
                ref={canvasRef}
                className="hero-canvas fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
            />

            {/* Side menu */}
            <div
                ref={menuRef}
                className="side-menu fixed left-8 top-1/2 -translate-y-1/2 z-50 mix-blend-difference hidden md:block"
                style={{ visibility: "hidden" }}
            >
                <div className="menu-icon cursor-pointer mb-6 hover:opacity-70 transition-opacity">
                    <Menu className="w-8 h-8" />
                </div>
                <div className="vertical-text text-xs tracking-[0.3em]" style={{ writingMode: "vertical-rl" }}>
                    DESIGN
                </div>
            </div>

            {/* Main content */}
            <div className="hero-content relative z-10 h-screen flex flex-col items-center justify-center text-center p-6">
                <h1
                    ref={titleRef}
                    className="hero-title text-6xl md:text-9xl font-bold tracking-tighter mb-6 overflow-hidden"
                >
                    {splitTitle("LAVINE")}
                </h1>

                <div
                    ref={subtitleRef}
                    className="hero-subtitle text-lg md:text-xl font-light tracking-widest uppercase opacity-80"
                >
                    <p className="subtitle-line">Where vision meets reality,</p>
                    <p className="subtitle-line">we shape the future of tomorrow</p>
                </div>
            </div>

            {/* Scroll progress indicator */}
            <div
                ref={scrollProgressRef}
                className="scroll-progress fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center gap-4 mix-blend-difference"
                style={{ visibility: "hidden" }}
            >
                <div className="scroll-text text-xs tracking-[0.2em] transform -rotate-90 origin-center translate-y-8">
                    SCROLL
                </div>
                <div className="progress-track w-[1px] h-32 bg-white/20 relative mt-12">
                    <div
                        className="progress-fill absolute top-0 left-0 w-full bg-white transition-all duration-300 ease-out"
                        style={{ height: `${scrollProgress * 100}%` }}
                    />
                </div>
                <div className="section-counter text-xs font-mono">
                    {String(currentSection + 1).padStart(2, "0")} / {String(totalSections).padStart(2, "0")}
                </div>
            </div>

            {/* Scroll Down Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce mix-blend-difference opacity-50">
                <ChevronDown className="w-6 h-6" />
            </div>


            {/* Additional sections for scrolling */}
            <div className="scroll-sections relative z-10 w-full">
                {[...Array(2)].map((_, i) => {
                    const titles: Record<number, string> = {
                        1: "STUDIO",
                        2: "FUTURE",
                    };

                    const subtitles: Record<number, { line1: string; line2: string }> = {
                        1: {
                            line1: "Beyond the boundaries of imagination,",
                            line2: "lies the universe of possibilities",
                        },
                        2: {
                            line1: "In the space between thought and creation,",
                            line2: "we find the essence of true innovation",
                        },
                    };

                    return (
                        <section
                            key={i}
                            className="content-section h-screen flex flex-col items-center justify-center text-center p-6"
                        >
                            <h1 className="hero-title text-6xl md:text-9xl font-bold tracking-tighter mb-6">
                                {/* To trigger animations again we might need individual refs or IntersectionObserver, 
                 but for checking the effect we'll keep it static text here for now or use the same style */}
                                {titles[i + 1]}
                            </h1>

                            <div className="hero-subtitle text-lg md:text-xl font-light tracking-widest uppercase opacity-80">
                                <p className="subtitle-line">{subtitles[i + 1].line1}</p>
                                <p className="subtitle-line">{subtitles[i + 1].line2}</p>
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
};
