// src/components/Diagramador/elementos/InputFechaComp.tsx
import React from "react";

type Props = {
  fontSize?: number; // ✅ proporcional
  zoom: number;
  canvasHeight: number; // ✅ nuevo
};

const InputFechaComp: React.FC<Props> = ({
  fontSize = 0.02, // valor proporcional
  zoom,
  canvasHeight,
}) => (
  <input
    type="date"
    className="no-drag"
    style={{
      width: "100%",
      height: "100%",
      fontSize: fontSize * canvasHeight * zoom, // ✅ cálculo real
      padding: "4px 8px",
      border: "1px solid #ccc",
      borderRadius: 4,
      outline: "none",
      color: "#333",
    }}
  />
);

export default InputFechaComp;
