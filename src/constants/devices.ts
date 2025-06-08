// src/constants/devices.ts

export const DEVICES = {
  phoneSmall: {
    name: "Celular pequeño",
    width: 360,
    height: 640,
  },
  phoneStandard: {
    name: "Celular estándar",
    width: 390,
    height: 844,
  },
  tablet: {
    name: "Tab s6 lite",
    width: 800,
    height: 1335,
  },
};

export type DeviceKey = keyof typeof DEVICES;
