import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  LinearToneMapping,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  TextureLoader,
} from "three";
import TWEEN from "@tweenjs/tween.js";
import vertexBlackPlane from "./shaders/black_plane/vertex.vert";
import fragmentBlackPlane from "./shaders/black_plane/fragment.frag";
import { startLoadingManger, scrollAvailable } from "./loadingManager";
import { loadModels } from "./loaders";
import { initEffectComposer } from "./postProcessing";
import { createParticles } from "./particles";
import {
  handleClickMobileMenu,
  handleClickMobileOutside,
  handleScroll,
  handleRotation,
  mouse,
} from "./events";

// DOM element references
const dropdownMenu = document.getElementById("dropdown_menu");

// Event listeners for mobile interactions
const isMobileDevice =
  /iPhone|iPad|iPod|Android|BlackBerry|Windows Phone/i.test(
    navigator.userAgent
  );

if (isMobileDevice) {
  dropdownMenu.addEventListener("click", (event) => {
    handleClickMobileMenu(event);
  });

  document.addEventListener("click", (event) => {
    handleClickMobileOutside(event);
  });
}

// Function to set up the WebGLRenderer
const setupRenderer = () => {
  const renderer = new WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = LinearToneMapping;
  document.body.appendChild(renderer.domElement);
  return renderer;
};

// Function to set up the camera
const setupCamera = () => {
  const camera = new PerspectiveCamera(
    80,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.lookAt(0, -1, 0);
  return camera;
};

// Function to set up the overlay mesh
const setupOverlay = () => {
  const overlayGeometry = new PlaneGeometry(2, 2, 1, 1);
  const overlayMaterial = new ShaderMaterial({
    transparent: true,
    uniforms: {
      uAlpha: { value: 1 },
    },
    vertexShader: vertexBlackPlane,
    fragmentShader: fragmentBlackPlane,
  });
  const overlay = new Mesh(overlayGeometry, overlayMaterial);
  return overlay;
};

// Create a new scene and set up camera, renderer, composer, and overlay
const scene = new Scene();
const camera = setupCamera();
const renderer = setupRenderer();
const composer = initEffectComposer(renderer, scene, camera);
const overlay = setupOverlay();
scene.add(overlay);

// Load 3D models and create particles
const player = loadModels(renderer, scene, overlay, isMobileDevice);
const loadingManager = startLoadingManger(scene, overlay, isMobileDevice);
const textureLoader = new TextureLoader(loadingManager);
const textureParticle = textureLoader.load("images/spark.png");

createParticles(scene, textureParticle);

// Animation loop
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  TWEEN.update();
  composer.render();
  updateCameraMovement();
};

// Function to update camera movement based on mouse input
const updateCameraMovement = () => {
  camera.rotation.x = -Math.PI / 2 + mouse.y * 0.01;
  camera.rotation.y = -mouse.x * 0.01;
};

// Function to handle window resize
const onWindowResize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  composer.setSize(width, height);
};

// Event listener for window resize
window.addEventListener("resize", onWindowResize);

// Determine the touch event based on device capabilities
const isTouchDevice = "ontouchstart" in window || navigator.msMaxTouchPoints;
const TOUCH_EVENT = isTouchDevice ? "touchmove" : "wheel";

// Event listeners for scroll and rotation handling
document.addEventListener(
  TOUCH_EVENT,
  (event) => {
    handleScroll(scrollAvailable, isMobileDevice, camera, event);
  },
  { passive: true }
);

document.addEventListener(
  TOUCH_EVENT,
  (event) => {
    handleRotation(player, camera, scene, event);
  },
  { passive: true }
);

document.addEventListener(
  isTouchDevice ? "touchmove" : "mousemove",
  (event) => {
    handleRotation(player, camera, scene, event);
  },
  { passive: true }
);

// Start the animation loop
animate();
