// src/components/Diagramador/TabsBar.tsx

import { useState } from "react";

type Props = {
  tabs: { id: string; name: string }[];
  selectedTabId: string;
  onSelect: (id: string) => void;
  onAddTab: () => void;
  onRenameTab: (id: string, newName: string) => void;
  onDeleteTab: (id: string) => void;
};

export default function TabsBar({
  tabs,
  selectedTabId,
  onSelect,
  onAddTab,
  onRenameTab,
  onDeleteTab,
}: Props) {
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#ccc",
        padding: "4px 8px",
        borderBottom: "1px solid #aaa",
      }}
    >
      {tabs.map((tab) => (
        <div
          key={tab.id}
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: 8,
            backgroundColor: tab.id === selectedTabId ? "#eee" : "#fff",
            border: tab.id === selectedTabId ? "2px solid black" : "1px solid #999",
            borderRadius: 4,
            padding: "4px 6px",
          }}
        >
          {editingTabId === tab.id ? (
            <input
              value={tempName}
              autoFocus
              onChange={(e) => setTempName(e.target.value)}
              onBlur={() => {
                if (tempName.trim() !== "") {
                  onRenameTab(tab.id, tempName.trim());
                }
                setEditingTabId(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                } else if (e.key === "Escape") {
                  setEditingTabId(null);
                }
              }}
              style={{ padding: 2, fontSize: 14, width: 100 }}
            />
          ) : (
            <button
              onClick={() => onSelect(tab.id)}
              onDoubleClick={() => {
                setEditingTabId(tab.id);
                setTempName(tab.name);
              }}
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                marginRight: 4,
                fontWeight: tab.id === selectedTabId ? "bold" : "normal",
                cursor: "pointer",
              }}
            >
              {tab.name}
            </button>
          )}
          <button
            onClick={() => onDeleteTab(tab.id)}
            style={{
              background: "transparent",
              border: "none",
              color: "#900",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            title="Eliminar pestaña"
          >
            ×
          </button>
        </div>
      ))}
      <button onClick={onAddTab} style={{ padding: "4px 8px", fontSize: 18 }}>
        ＋
      </button>
    </div>
  );
}
