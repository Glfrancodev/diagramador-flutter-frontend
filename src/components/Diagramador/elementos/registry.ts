import type React from 'react';
import SelectorComp from './SelectorComp';
import BotonComp from './BotonComp';
import CheckboxComp from './CheckboxComp';
import GridTable from './GridTable';
import LinkComp from './LinkComp';
import SidebarComp from './SidebarComp';
import LabelComp from './LabelComp';
import InputBoxComp from './InputBoxComp';
import InputFechaComp from './InputFechaComp';
import ImagenComp from './ImagenComp';
import VideoComp from './VideoComp';
import AudioComp from './AudioComp';

export const REGISTRY: Record<string, React.FC<any>> = {
  Selector: SelectorComp,
  Boton: BotonComp,
  Checkbox: CheckboxComp,
  Tabla: GridTable,
  Link: LinkComp,
  Sidebar: SidebarComp,
  Label: LabelComp,
  InputBox: InputBoxComp,
  InputFecha: InputFechaComp,
  Imagen    : ImagenComp,
  Video: VideoComp,
  Audio: AudioComp,
};
