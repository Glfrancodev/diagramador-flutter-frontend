// src/components/Diagramador/Toolbar.tsx

type Props = {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
};

export default function Toolbar({ zoomIn, zoomOut, resetZoom }: Props) {
  return (
    <div
      style={{
        padding: 8,
        backgroundColor: "#ddd",
        borderBottom: "1px solid #ccc",
      }}
    >
      <button onClick={zoomIn}>➕</button>{" "}
      <button onClick={zoomOut}>➖</button>{" "}
      <button onClick={resetZoom}>🔄</button>
    </div>
  );
}
