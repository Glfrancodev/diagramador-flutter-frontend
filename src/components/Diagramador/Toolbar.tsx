// src/components/Diagramador/Toolbar.tsx

import { DEVICES } from "../../constants/devices";
import type { DeviceKey } from "../../constants/devices";
import useOnlineStatus from "../../hooks/useOnlineStatus";

type Props = {
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  selectedDevice: DeviceKey;
  onDeviceChange: (device: DeviceKey) => void;
  online: boolean;
};

export default function Toolbar({
  zoomIn,
  zoomOut,
  resetZoom,
  selectedDevice,
  onDeviceChange,
  online,
}: Props) {
  return (
    <div
      style={{
        padding: 8,
        backgroundColor: "#ddd",
        borderBottom: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
        gap: 20,
      }}
    >
      <label>
        Dispositivo:&nbsp;
        <select
          value={selectedDevice}
          onChange={(e) => onDeviceChange(e.target.value as DeviceKey)}
        >
          {Object.entries(DEVICES).map(([key, dev]) => (
            <option key={key} value={key}>
              {dev.name}
            </option>
          ))}
        </select>
      </label>

<div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
  <span
    style={{
      backgroundColor: online ? "#16a34a" : "#dc2626",
      color: "white",
      borderRadius: 6,
      padding: "4px 8px",
      fontWeight: "bold",
      fontSize: 12,
    }}
  >
    {online ? "🟢 Conectado" : "🔴 Sin conexión"}
  </span>
  <button onClick={zoomIn}>➕</button>
  <button onClick={zoomOut}>➖</button>
  <button onClick={resetZoom}>🔄</button>
</div>


    </div>
  );
}
