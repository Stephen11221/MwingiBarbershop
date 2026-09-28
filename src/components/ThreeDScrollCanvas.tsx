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
    camera.position.set(0, 0, 24);

    // 2. High-Performance WebGL Renderer (Optimized for Speed)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Limit pixel ratio to 1.5 for ultra-fast rendering on Retina/Mobile without GPU strain
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // 3. Luxurious Gold Metallic Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xdfb76c,
      metalness: 0.92,
      roughness: 0.22,
    });

    const goldPolished = new THREE.MeshStandardMaterial({
      color: 0xf5c35b,
      metalness: 0.96,
      roughness: 0.12,
    });

    const goldDarkMechanic = new THREE.MeshStandardMaterial({
      color: 0x8f6f28,
      metalness: 0.88,
      roughness: 0.38,
    });

    const goldWireframe = new THREE.MeshBasicMaterial({
      color: 0xdfb76c,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const obsidianGold = new THREE.MeshStandardMaterial({
      color: 0x181820,
      metalness: 0.9,
      roughness: 0.3,
    });

    // Root Assembly Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // -------------------------------------------------------------
    // Helper: Create 3D Precision Mechanic Gear with Teeth
    // -------------------------------------------------------------
    const createMechanicGear = (
      radius: number,
      thickness: number,
      toothCount: number,
      toothDepth: number,
      mat: THREE.Material
    ) => {
      const gearGroup = new THREE.Group();

      // Center Hub
      const hubGeo = new THREE.CylinderGeometry(radius, radius, thickness, 32);
      const hubMesh = new THREE.Mesh(hubGeo, mat);
      hubMesh.rotation.x = Math.PI / 2;
      gearGroup.add(hubMesh);

      // Center Axle Hole (dark core)
      const axleGeo = new THREE.CylinderGeometry(radius * 0.3, radius * 0.3, thickness * 1.05, 16);
      const axleMesh = new THREE.Mesh(axleGeo, obsidianGold);
      axleMesh.rotation.x = Math.PI / 2;
      gearGroup.add(axleMesh);

      // Radial Cog Teeth
      const toothWidth = (Math.PI * 2 * radius) / (toothCount * 2.2);
      const toothGeo = new THREE.BoxGeometry(toothWidth, thickness * 0.95, toothDepth);

      for (let i = 0; i < toothCount; i++) {
        const angle = (i / toothCount) * Math.PI * 2;
        const toothMesh = new THREE.Mesh(toothGeo, mat);
        toothMesh.position.x = Math.cos(angle) * (radius + toothDepth * 0.4);
        toothMesh.position.y = Math.sin(angle) * (radius + toothDepth * 0.4);
        toothMesh.rotation.z = angle;
        gearGroup.add(toothMesh);
      }

      return gearGroup;
    };

    // -------------------------------------------------------------
    // ELEMENT 1: 3D RUNNING MECHANIC BARBER SHOVEL (Straight Razor Shaving Scoop)
    // -------------------------------------------------------------
    const barberShovelGroup = new THREE.Group();
    barberShovelGroup.position.set(-8, 1.5, 0);

    // A. The Shovel / Razor Scoop Blade (Curved beveled gold plate)
    const bladeBodyGeo = new THREE.BoxGeometry(4.2, 1.6, 0.12);
    const bladeMesh = new THREE.Mesh(bladeBodyGeo, goldPolished);
    bladeMesh.position.set(2, 0, 0);
    barberShovelGroup.add(bladeMesh);

    // B. Beveled Shaving Cutting Edge (Shovel Edge)
    const bevelEdgeGeo = new THREE.CylinderGeometry(0.04, 0.08, 4.2, 8);
    const bevelEdgeMesh = new THREE.Mesh(bevelEdgeGeo, goldMaterial);
    bevelEdgeMesh.rotation.z = Math.PI / 2;
    bevelEdgeMesh.position.set(2, -0.85, 0.02);
    barberShovelGroup.add(bevelEdgeMesh);

    // C. Blade Cutout Slots (Mechanical Razor Style)
    const slotGeo = new THREE.BoxGeometry(0.7, 0.25, 0.16);
    for (let s = 0; s < 3; s++) {
      const slot = new THREE.Mesh(slotGeo, obsidianGold);
      slot.position.set(0.9 + s * 1.1, 0.1, 0);
      barberShovelGroup.add(slot);
    }

    // D. Mechanical Arm & Connecting Piston Rod
    const armGeo = new THREE.CylinderGeometry(0.18, 0.18, 4.8, 16);
    const armMesh = new THREE.Mesh(armGeo, goldDarkMechanic);
    armMesh.rotation.z = 1.1;
    armMesh.position.set(-1.6, -1.2, 0);
    barberShovelGroup.add(armMesh);

    // E. Drive Pivot Joint Cog
    const pivotGear = createMechanicGear(1.1, 0.35, 10, 0.28, goldMaterial);
    pivotGear.position.set(-3.2, -2.2, 0);
    barberShovelGroup.add(pivotGear);

    mainGroup.add(barberShovelGroup);

    // -------------------------------------------------------------
    // ELEMENT 2: INTERLOCKING KINETIC MECHANIC GEAR TRAIN (Gold Clockwork)
    // -------------------------------------------------------------
    const gearTrainGroup = new THREE.Group();
    gearTrainGroup.position.set(7.5, 3.5, -2);

    // Primary Drive Gear (14 teeth)
    const gear1 = createMechanicGear(2.4, 0.32, 14, 0.42, goldPolished);
    gear1.position.set(0, 0, 0);
    gearTrainGroup.add(gear1);

    // Intermeshed Counter Gear (9 teeth)
    const gear2 = createMechanicGear(1.6, 0.28, 9, 0.38, goldMaterial);
    gear2.position.set(3.4, 1.8, 0.1);
    gearTrainGroup.add(gear2);

    // Secondary Small Speed Pinion (6 teeth)
    const gear3 = createMechanicGear(0.9, 0.25, 6, 0.25, goldDarkMechanic);
    gear3.position.set(-2.6, 1.7, -0.1);
    gearTrainGroup.add(gear3);

    mainGroup.add(gearTrainGroup);

    // -------------------------------------------------------------
    // ELEMENT 3: FLOATING 3D GOLD GROOMING PRODUCTS
    // -------------------------------------------------------------
    const productsGroup = new THREE.Group();

    // PRODUCT 3A: Luxury Gold Pomade Canister
    const pomadeGroup = new THREE.Group();
    pomadeGroup.position.set(8.5, -3.5, 1);

    // Tin Body
    const pomadeBodyGeo = new THREE.CylinderGeometry(1.5, 1.5, 1.1, 32);
    const pomadeBody = new THREE.Mesh(pomadeBodyGeo, goldMaterial);
    pomadeGroup.add(pomadeBody);

    // Screw Lid with Ribbed Rim
    const pomadeLidGeo = new THREE.CylinderGeometry(1.58, 1.58, 0.35, 32);
    const pomadeLid = new THREE.Mesh(pomadeLidGeo, goldPolished);
    pomadeLid.position.y = 0.65;
    pomadeGroup.add(pomadeLid);

    // Gold Seal Ring
    const pomadeRingGeo = new THREE.TorusGeometry(1.6, 0.05, 8, 32);
    const pomadeRing = new THREE.Mesh(pomadeRingGeo, goldPolished);
    pomadeRing.rotation.x = Math.PI / 2;
    pomadeRing.position.y = 0.5;
    pomadeGroup.add(pomadeRing);

    productsGroup.add(pomadeGroup);

    // PRODUCT 3B: Gold Beard Oil Dropper Bottle
    const bottleGroup = new THREE.Group();
    bottleGroup.position.set(-6.5, -5.5, -1);

    // Bottle Cylindrical Body
    const bottleGeo = new THREE.CylinderGeometry(0.85, 0.85, 3.2, 24);
    const bottleMesh = new THREE.Mesh(bottleGeo, goldDarkMechanic);
    bottleGroup.add(bottleMesh);

    // Gold Neck Collar
    const neckGeo = new THREE.CylinderGeometry(0.45, 0.55, 0.6, 20);
    const neckMesh = new THREE.Mesh(neckGeo, goldPolished);
    neckMesh.position.y = 1.8;
    bottleGroup.add(neckMesh);

    // Dropper Pipette Bulb Cap
    const capGeo = new THREE.CylinderGeometry(0.35, 0.42, 0.7, 16);
    const capMesh = new THREE.Mesh(capGeo, goldMaterial);
    capMesh.position.y = 2.4;
    bottleGroup.add(capMesh);

    productsGroup.add(bottleGroup);

    // PRODUCT 3C: Mechanical Gold Barber Clippers
    const clipperGroup = new THREE.Group();
    clipperGroup.position.set(-2, 6.2, -3);

    // Clipper Body
    const clipperBodyGeo = new THREE.BoxGeometry(1.6, 4.2, 0.9);
    const clipperBody = new THREE.Mesh(clipperBodyGeo, goldMaterial);
    clipperGroup.add(clipperBody);

    // Gold Trimmer Blade Comb Teeth
    const combTeethGeo = new THREE.BoxGeometry(1.7, 0.6, 0.15);
    const combTeeth = new THREE.Mesh(combTeethGeo, goldPolished);
    combTeeth.position.set(0, 2.35, 0.35);
    clipperGroup.add(combTeeth);

    // Oscillating Clipper Cutter Head
    const oscillatingBladeGeo = new THREE.BoxGeometry(1.5, 0.3, 0.12);
    const oscillatingBlade = new THREE.Mesh(oscillatingBladeGeo, goldDarkMechanic);
    oscillatingBlade.position.set(0, 2.55, 0.4);
    clipperGroup.add(oscillatingBlade);

    productsGroup.add(clipperGroup);

    // PRODUCT 3D: Articulated Golden Barber Shears
    const shearsGroup = new THREE.Group();
    shearsGroup.position.set(2.5, -1.8, -4);

    const bladeGeo = new THREE.CylinderGeometry(0.06, 0.12, 5.2, 16);
    const shearBlade1 = new THREE.Mesh(bladeGeo, goldPolished);
    shearBlade1.position.set(0, 0, 0);
    shearBlade1.rotation.z = 0.5;

    const shearBlade2 = new THREE.Mesh(bladeGeo, goldPolished);
    shearBlade2.position.set(0, 0, 0);
    shearBlade2.rotation.z = -0.5;

    const shearPivotGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.25, 16);
    const shearPivot = new THREE.Mesh(shearPivotGeo, goldDarkMechanic);
    shearPivot.rotation.x = Math.PI / 2;

    shearsGroup.add(shearBlade1);
    shearsGroup.add(shearBlade2);
    shearsGroup.add(shearPivot);
    productsGroup.add(shearsGroup);

    mainGroup.add(productsGroup);

    // -------------------------------------------------------------
    // ELEMENT 4: SKELETON BALANCE WHEEL & ORBITAL GOLD RINGS
    // -------------------------------------------------------------
    const ringGeo = new THREE.TorusGeometry(5.8, 0.09, 16, 100);
    const ringMesh = new THREE.Mesh(ringGeo, goldWireframe);
    ringMesh.position.set(0, 0, -6);
    mainGroup.add(ringMesh);

    // -------------------------------------------------------------
    // ELEMENT 5: STREAMING GOLD DUST PARTICLES
    // -------------------------------------------------------------
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 44;
      particlePositions[i + 1] = (Math.random() - 0.5) * 44;
      particlePositions[i + 2] = (Math.random() - 0.5) * 22;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xdfb76c,
      size: 0.14,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // -------------------------------------------------------------
    // LIGHTING: Warm Dramatic Gold Highlights
    // -------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.75);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfff0cc, 2.6);
    dirLight1.position.set(12, 18, 16);
    scene.add(dirLight1);

    const pointLightGold = new THREE.PointLight(0xdfb76c, 3.5, 45);
    pointLightGold.position.set(-8, 2, 12);
    scene.add(pointLightGold);

    const pointLightAmber = new THREE.PointLight(0xf59e0b, 2.8, 40);
    pointLightAmber.position.set(10, -4, 8);
    scene.add(pointLightAmber);

    // -------------------------------------------------------------
    // 6. HIGH-SPEED ANIMATION ENGINE & SCROLL LERP
    // -------------------------------------------------------------
    let targetScrollY = 0;
    let currentScrollY = 0;
    let isVisible = true;

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

    // Page Visibility API: Stop render loop entirely when tab is inactive to save 100% CPU/GPU
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    // High visual speed multiplier for active mechanical run
    const RUN_SPEED = 2.4;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime() * RUN_SPEED;

      // Smooth scroll lerp (damping)
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;
      const scrollFactor = currentScrollY * 0.0022;

      // 1. Root Assembly Tumbling with Scroll & Motion
      mainGroup.rotation.y = elapsedTime * 0.08 + scrollFactor * 1.4;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.15) * 0.06 + scrollFactor * 0.4;
      mainGroup.position.y = -scrollFactor * 3.2;

      // 2. KINETIC MECHANIC BARBER SHOVEL (Sweeping shaving skim motion)
      const shovelSwing = Math.sin(elapsedTime * 1.8);
      barberShovelGroup.rotation.z = -0.25 + shovelSwing * 0.35;
      barberShovelGroup.rotation.x = Math.cos(elapsedTime * 1.2) * 0.2 + scrollFactor * 0.8;
      bladeMesh.position.y = shovelSwing * 0.18;
      pivotGear.rotation.z = elapsedTime * 2.2;

      // 3. RUNNING GEAR TRAIN (Interlocking clockwork cogs running continuously)
      gear1.rotation.z = elapsedTime * 1.6;
      gear2.rotation.z = -elapsedTime * (1.6 * (14 / 9)); // Precision mesh counter-rotation
      gear3.rotation.z = elapsedTime * 3.2;

      // 4. FLOATING GROOMING PRODUCTS IN GOLD
      // Pomade canister tumbling slowly
      pomadeGroup.rotation.x = elapsedTime * 0.4 + scrollFactor * 2;
      pomadeGroup.rotation.y = elapsedTime * 0.6;
      pomadeGroup.position.y = -3.5 + Math.sin(elapsedTime * 1.2) * 0.4;

      // Beard oil bottle tilting gracefully
      bottleGroup.rotation.y = elapsedTime * 0.5 + scrollFactor;
      bottleGroup.rotation.z = Math.sin(elapsedTime * 0.8) * 0.18;
      bottleGroup.position.y = -5.5 + Math.cos(elapsedTime * 1.0) * 0.35;

      // High-speed vibrating mechanical clipper cutter blade
      oscillatingBlade.position.x = Math.sin(elapsedTime * 18) * 0.12;
      clipperGroup.rotation.y = elapsedTime * 0.3 + scrollFactor * 1.5;

      // Articulated barber shears snipping in rhythm
      const shearAngle = Math.abs(Math.sin(elapsedTime * 2.5)) * 0.45;
      shearBlade1.rotation.z = 0.25 + shearAngle;
      shearBlade2.rotation.z = -0.25 - shearAngle;
      shearsGroup.rotation.y = elapsedTime * 0.4;

      // 5. Orbiting Ring & Particles
      ringMesh.rotation.x = elapsedTime * 0.12 - scrollFactor;
      ringMesh.rotation.y = elapsedTime * 0.18 + scrollFactor * 1.2;
      particles.rotation.y = elapsedTime * 0.06 + scrollFactor * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      goldMaterial.dispose();
      goldPolished.dispose();
      goldDarkMechanic.dispose();
      goldWireframe.dispose();
      obsidianGold.dispose();
      bladeBodyGeo.dispose();
      bevelEdgeGeo.dispose();
      slotGeo.dispose();
      armGeo.dispose();
      pomadeBodyGeo.dispose();
      pomadeLidGeo.dispose();
      pomadeRingGeo.dispose();
      bottleGeo.dispose();
      neckGeo.dispose();
      capGeo.dispose();
      clipperBodyGeo.dispose();
      combTeethGeo.dispose();
      oscillatingBladeGeo.dispose();
      bladeGeo.dispose();
      shearPivotGeo.dispose();
      ringGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-45 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
};
