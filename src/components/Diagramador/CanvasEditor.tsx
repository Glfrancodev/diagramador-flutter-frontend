// src/components/Diagramador/CanvasEditor.tsx
import { useDrop } from 'react-dnd';
import { Rnd } from 'react-rnd';
import { REGISTRY } from './elementos/registry';

export type Elemento = {
  id: string;
  tipo: string;
  x: number;
  y: number;
  width: number;
  height: number;
  props?: {
    locked?: boolean;
    [key: string]: any;
  };
};

type Props = {
  tabId: string;
  zoom: number;
  width: number;
  height: number;
  elementos: Elemento[];
  onChange: (tabId: string, up: (p: Elemento[]) => Elemento[]) => void;
  onSelect?: (id: string | null) => void;
  selectedElementId?: string | null;
};

const defaultProps = (tipo: string, canvasHeight: number) => {
    const scale = canvasHeight; // usar canvas height para escalar
    const px = (v: number) => +(v / scale).toFixed(4); // valor normalizado
    if (tipo === 'Imagen') {
      return {
        nombre: '',
        tipo: '',
        idArchivo: '',
        borderRadius: 0,
      };
    }
    if (tipo === 'Video') {
      return {
        nombre: '',
        idArchivo: '',
        borderRadius: 0,
      };
    }

    if (tipo === 'Label') {
    return {
      texto: 'Etiqueta',
      fontSize: px(14),
      color: '#000000',
      bold: false,
    };
  }
  if (tipo === 'InputBox') {
    return {
      placeholder: 'Ingrese texto...',
      fontSize: px(14),
    };
  }
  if (tipo === 'Selector') return { options: ['Opción 1', 'Opción 2'], fontSize: px(14), };
  if (tipo === 'Boton') {
    return {
      texto: 'Botón',
      color: '#007bff',
      textColor: '#ffffff',
      borderRadius: 4,
      fontSize: px(14),
    };
  }

  if (tipo === 'Checkbox') return { texto: 'Opción', fontSize: px(14), };
if (tipo === 'Tabla') {
  const rel = +(120 / canvasHeight /* ⬅ solo para inicial */).toFixed(4); // ≈ 0.20 en phone
  return {
    headers: ['Col 1', 'Col 2', 'Col 3'],
    data: [['A1','B1','C1'], ['A2','B2','C2']],
    colWidths: [rel, rel, rel],   // ← ya proporcional
    fontSize: px(14),
  };
}

  if (tipo === 'Link') {
    return { texto: 'Visítanos', url: 'https://ejemplo.com', fontSize: px(14), color: '#2563eb' };
  }
  if (tipo === 'Sidebar') {
    return {
      titulo: 'Menú',
      items: [
        { texto: 'Inicio', nombrePestana: 'Pantalla 1' },
        { texto: 'Pantalla 2', nombrePestana: 'Pantalla 2' },
      ],
      visible: true,
      fontSize: px(14),     // ✅ ya estaba
      bgColor: '#1f2937',   // ✅ nuevo
      textColor: '#ffffff', // ✅ nuevo
    };
  }

  if (tipo === 'InputFecha') {
  return {
    fontSize: px(14),
  };
  }
  return {};
};

