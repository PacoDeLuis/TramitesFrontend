// src/config.ts

// Vite usa import.meta.env en lugar de process.env
export const API_URL = import.meta.env.VITE_API_URL as string;

if (!API_URL) {
  // Este error es el que ves en la consola. 
  // Al cambiarlo a VITE_API_URL, se solucionará al desplegar.
  throw new Error("VITE_API_URL no está definida en el entorno");
}