// src/components/Diagramador/PropiedadesPanel.tsx
import { useState } from 'react';
import type { Elemento } from './CanvasEditor';

type Props = {
  elemento: Elemento | null;
  onUpdate: (fn: (el: Elemento) => Elemento) => void;
  canvasHeight: number; // ✅ nuevo
};

export default function PropiedadesPanel({ elemento, onUpdate, canvasHeight }: Props) {
  if (!elemento) return <div style={{ padding: 10 }}>Selecciona un elemento…</div>;

  const set = (p: any) =>
    onUpdate((el) => ({ ...el, props: { ...el.props, ...p } }));

  const toggleLock = () => {
    set({ locked: !elemento.props?.locked });
  };

  const pxToRel = (px: number) => +(px / canvasHeight).toFixed(4);
  const relToPx = (rel: number) => Math.round(rel * canvasHeight);


  const bloqueBase = (
    <div style={{ marginTop: 10 }}>
      <button
        onClick={toggleLock}
        style={{
          width: '100%',
          padding: 6,
          background: elemento.props?.locked ? '#ef4444' : '#10b981',
          color: '#fff',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
        }}
      >
        {elemento.props?.locked ? '🔒 Movimiento bloqueado' : '🔓 Movimiento libre'}
      </button>
    </div>
  );
  

/* ------------------- SELECTOR ------------------- */
if (elemento.tipo === 'Selector') {
  const lista = elemento.props?.options ?? [];
  const [texto, setTexto] = useState(lista.join('\n'));

  const apply = (v: string) => {
    setTexto(v);
    set({
      options: v.split('\n').map((s) => s.trim()).filter(Boolean),
    });
  };

  return (
    <div style={{ padding: 10 }}>
      <h4>Selector</h4>

      <label style={{ display: 'block', marginBottom: 6 }}>
        Opciones (una por línea)
        <textarea
          style={{ width: '100%', height: 100 }}
          value={texto}
          onChange={(e) => apply(e.target.value)}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 6 }}>
        Tamaño de texto (px):
        <input
          type="number"
          min={8}
          max={72}
          value={relToPx(elemento.props?.fontSize ?? 0.02)} // ← muestra en px reales
          onChange={(e) =>
            set({ fontSize: pxToRel(Number(e.target.value) || 14) }) // ← guarda como relativo
          }
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>

      {bloqueBase}
    </div>
  );
}


  /* ------------------- BOTÓN ------------------- */
  if (elemento.tipo === 'Boton') {
    return (
      <div style={{ padding: 10 }}>
        <h4>Botón</h4>

        <label style={{ display: 'block', marginBottom: 6 }}>
          Texto:
          <input
            type="text"
            value={elemento.props?.texto || ''}
            onChange={(e) => set({ texto: e.target.value })}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 6 }}>
          Color de fondo:
          <input
            type="color"
            value={elemento.props?.color || '#007bff'}
            onChange={(e) => set({ color: e.target.value })}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 6 }}>
          Color del texto:
          <input
            type="color"
            value={elemento.props?.textColor || '#ffffff'}
            onChange={(e) => set({ textColor: e.target.value })}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 6 }}>
          Radio de borde:
          <input
            type="number"
            min={0}
            max={50}
            value={elemento.props?.borderRadius ?? 4}
            onChange={(e) => set({ borderRadius: Number(e.target.value) || 0 })}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 6 }}>
          Tamaño de texto (px):
          <input
            type="number"
            min={8}
            max={72}
            value={relToPx(elemento.props?.fontSize ?? 0.02)} // ✅ muestra en px
            onChange={(e) => set({ fontSize: pxToRel(Number(e.target.value) || 14) })} // ✅ guarda como proporcional
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        {bloqueBase}
      </div>
    );
  }

/* ------------------- CHECKBOX ------------------- */
  if (elemento.tipo === 'Checkbox') {
    return (
      <div style={{ padding: 10 }}>
        <h4>Checkbox</h4>

        <label style={{ display: 'block', marginBottom: 6 }}>
          Texto:
          <input
            type="text"
            value={elemento.props?.texto || ''}
            onChange={(e) => set({ texto: e.target.value })}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 6 }}>
          Tamaño de texto (px):
          <input
            type="number"
            min={8}
            max={72}
            value={relToPx(elemento.props?.fontSize ?? 0.02)}
            onChange={(e) => set({ fontSize: pxToRel(Number(e.target.value) || 14) })}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        {bloqueBase}
      </div>
    );
  }


