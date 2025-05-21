import React from "react";

type Props = {
  texto?: string;
  fontSize?: number;
  color?: string;
  zoom: number;
};

const LabelComp: React.FC<Props & { bold?: boolean }> = ({
  texto = "Texto",
  fontSize = 14,
  color = "#000000",
  bold = false,
  zoom,
}) => (
  <div
    className="no-drag"
    style={{
      width: "100%",
      height: "100%",
      color: color,
      fontSize: fontSize * zoom,
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
