import { gsap } from "gsap";
import TWEEN from "@tweenjs/tween.js";
import {
  menuElement,
  dropdownMenu,
  scrollImgMouse,
  scrollImgMobile,
  scrollText,
  elementContainer,
  elementFooter,
} from "./elements";
import { Vector2, Vector3, Raycaster } from "three";
import { changeElementOpacity } from "./elements";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registering ScrollTrigger plugin from gsap
gsap.registerPlugin(ScrollTrigger);

// Function to handle mobile menu click
export const handleClickMobileMenu = (event) => {
  menuElement.style.display =
    menuElement.style.display == "flex" ? "none" : "flex";
};

// Function to handle clicks outside the mobile menu
export const handleClickMobileOutside = (event) => {
  if (
    !dropdownMenu.contains(event.target) &&
    !menuElement.contains(event.target)
  ) {
    menuElement.style.display = "none";
  }
};

// Variables for handleScroll event
let scrollY = 0;
let touchStartY = 0;
let animation;

// Function to handle scroll events
export const handleScroll = (
  scrollAvailable,
  isMobileDevice,
  camera,
  event
) => {
  if (!scrollAvailable) return;
  const isTouch = event.type === "touchmove";
  const deltaY = isTouch
    ? event.touches[0].clientY - touchStartY
    : event.deltaY;

  // Updating scroll position
  scrollY += (isTouch ? -5 : 10) * (deltaY > 0 ? 1 : -1);
  scrollY = gsap.utils.clamp(0, 300, scrollY);

  // Handling opacity changes based on scroll position
  if (scrollY > 0) {
    if (isMobileDevice) {
      scrollImgMobile.style.opacity = 0;
    } else {
      scrollImgMouse.style.opacity = 0;
    }
    scrollText.style.opacity = 0;
  } else {
    if (isMobileDevice) {
      scrollImgMobile.style.opacity = 1;
    } else {
      scrollImgMouse.style.opacity = 1;
    }
    scrollText.style.opacity = 1;
  }

  // Animating opacity changes for container and footer elements
  const opacity = window
    .getComputedStyle(elementContainer)
    .getPropertyValue("opacity");

  if (scrollY === 300 && opacity === "0") {
    if (animation) {
      animation.kill();
    }
    animation = changeElementOpacity(elementContainer, false);
    animation = changeElementOpacity(elementFooter, false);
  } else if (scrollY !== 300 && opacity === "1") {
    if (animation) {
      animation.kill();
    }
    animation = changeElementOpacity(elementContainer, true);
    animation = changeElementOpacity(elementFooter, true);
  }

  // Updating touch start position
  if (isTouch) {
    touchStartY = event.touches[0].clientY;
  }

  // Updating camera position based on last scroll
  updateCameraPosition(scrollY, camera);
};

// Initializing Raycaster for object intersection
const raycaster = new Raycaster();

// Initializing a Vector2 for mouse coordinates
export const mouse = new Vector2();

// Function to handleRotation event
export const handleRotation = (player, camera, scene, event) => {
  let clientX, clientY;

  // Determining mouse or touch event
  if (event.touches && event.touches.length > 0) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  // Updating mouse coordinates based on event
  mouse.x = (clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(clientY / window.innerHeight) * 2 + 1;

  // Setting up Raycaster and rotating player
  setupRaycaster(mouse, camera, scene);
  const mouseVector = new Vector3(mouse.x, mouse.y, 0.5);
  rotatePlayer(player, mouseVector, camera);
};

// Function to generate a random rotation value
const getRandomRotation = () => (Math.random() < 0.5 ? 1 : -1) * Math.PI * 2;

// Function to rotate the player based on mouse position
const rotatePlayer = (player, mouseVector, camera) => {
  mouseVector.unproject(camera);
  mouseVector.sub(camera.position).normalize();
  const distance = 200 - camera.position.y / mouseVector.y;
  const pos = new Vector3()
    .copy(camera.position)
    .add(mouseVector.multiplyScalar(distance));
  if (player) {
    player.then((playerGroup) =>
      playerGroup.lookAt(new Vector3(-pos.x, 200, -pos.z + camera.position.z))
    );
  }
};

// Function to set up Raycaster for object intersection
const setupRaycaster = (mouse, camera, scene) => {
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObject(scene);
  if (
    intersects.length > 0 &&
    !intersects[0].object.isRotating &&
    intersects[0].object.parent.isRotable
  ) {
    const objectToRotate = intersects[0].object;
    rotateObject(objectToRotate);
  }
};

// Function to rotate an object using TWEEN
const rotateObject = (objectToRotate) => {
  var currentRotation = {
    x: objectToRotate.rotation.x,
    y: objectToRotate.rotation.y,
    z: objectToRotate.rotation.z,
  };
  objectToRotate.isRotating = true;

  // Generates a random rotation per each model raycasted
  objectToRotate.targetRotation = {
    x: objectToRotate.rotation.x + getRandomRotation(),
    y: objectToRotate.rotation.y + getRandomRotation(),
    z: objectToRotate.rotation.z + getRandomRotation(),
  };
  new TWEEN.Tween(currentRotation)
    .to(objectToRotate.targetRotation, 1000)
    .easing(TWEEN.Easing.Cubic.InOut)
    .onUpdate(() => {
      objectToRotate.rotation.x = currentRotation.x;
      objectToRotate.rotation.y = currentRotation.y;
      objectToRotate.rotation.z = currentRotation.z;
    })
    .onComplete(() => {
      objectToRotate.isRotating = false;
    })
    .start();
};

// Function to update camera position based on the scroll using gsap
const updateCameraPosition = (scrollY, camera) => {
  if (scrollY >= 250) {
    gsap.to(camera.position, {
      z: gsap.utils.clamp(0, 200, scrollY - 250),
    });
  } else {
    gsap.to(camera.position, {
      y: gsap.utils.clamp(0, 300, scrollY),
    });
  }
};