/* ------------------- TABLA ------------------- */
if (elemento.tipo === 'Tabla') {
  const filas = elemento.props?.data?.length ?? 2;
  const columnas = elemento.props?.headers?.length ?? 3;

  const relToPx = (rel: number) => Math.round(rel * canvasHeight);
  const pxToRel = (px: number) => +(px / canvasHeight).toFixed(4);

  return (
    <div style={{ padding: 10 }}>
      <h4>Tabla</h4>

      <label>
        Filas:
        <input
          type="number"
          min={1}
          max={50}
          value={filas}
          onChange={(e) => {
            const n = parseInt(e.target.value);
            const old = elemento.props?.data || [];
            const updated = [...old];
            while (updated.length < n)
              updated.push(Array(columnas).fill('...'));
            updated.length = n;
            onUpdate((el) => ({
              ...el,
              props: { ...el.props, data: updated },
            }));
          }}
          style={{ width: '100%', marginBottom: 8 }}
        />
      </label>

      <label>
        Columnas:
        <input
          type="number"
          min={1}
          max={10}
          value={columnas}
          onChange={(e) => {
            const n = parseInt(e.target.value);
            const oldData = elemento.props?.data || [];
            const newData = oldData.map((fila: string[]) => {
              const f = [...fila];
              while (f.length < n) f.push('...');
              f.length = n;
              return f;
            });

            const newHeaders = [...(elemento.props?.headers || [])];
            while (newHeaders.length < n)
              newHeaders.push(`Col ${newHeaders.length + 1}`);
            newHeaders.length = n;

            const newWidths = [...(elemento.props?.colWidths || [])];
            while (newWidths.length < n) newWidths.push(120);
            newWidths.length = n;

            onUpdate((el) => ({
              ...el,
              props: {
                ...el.props,
                data: newData,
                headers: newHeaders,
                colWidths: newWidths,
              },
            }));
          }}
          style={{ width: '100%', marginBottom: 8 }}
        />
      </label>

      <label>
        Tamaño de texto (px):
        <input
          type="number"
          min={8}
          max={30}
          value={relToPx(elemento.props?.fontSize ?? 0.02)} // ✅ muestra en px reales
          onChange={(e) =>
            onUpdate((el) => ({
              ...el,
              props: {
                ...el.props,
                fontSize: pxToRel(Number(e.target.value) || 14), // ✅ guarda como proporcional
              },
            }))
          }
          style={{ width: '100%', marginBottom: 8 }}
        />
      </label>

      <div style={{ marginTop: 10 }}>
        <button
          onClick={() =>
            onUpdate((el) => ({
              ...el,
              props: {
                ...el.props,
                locked: !el.props?.locked,
              },
            }))
          }
          style={{
            width: '100%',
            padding: 6,
            background: elemento.props?.locked ? '#ef4444' : '#10b981',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {elemento.props?.locked ? '🔒 Movimiento bloqueado' : '🔓 Movimiento libre'}
        </button>
      </div>
    </div>
  );
}

  /* ------------------- LINK ------------------- */
  if (elemento.tipo === 'Link') {
    return (
      <div style={{ padding: 10 }}>
        <h4>Enlace</h4>

        <label style={{ display: 'block', marginBottom: 6 }}>
          Texto:
          <input
            type="text"
            value={elemento.props?.texto || ''}
            onChange={(e) => set({ texto: e.target.value })}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 6 }}>
          URL de destino:
          <input
            type="text"
            value={elemento.props?.url || ''}
            onChange={(e) => set({ url: e.target.value })}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 6 }}>
          Tamaño de texto (px):
          <input
            type="number"
            min={8}
            max={72}
            value={elemento.props?.fontSize ?? 14}
            onChange={(e) => set({ fontSize: Number(e.target.value) || 14 })}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 6 }}>
          Color:
          <input
            type="color"
            value={elemento.props?.color || '#2563eb'}
            onChange={(e) => set({ color: e.target.value })}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        {bloqueBase}
      </div>
    );
  }
  /* ------------------- SIDEBAR ------------------- */
  if (elemento.tipo === 'Sidebar') {
    const lista = elemento.props?.items || [];

    const updateItem = (i: number, key: 'texto' | 'nombrePestana', value: string) => {
      const copy = [...lista];
      copy[i] = { ...copy[i], [key]: value };
      set({ items: copy });
    };

    const removeItem = (i: number) => {
      const copy = [...lista];
      copy.splice(i, 1);
      set({ items: copy });
    };

    const addItem = () => {
      const copy = [...lista, { texto: 'Nuevo', nombrePestana: 'Pantalla 1' }];
      set({ items: copy });
    };

    return (
      <div style={{ padding: 10, maxHeight: '100%', overflowY: 'auto' }}>
        <h4>Sidebar</h4>

        <label style={{ display: 'block', marginBottom: 6 }}>
          Título del menú:
          <input
            type="text"
            value={elemento.props?.titulo || 'Menú'}
            onChange={(e) => set({ titulo: e.target.value })}
            style={{ width: '100%', marginTop: 4 }}
          />
        </label>

        {lista.map((item: any, i: number) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4 }}>
              Texto del ítem:
              <input
                type="text"
                value={item.texto}
                onChange={(e) => updateItem(i, 'texto', e.target.value)}
                style={{ width: '100%', marginTop: 4 }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: 4 }}>
              Nombre de pestaña destino:
              <input
                type="text"
                value={item.nombrePestana}
                onChange={(e) => updateItem(i, 'nombrePestana', e.target.value)}
                style={{ width: '100%', marginTop: 4 }}
              />
            </label>

            <button
              onClick={() => removeItem(i)}
              style={{
                width: '100%',
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: 6,
                marginTop: 4,
              }}
            >
              Eliminar
            </button>
          </div>
        ))}

        <button
          onClick={addItem}
          style={{
            width: '100%',
            background: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            padding: 6,
            marginBottom: 8,
          }}
        >
          + Añadir Item
        </button>

        <div style={{ marginTop: 10 }}>
          <label>
            Visible por defecto:
            <input
              type="checkbox"
              checked={elemento.props?.visible ?? true}
              onChange={(e) => set({ visible: e.target.checked })}
              style={{ marginLeft: 8 }}
            />
          </label>
        </div>

        {bloqueBase}
      </div>
    );
  }
