import React from 'react';
import './GridTable.css';

type Props = {
  headers: string[];
  data: string[][];
  colWidths: number[];
  fontSize: number;
  zoom: number;
  onChange: (next: {
    headers: string[];
    data: string[][];
    colWidths: number[];
  }) => void;
};

const GridTable: React.FC<Props> = ({
  headers,
  data,
  colWidths,
  fontSize,
  zoom,
  onChange,
}) => {
  const editHeader = (i: number, value: string) => {
    const updated = [...headers];
    updated[i] = value;
    onChange({ headers: updated, data, colWidths });
  };

  const editCell = (r: number, c: number, value: string) => {
    const newData = data.map((fila, ri) =>
      ri === r ? fila.map((cel, ci) => (ci === c ? value : cel)) : fila
    );
    onChange({ headers, data: newData, colWidths });
  };

  const startResize = (i: number, e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = colWidths[i];

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      const newWidths = colWidths.map((w, idx) =>
        idx === i ? Math.max(40, startWidth + delta) : w
      );
      onChange({ headers, data, colWidths: newWidths });
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp, { once: true });
  };

  return (
    <div
      className="grid-table-wrapper"
      style={{
        width: `${100 / zoom}%`,
        height: `${100 / zoom}%`,
        overflowX: 'auto',
        overflowY: 'auto',
        border: '1px solid #ccc',
        background: '#fff',
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
      }}
    >
      <div
        className="grid-table"
        style={{
          fontSize: fontSize,
          display: 'flex',
          flexDirection: 'column',
          width: 'fit-content',
          minWidth: '100%',
        }}
      >
        {/* CABECERA */}
        <div className="row header">
          {headers.map((text, i) => (
            <div
              className="cell header-cell"
              key={i}
              style={{ width: colWidths[i] }}
            >
              <div
                className="content"
                onDoubleClick={(e) => {
                  const el = e.currentTarget;
                  const input = document.createElement('input');
                  input.value = text;
                  input.style.width = '100%';
                  input.style.border = 'none';
                  input.style.background = 'transparent';
                  input.style.fontSize = 'inherit';
                  el.innerHTML = '';
                  el.appendChild(input);
                  input.focus();
                  const save = () => editHeader(i, input.value);
                  input.onblur = save;
                  input.onkeydown = (ev) => {
                    if (ev.key === 'Enter' || ev.key === 'Escape') save();
                  };
                }}
              >
                {text || '...'}
              </div>
              <div
                className="col-resizer"
                onMouseDown={(e) => startResize(i, e)}
              />
            </div>
          ))}
        </div>

        {/* FILAS */}
        {data.map((fila, r) => (
          <div className="row" key={r}>
            {fila.map((cel, c) => (
              <div className="cell" key={c} style={{ width: colWidths[c] }}>
                <div
                  className="content"
                  onDoubleClick={(e) => {
                    const el = e.currentTarget;
                    const input = document.createElement('input');
                    input.value = cel;
                    input.style.width = '100%';
                    input.style.border = 'none';
                    input.style.background = 'transparent';
                    input.style.fontSize = 'inherit';
                    el.innerHTML = '';
                    el.appendChild(input);
                    input.focus();
                    const save = () => editCell(r, c, input.value);
                    input.onblur = save;
                    input.onkeydown = (ev) => {
                      if (ev.key === 'Enter' || ev.key === 'Escape') save();
                    };
                  }}
                >
                  {cel || '...'}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridTable;