export default function CanvasEditor({
  tabId,
  zoom,
  width,
  height,
  elementos,
  onChange,
  onSelect,
  selectedElementId,
}: Props) {
  const canvasId = `canvas-area-${tabId}`;

  const [, dropRef] = useDrop(
    () => ({
      accept: 'COMPONENTE',
      drop: (item: { tipo: string }, monitor) => {
        const offset = monitor.getClientOffset();
        if (!offset) return;

        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const xAbs = (offset.x - rect.left) / zoom;
        const yAbs = (offset.y - rect.top) / zoom;

        // Default size en píxeles
        const defaultWidthPx = 140;
        const defaultHeightPx = item.tipo === 'Sidebar' ? height - 40 : 50;

        // Conversión a proporciones relativas
        const x = xAbs / width;
        const y = yAbs / height;
        const widthRel = defaultWidthPx / width;
        const heightRel = defaultHeightPx / height;

        const nuevo: Elemento = {
          id: crypto.randomUUID(),
          tipo: item.tipo,
          x,
          y,
          width: widthRel,
          height: heightRel,
          props: defaultProps(item.tipo, height),
        };

        onChange(tabId, (prev) => [...prev, nuevo]);
      },
    }),
    [tabId, zoom, width, height] // ¡IMPORTANTE! Agregar width y height como dependencias
  );


  const setDropRef = (n: HTMLDivElement | null) => {
    if (n) dropRef(n);
  };

const move = (id: string, x: number, y: number, w?: number, h?: number) =>
  onChange(tabId, (p) =>
    p.map((e) =>
      e.id === id
        ? {
            ...e,
            x: x / (width * zoom),
            y: y / (height * zoom),
            width: w !== undefined ? w / (width * zoom) : e.width,
            height: h !== undefined ? h / (height * zoom) : e.height,
          }
        : e
    )
  );


  const renderContenido = (el: Elemento) => {
    const Comp = REGISTRY[el.tipo];
    if (Comp) {
      const isTabla = el.tipo === 'Tabla';
      if (el.tipo === 'Sidebar') {
        const isVisible = el.props?.visible ?? true;

        return (
          <Comp
            {...el.props}
            titulo={el.props?.titulo || 'Menú'} // ✅ NUEVO
            zoom={zoom}
            canvasHeight={height} // ✅ nuevo
            canvasWidth={width}   // ✅ nuevo
            visible={isVisible}
            onToggle={(nextVisible: boolean) => {
              onChange(tabId, (prev) =>
                prev.map((e) =>
                  e.id === el.id ? { ...e, props: { ...e.props, visible: nextVisible } } : e
                )
              );
            }}
          />

        );
      }

      return (
        <Comp
          {...el.props}
          zoom={zoom}
          canvasHeight={height} // ✅ nuevo
          canvasWidth={width} // ✅ NUEVO
          onChange={
            isTabla
              ? (next: any) =>
                  onChange(tabId, (prev) =>
                    prev.map((e) =>
                      e.id === el.id ? { ...e, props: { ...e.props, ...next } } : e
                    )
                  )
              : undefined
          }
        />
      );
    }

    return (
      <div
        style={{
          background: '#007bff',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          width: '100%',
          height: '100%',
          fontSize: 14 * zoom,
        }}
      >
        {el.tipo}
      </div>
    );
  };

  return (
    <div
      style={{
        flex: 1,
        overflow: 'auto',
        background: '#f0f0f0',
        padding: 20,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        id={canvasId}
        ref={setDropRef}
        onMouseDown={() => onSelect?.(null)}
        style={{
          width: width * zoom,
          height: height * zoom,
          background: '#fff',
          border: '1px solid #ccc',
          position: 'relative',
        }}
      >
        {elementos.map((el) => {

          return (
            <Rnd
              key={el.id}
              bounds="parent"
              enableResizing
              disableDragging={el.props?.locked === true}
              size={{
                width: el.width * width * zoom,
                height: el.height * height * zoom,
              }}
              position={{
                x: el.x * width * zoom,
                y: el.y * height * zoom,
              }}
              dragCancel=".no-drag"
              onDragStop={(_, d) => move(el.id, d.x, d.y)}
              onResizeStop={(_, __, ref, ___, pos) =>
                move(el.id, pos.x, pos.y, ref.offsetWidth, ref.offsetHeight)
              }
              onClick={() => onSelect?.(el.id)}
              style={{
                border:
                  el.id === selectedElementId
                    ? '2px solid #2563eb'
                    : '1px solid transparent',
                borderRadius: 4,
                boxSizing: 'border-box',
                background: el.props?.locked ? '#f9fafb' : undefined,
                cursor: el.props?.locked ? 'default' : 'move',
              }}
            >
              {renderContenido(el)}
            </Rnd>
          );

        })}
      </div>
    </div>
  );
}
