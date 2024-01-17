import { LoadingManager } from "three";
import { gsap } from "gsap";
import { loadingBarElement } from "./elements";

// Variable to track scrolling availability
export let scrollAvailable = false;
// Initializes a LoadingManager for handling asset loading.
export const startLoadingManger = (scene, overlay, isMobileDevice) => {
  return new LoadingManager(
    // onLoad
    () => {
      const overlayMaterial = overlay.material;

      // Delayed GSAP animation for fading out overlay
      window.setTimeout(() => {
        gsap.to(overlayMaterial.uniforms.uAlpha, {
          duration: 3,
          value: 0,
          delay: 1,
        });
        loadingBarElement.classList.add("ended");
        loadingBarElement.style.transform = "";
      }, 500);

      // Delayed actions after loading completion
      window.setTimeout(() => {
        scene.remove(overlay);
        scrollAvailable = true;
        const scrollImgMessage = document.getElementById("scrollImgMessage");
        scrollImgMessage.style.display = "block";
        if (isMobileDevice) {
          const scrollImg = document.getElementById("scrollImgMobile");
          scrollImg.style.display = "block";
        } else {
          const scrollImg = document.getElementById("scrollImgMouse");
          scrollImg.style.display = "block";
        }
      }, 3000);
    },
    // onProgress
    (itemUrl, itemsLoaded, itemsTotal) => {
      // Calculate loading progress percentage and update loading bar
      const progressRatio = itemsLoaded / itemsTotal;
      loadingBarElement.style.transform = `scaleX(${progressRatio})`;
    }
  );
};
