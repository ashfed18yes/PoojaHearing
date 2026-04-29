/**
 * 3D Background Scene using Three.js
 * Creates subtle, floating geometric forms inspired by sound waves and medical trust.
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('#webgl-bg');
    if (!canvas) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    
    // Soft, trustworthy hospital blue/white background fog
    scene.fog = new THREE.FogExp2(0xf0f4f8, 0.0015);

    // CAMERA SETUP
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for performance
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xf0f4f8, 1); // background color

    // LIGHTING
    // Ambient light for base illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Directional light for depth
    const dirLight = new THREE.DirectionalLight(0xe8f0f6, 1);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // Subtle blue accent light
    const pointLight = new THREE.PointLight(0x4a90e2, 0.8, 50);
    pointLight.position.set(-10, -10, 10);
    scene.add(pointLight);

    // OBJECTS
    // We will create some abstract floating rings (representing sound waves) and smooth spheres (care/medical)
    const objects = [];
    const geometrySphere = new THREE.IcosahedronGeometry(1, 2); // Smooth looking sphere
    const materialSphere = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.1,
        transparent: true,
        opacity: 0.8
    });

    const geometryRing = new THREE.TorusGeometry(3, 0.05, 16, 100);
    const materialRing = new THREE.MeshStandardMaterial({
        color: 0x4a90e2,
        roughness: 0.4,
        metalness: 0.3,
        transparent: true,
        opacity: 0.4
    });

    // Create a group for our floating objects
    const group = new THREE.Group();
    scene.add(group);

    // Add some spheres
    for (let i = 0; i < 15; i++) {
        const sphere = new THREE.Mesh(geometrySphere, materialSphere);
        sphere.position.x = (Math.random() - 0.5) * 60;
        sphere.position.y = (Math.random() - 0.5) * 60;
        sphere.position.z = (Math.random() - 0.5) * 40 - 10;
        
        // Randomize scale
        const scale = Math.random() * 1.5 + 0.5;
        sphere.scale.set(scale, scale, scale);
        
        // Custom properties for animation
        sphere.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01
            },
            floatSpeed: Math.random() * 0.02 + 0.01,
            floatOffset: Math.random() * Math.PI * 2,
            baseY: sphere.position.y
        };
        
        group.add(sphere);
        objects.push(sphere);
    }

    // Add some soundwave rings
    for (let i = 0; i < 8; i++) {
        const ring = new THREE.Mesh(geometryRing, materialRing);
        ring.position.x = (Math.random() - 0.5) * 50;
        ring.position.y = (Math.random() - 0.5) * 50;
        ring.position.z = (Math.random() - 0.5) * 20 - 5;
        
        const scale = Math.random() * 2 + 1;
        ring.scale.set(scale, scale, scale);
        
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;

        ring.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.005,
                y: (Math.random() - 0.5) * 0.005,
                z: (Math.random() - 0.5) * 0.005
            },
            floatSpeed: Math.random() * 0.01 + 0.005,
            floatOffset: Math.random() * Math.PI * 2,
            baseY: ring.position.y
        };

        group.add(ring);
        objects.push(ring);
    }

    // MOUSE INTERACTION SETUP
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.05; // Parallax strength
        mouseY = (event.clientY - windowHalfY) * 0.05;
    });

    // SCROLL INTERACTION SETUP
    let scrollY = window.scrollY;
    let targetScrollY = scrollY;
    
    window.addEventListener('scroll', () => {
        targetScrollY = window.scrollY;
    });

    // RESIZE HANDLER
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // ANIMATION LOOP
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smoothly interpolate mouse and scroll targets
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        scrollY += (targetScrollY - scrollY) * 0.05;

        // Animate individual objects (floating and rotating)
        objects.forEach(obj => {
            // Self rotation
            obj.rotation.x += obj.userData.rotationSpeed.x;
            obj.rotation.y += obj.userData.rotationSpeed.y;
            if(obj.userData.rotationSpeed.z) obj.rotation.z += obj.userData.rotationSpeed.z;

            // Floating motion (sine wave)
            obj.position.y = obj.userData.baseY + Math.sin(elapsedTime * obj.userData.floatSpeed + obj.userData.floatOffset) * 2;
        });

        // Camera Parallax based on mouse
        camera.position.x += (mouseX * 0.1 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 0.1 - camera.position.y) * 0.05;

        // Group parallax based on scroll
        group.position.y = scrollY * 0.02; // Move group up as we scroll down
        group.rotation.x = scrollY * 0.0002;
        group.rotation.y = scrollY * 0.0001;

        camera.lookAt(scene.position);
        renderer.render(scene, camera);
    }

    animate();
});
