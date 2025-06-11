import React from "react";

type Props = {
  texto?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  align?: 'left' | 'center' | 'right' | 'justify';
  zoom: number;
  canvasHeight: number;
};

const ParrafoComp: React.FC<Props> = ({
  texto = "Texto multilinea",
  fontSize = 0.05,
  color = "#000000",
  bold = false,
  align = 'left',
  zoom,
  canvasHeight,
}) => (
  <div
    className="no-drag"
    style={{
      width: "100%",
      height: "100%",
      color,
      fontSize: fontSize * canvasHeight * zoom,
      fontWeight: bold ? "bold" : "normal",
      textAlign: align,
      whiteSpace: "pre-wrap",
      wordBreak: "break-word", // ← mejor que wordWrap
      overflow: "hidden",
      display: 'block', // ✅ Esto permite que fluya como bloque
      padding: 4, // un poco de margen interno ayuda visualmente
    }}
  >
    {texto}
  </div>
);

export default ParrafoComp;
