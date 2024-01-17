import {
  LinearMipmapLinearFilter,
  LinearFilter,
  LinearSRGBColorSpace,
  DoubleSide,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";
import { startLoadingManger } from "./loadingManager";
import {
  COLOR_CYAN,
  COLOR_MAGENTA,
  COLOR_YELLOW,
  elementsModels,
} from "./constants";

// Global variables for loaders
let KTX2loader;
let loaderGLTF;

// Loads 3D models into the scene and returns the player object
export async function loadModels(renderer, scene, overlay, isMobileDevice) {
  // Initializing the loading manager
  const loadingManager = startLoadingManger(scene, overlay, isMobileDevice);

  // Setting up DRACO loader, GLTF loader and KTX2 loader with the loading manager.
  const dracoLoader = new DRACOLoader(loadingManager);
  dracoLoader.setDecoderPath("draco/");
  loaderGLTF = new GLTFLoader(loadingManager);
  loaderGLTF.setDRACOLoader(dracoLoader);
  KTX2loader = new KTX2Loader(loadingManager);
  KTX2loader.setTranscoderPath("/basis/");
  KTX2loader.detectSupport(renderer);

  // Loading player, arrow, and enemy models
  const player = loadModel("Player", COLOR_CYAN, scene);
  const arrow = await loadModel("Arrow", COLOR_YELLOW, scene);
  const enemy = await loadModel("Enemy", COLOR_MAGENTA, scene);

  // Cloning and positioning additional elements
  elementsModels.forEach((element) => {
    let newElement;
    if (element.type == "Enemy") {
      newElement = enemy.clone();
    } else if (element.type == "Arrow") {
      newElement = arrow.clone();
    }
    // Positioning and rotation adjustments
    newElement.position.set(
      element.position.x,
      element.position.y,
      element.position.z
    );
    newElement.lookAt(0, element.position.y, 0);
    newElement.rotateX(Math.PI / 2);
    newElement.isRotable = true;
    scene.add(newElement);
  });

  // Resolving the player promise
  return player;
}

// Loads a 3D model with emissive texture.
async function loadModel(name, color, scene) {
  return new Promise((resolve, reject) => {
    // Creating a promise for the emissive texture
    const texturePromise = new Promise((resolveTexture, rejectTexture) => {
      KTX2loader.load(
        "/textures/" + name + "Emissive.ktx2",
        resolveTexture,
        undefined,
        rejectTexture
      );
    });
    // Loading the GLB model
    loaderGLTF.load("/models/" + name + ".glb", function (gltf) {
      const object = gltf.scene;

      // Applying emissive texture to the model
      texturePromise
        .then((texture) => {
          texture.minFilter = LinearMipmapLinearFilter;
          texture.magFilter = LinearFilter;
          texture.colorSpace = LinearSRGBColorSpace;
          texture.needsUpdate = true;

          // Configuring material properties
          object.children[0].material.transparent = true;
          object.children[0].material.dithering = true;
          object.children[0].material.side = DoubleSide;
          object.children[0].material.emissiveMap = texture;
          object.children[0].material.emissive = color;
          object.children[0].material.emissiveIntensity =
            name == "Arrow" ? 2 : 1;
          // Positioning adjustments for specific models
          if (name == "Player") {
            object.position.set(0, 200, 0);
          }
          if (name == "Enemy") {
            object.scale.set(2, 2, 2);
            object.position.set(-20, 200, -17);
            object.lookAt(0, 0, 0);
            object.isRotable = true;
          }
          if (name == "Arrow") {
            object.scale.set(0.6, 0.6, 0.6);
            object.position.set(30, 200, 10);
            object.lookAt(0, 200, 0);
            object.rotateX(Math.PI / 2);
            object.isRotable = true;
          }
          // Adding the loaded object to the scene
          scene.add(object);

          // Resolves the outer Promise with the loaded object
          resolve(object);
        })
        .catch((error) => {
          console.error("Error loading texture:", error);

          // Rejects the outer Promise if there is an error
          reject(error);
        });
    });
  });
}
