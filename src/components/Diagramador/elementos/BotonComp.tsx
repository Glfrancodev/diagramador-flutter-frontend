// src/components/Diagramador/elementos/BotonComp.tsx
import React from "react";

type Props = {
  texto?: string;
  color?: string;
  textColor?: string;
  borderRadius?: number;
  fontSize?: number; // ⚠️ ahora es proporcional
  zoom: number;
  canvasHeight: number; // ✅ nuevo
};

const BotonComp: React.FC<Props> = ({
  texto = "Botón",
  color = "#007bff",
  textColor = "#ffffff",
  borderRadius = 4,
  fontSize = 0.02, // valor proporcional
  zoom,
  canvasHeight,
}) => (
  <button
    className="no-drag"
    style={{
      width: "100%",
      height: "100%",
      border: "none",
      borderRadius: borderRadius,
      background: color,
      color: textColor,
      fontSize: fontSize * canvasHeight * zoom, // ✅ ajustado proporcionalmente
      cursor: "pointer",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    }}
  >
    {texto}
  </button>
);

export default BotonComp;
