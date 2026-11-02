import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function initWireframe() {
  const container = document.querySelector('#wireframe');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  } catch {
    return;
  }
  renderer.setClearColor(0, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 7.8);
  const pivot = new THREE.Group();
  const tilt = new THREE.Group();
  tilt.rotation.z = 0.12;
  pivot.add(tilt);
  scene.add(pivot);

  let model;
  let frame;
  let visible = true;
  let disposed = false;
  const materials = new Set();
  const startedAt = performance.now();

  function render() {
    if (disposed) return;
    if (!reducedMotion.matches) {
      const elapsed = (performance.now() - startedAt) / 1000;
      pivot.rotation.y = (1 - Math.cos(elapsed / 10 * Math.PI * 2)) / 2 * THREE.MathUtils.degToRad(-90);
    }
    renderer.render(scene, camera);
  }
  function animate() {
    frame = undefined;
    if (!visible || document.hidden || disposed) return;
    render();
    if (!reducedMotion.matches) frame = requestAnimationFrame(animate);
  }
  function resume() {
    if (frame !== undefined) cancelAnimationFrame(frame);
    frame = undefined;
    animate();
  }

  new GLTFLoader().load('/assets/models/ditsa-wireframe.glb', gltf => {
    if (disposed) return;
    model = gltf.scene;
    model.traverse(object => {
      if (!object.isMesh && !object.isLine) return;
      const previous = Array.isArray(object.material) ? object.material : [object.material];
      previous.forEach(material => material?.dispose());
      const options = { color: 0x7186cf, transparent: true, opacity: 0.58, depthWrite: false };
      const material = object.isMesh
        ? new THREE.MeshBasicMaterial({ ...options, wireframe: true, side: THREE.DoubleSide })
        : new THREE.LineBasicMaterial(options);
      object.material = material;
      materials.add(material);
    });
    const bounds = new THREE.Box3().setFromObject(model);
    const scale = 3.5 / Math.max(bounds.getSize(new THREE.Vector3()).y, 0.001);
    model.scale.setScalar(scale);
    model.position.sub(new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3()));
    tilt.add(model);
    container.classList.add('loaded');
    resume();
  }, undefined, error => {
    console.warn('Unable to load the Ditsa artwork.', error);
    renderer.dispose();
    renderer.domElement.remove();
  });

  const resizeObserver = new ResizeObserver(() => {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(width, height, true);
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    render();
  });
  resizeObserver.observe(container);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    resume();
  });
  visibilityObserver.observe(container);
  document.addEventListener('visibilitychange', resume);
  reducedMotion.addEventListener('change', resume);

  window.addEventListener('pagehide', event => {
    if (event.persisted) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    document.removeEventListener('visibilitychange', resume);
    reducedMotion.removeEventListener('change', resume);
    model?.traverse(object => object.geometry?.dispose());
    materials.forEach(material => material.dispose());
    renderer.dispose();
  });
}
