import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeDScrollCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 24;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfb76c,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false
    });

    const obsidianMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f1f26,
      metalness: 0.9,
      roughness: 0.4
    });

    const wireframeGold = new THREE.MeshBasicMaterial({
      color: 0xc5a059,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    // 4. 3D Elements Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Geometry A: Floating Torus Knot (Architectural Barber Helix)
    const torusKnotGeo = new THREE.TorusKnotGeometry(2.8, 0.45, 128, 32, 2, 3);
    const torusKnot = new THREE.Mesh(torusKnotGeo, goldMaterial);
    torusKnot.position.set(-7, 3, -2);
    mainGroup.add(torusKnot);

    // Geometry B: Stylized Razor Blade Plate
    const razorGeo = new THREE.BoxGeometry(4.2, 2.2, 0.08);
    const razorMesh = new THREE.Mesh(razorGeo, obsidianMaterial);
    razorMesh.position.set(8, -2, -1);
    razorMesh.rotation.z = Math.PI / 4;
    mainGroup.add(razorMesh);

    // Geometry C: Concentric Floating Ring
    const ringGeo = new THREE.TorusGeometry(4.5, 0.08, 16, 100);
    const ringMesh = new THREE.Mesh(ringGeo, wireframeGold);
    ringMesh.position.set(0, -1, -5);
    mainGroup.add(ringMesh);

    // Geometry D: 3D Barber Shear Blades (stylized crossing prisms)
    const shearGeo = new THREE.CylinderGeometry(0.08, 0.12, 6, 16);
    const shearBlade1 = new THREE.Mesh(shearGeo, goldMaterial);
    shearBlade1.position.set(6, 4, 1);
    shearBlade1.rotation.z = 0.6;
    const shearBlade2 = new THREE.Mesh(shearGeo, goldMaterial);
    shearBlade2.position.set(6, 4, 1);
    shearBlade2.rotation.z = -0.6;
    mainGroup.add(shearBlade1);
    mainGroup.add(shearBlade2);

    // Geometry E: Floating Golden Stardust Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 40;
      particlePositions[i + 1] = (Math.random() - 0.5) * 40;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xdfb76c,
      size: 0.12,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffeedd, 2.5);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const pointLight = new THREE.PointLight(0xc5a059, 3, 50);
    pointLight.position.set(-10, -5, 10);
    scene.add(pointLight);

    // 6. Scroll Interaction & Animation Loop
    let targetScrollY = 0;
    let currentScrollY = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll lerp (damping)
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;
      const scrollFactor = currentScrollY * 0.0025;

      // Rotate and tumble groups based on scroll + time
      mainGroup.rotation.y = elapsedTime * 0.1 + scrollFactor * 1.5;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1 + scrollFactor * 0.5;
      mainGroup.position.y = -scrollFactor * 3.5;

      // Individual object transformations on scroll
      torusKnot.rotation.x = elapsedTime * 0.3 + scrollFactor * 2;
      torusKnot.rotation.y = elapsedTime * 0.2 + scrollFactor;

      razorMesh.rotation.y = elapsedTime * 0.4 + scrollFactor * 3;
      razorMesh.rotation.z = Math.PI / 4 + scrollFactor * 1.2;

      ringMesh.rotation.x = elapsedTime * 0.15 - scrollFactor;
      ringMesh.rotation.y = elapsedTime * 0.25 + scrollFactor * 2;

      shearBlade1.rotation.y = elapsedTime * 0.5 + scrollFactor;
      shearBlade2.rotation.y = -elapsedTime * 0.5 - scrollFactor;

      particles.rotation.y = elapsedTime * 0.05 + scrollFactor * 0.2;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      torusKnotGeo.dispose();
      razorGeo.dispose();
      ringGeo.dispose();
      shearGeo.dispose();
      particleGeo.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-35 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
};
