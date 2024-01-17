import { Vector3, Color } from "three";

// Defining colors for models
export const COLOR_CYAN = new Color(0x00bfbf);
export const COLOR_YELLOW = new Color(0xbfbf00);
export const COLOR_MAGENTA = new Color(0xbf00bf);

// Defining positions and types for elements models
export const elementsModels = [
  { position: new Vector3(30, 200, -20), type: "Enemy" },
  { position: new Vector3(-10, 200, -50), type: "Enemy" },
  { position: new Vector3(-70, 30, 10), type: "Enemy" },
  { position: new Vector3(90, 160, -10), type: "Enemy" },
  { position: new Vector3(60, 190, 30), type: "Enemy" },
  { position: new Vector3(-60, 180, 20), type: "Enemy" },
  { position: new Vector3(-5, 180, 20), type: "Enemy" },
  { position: new Vector3(40, 200, 60), type: "Enemy" },
  { position: new Vector3(-40, 200, 65), type: "Arrow" },
  { position: new Vector3(-45, 200, 50), type: "Enemy" },
  { position: new Vector3(5, 160, -40), type: "Arrow" },
  { position: new Vector3(-50, 200, 30), type: "Arrow" },
  { position: new Vector3(-40, 190, -10), type: "Arrow" },
  { position: new Vector3(-70, 180, -30), type: "Arrow" },
  { position: new Vector3(30, 200, 40), type: "Arrow" },
  { position: new Vector3(50, 120, -20), type: "Arrow" },
  { position: new Vector3(50, 200, -20), type: "Arrow" },
  { position: new Vector3(20, 20, 60), type: "Arrow" },
];
