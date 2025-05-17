// src/constants/devices.ts

export const DEVICES = {
  phoneSmall: {
    name: "Celular pequeño",
    width: 360,
    height: 640,
  },
  phoneStandard: {
    name: "Celular estándar",
    width: 414,
    height: 896,
  },
  tablet: {
    name: "Tablet",
    width: 768,
    height: 1024,
  },
};

export type DeviceKey = keyof typeof DEVICES;