/* ------------------- LABEL ------------------- */
if (elemento.tipo === 'Label') {
  return (
    <div style={{ padding: 10 }}>
      <h4>Etiqueta</h4>

      <label style={{ display: 'block', marginBottom: 6 }}>
        Texto:
        <input
          type="text"
          value={elemento.props?.texto || ''}
          onChange={(e) => set({ texto: e.target.value })}
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 6 }}>
        Tamaño de texto (px):
        <input
          type="number"
          min={8}
          max={72}
          value={relToPx(elemento.props?.fontSize ?? 0.02)} // ✅ muestra en px
          onChange={(e) => set({ fontSize: pxToRel(Number(e.target.value) || 14) })} // ✅ guarda como valor proporcional
          style={{ width: '100%', marginTop: 4 }}
        />

      </label>

      <label style={{ display: 'block', marginBottom: 6 }}>
        Color del texto:
        <input
          type="color"
          value={elemento.props?.color || '#000000'}
          onChange={(e) => set({ color: e.target.value })}
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 6 }}>
        Negrita:
        <input
          type="checkbox"
          checked={elemento.props?.bold || false}
          onChange={(e) => set({ bold: e.target.checked })}
          style={{ marginLeft: 8 }}
        />
      </label>

      {bloqueBase}
    </div>
  );
}
/* ------------------- INPUTBOX ------------------- */

if (elemento.tipo === 'InputBox') {
  return (
    <div style={{ padding: 10 }}>
      <h4>Campo de texto</h4>

      <label style={{ display: 'block', marginBottom: 6 }}>
        Placeholder:
        <input
          type="text"
          value={elemento.props?.placeholder || ''}
          onChange={(e) => set({ placeholder: e.target.value })}
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 6 }}>
        Tamaño de texto (px):
        <input
          type="number"
          min={8}
          max={72}
          value={relToPx(elemento.props?.fontSize ?? 0.02)} // ✅ mostrar en px reales
          onChange={(e) =>
            set({ fontSize: pxToRel(Number(e.target.value) || 14) }) // ✅ guardar como valor relativo
          }
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>

      {bloqueBase}
    </div>
  );
}

/* ------------------- INPUTFECHA ------------------- */
if (elemento.tipo === 'InputFecha') {
  return (
    <div style={{ padding: 10 }}>
      <h4>Campo de fecha</h4>

      <label style={{ display: 'block', marginBottom: 6 }}>
        Tamaño de texto (px):
        <input
          type="number"
          min={8}
          max={72}
          value={relToPx(elemento.props?.fontSize ?? 0.02)} // ✅ mostrar en px
          onChange={(e) =>
            set({ fontSize: pxToRel(Number(e.target.value) || 14) }) // ✅ guardar como proporcional
          }
          style={{ width: '100%', marginTop: 4 }}
        />
      </label>

      {bloqueBase}
    </div>
  );
}

  return <div style={{ padding: 10 }}>Sin propiedades editables</div>;
}
