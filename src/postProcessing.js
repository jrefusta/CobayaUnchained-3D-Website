import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { Vector2 } from "three";

// Initializes EffectComposer
export const initEffectComposer = (renderer, scene, camera) => {
  // Initialize individual passes
  const outputPass = initOutputPass();
  const bloomPass = initBloomPass();
  const renderPass = initRenderPass(scene, camera);

  // Create a new EffectComposer and add the passes
  const composer = new EffectComposer(renderer);
  composer.addPass(renderPass);
  composer.addPass(bloomPass);
  composer.addPass(outputPass);

  return composer;
};

// Initializes the bloom pass with default parameters.
const initBloomPass = () => {
  const bloomPass = new UnrealBloomPass(
    new Vector2(window.innerWidth, window.innerHeight), // Resolution
    0.7, // Strength
    0.5, // Radius
    0 // Threshold
  );
  return bloomPass;
};

// Initializes the output pass for final rendering.
const initOutputPass = () => {
  return new OutputPass();
};

// Initializes the render pass to capture the scene and camera.
const initRenderPass = (scene, camera) => {
  return new RenderPass(scene, camera);
};
