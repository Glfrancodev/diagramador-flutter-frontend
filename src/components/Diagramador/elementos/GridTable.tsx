import React from 'react';
import './GridTable.css';

type Props = {
  headers: string[];
  data: string[][];
  colWidths: number[];       // ← proporcionales (0–1)
  fontSize: number;          // ← proporcional a canvasHeight
  zoom: number;
  canvasHeight: number;
  canvasWidth: number;
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
  canvasHeight,
  canvasWidth,
  onChange,
}) => {
  const textPx = fontSize * canvasHeight * zoom;

  const getAbsWidth = (rel: number) => rel * canvasWidth * zoom;

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
    const startWidthPx = getAbsWidth(colWidths[i]);

    const onMove = (ev: MouseEvent) => {
      const delta = ev.clientX - startX;
      const newWidthPx = Math.max(40, startWidthPx + delta);
      const newRel = +(newWidthPx / (canvasWidth * zoom)).toFixed(4);
      const updated = [...colWidths];
      updated[i] = newRel;
      onChange({ headers, data, colWidths: updated });
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
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        background: '#fff',
      }}
    >
      <div
        className="grid-table"
        style={{
          fontSize: textPx,
        }}
      >
        {/* CABECERA */}
        <div className="row header">
          {headers.map((text, i) => (
            <div
              className="cell header-cell"
              key={i}
              style={{ width: getAbsWidth(colWidths[i]) }}
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
              <div className="col-resizer" onMouseDown={(e) => startResize(i, e)} />
            </div>
          ))}
        </div>

        {/* FILAS */}
        {data.map((fila, r) => (
          <div className="row" key={r}>
            {fila.map((cel, c) => (
              <div
                className="cell"
                key={c}
                style={{ width: getAbsWidth(colWidths[c]) }}
              >
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
