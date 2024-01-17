import {
  BufferGeometry,
  PointsMaterial,
  Float32BufferAttribute,
  AdditiveBlending,
  Points,
} from "three";
import { COLOR_MAGENTA, COLOR_YELLOW } from "./constants";

// Number of particles to be created
const numParticles = 300;

// Creates and adds particles to the scene based on color and texture.
export const createParticles = (scene, textureParticle) => {
  // Create particles with different colors
  const particlesYellow = createParticlesByColor(COLOR_YELLOW, textureParticle);
  const particlesMagenta = createParticlesByColor(
    COLOR_MAGENTA,
    textureParticle
  );

  // Add particles to the scene
  scene.add(particlesYellow, particlesMagenta);
};

// Creates particles based on color and texture.
const createParticlesByColor = (color, textureParticle) => {
  // Create BufferGeometry for particles
  const geometry = new BufferGeometry();
  const vertices = [];

  // Create PointsMaterial with specified properties
  const material = new PointsMaterial({
    size: 3,
    map: textureParticle,
    blending: AdditiveBlending,
    depthTest: false,
    transparent: true,
    color,
  });

  // Generate random vertices for particles
  for (let i = 0; i < numParticles; i++) {
    const x = Math.random() * (400 + 400) - 400;
    const y = Math.random() * (200 + 200) - 200;
    const z = Math.random() * (400 + 400) - 400;
    vertices.push(x, y, z);
  }

  // Set position attribute and create Points object
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  const particles = new Points(geometry, material);

  return particles;
};
