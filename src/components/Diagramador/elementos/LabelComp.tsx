import React from "react";

type Props = {
  texto?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  zoom: number;
  canvasHeight: number; // ✅ nuevo
};

const LabelComp: React.FC<Props & { bold?: boolean }> = ({
  texto = "Texto",
  fontSize = 0.05, // ⚠️ debe venir normalizado
  color = "#000000",
  bold = false,
  zoom,
  canvasHeight, // ✅ nuevo
}) => (
  <div
    className="no-drag"
    style={{
      width: "100%",
      height: "100%",
      color: color,
      fontSize: fontSize * canvasHeight * zoom, // ✅ render responsivo
      fontWeight: bold ? "bold" : "normal", // ✅ ESTA LÍNEA HACE QUE FUNCIONE
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    }}
  >
    {texto}
  </div>
);


export default LabelComp;
