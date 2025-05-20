import React from "react";

type Props = {
  texto?: string;
  color?: string;
  textColor?: string;
  borderRadius?: number;
  fontSize?: number;
  zoom: number;
};

const BotonComp: React.FC<Props> = ({
  texto = "Botón",
  color = "#007bff",
  textColor = "#ffffff",
  borderRadius = 4,
  fontSize = 14,
  zoom,
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
      fontSize: fontSize * zoom,
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
