import gsap from "gsap";

// DOM elements used in the application
export const menuElement = document.querySelector(".menu");
export const dropdownMenu = document.getElementById("dropdown_menu");
export const scrollImgMouse = document.getElementById("scrollImgMouse");
export const scrollImgMobile = document.getElementById("scrollImgMobile");
export const scrollText = document.getElementById("scrollImgMessage");
export const elementContainer = document.getElementById("info_container");
export const elementFooter = document.getElementById("footer");
export const loadingBarElement = document.querySelector(".loading-bar");

// Changes the opacity and display of an element using GSAP animation.
export const changeElementOpacity = (element, fadeIn) => {
  const targetOpacity = !fadeIn ? 1 : 0;
  const targetDisplay = !fadeIn ? "flex" : "none";

  gsap.to(element, {
    opacity: targetOpacity,
    display: targetDisplay,
    duration: 0.5,
  });
};
