import type React from 'react';
import SelectorComp from './SelectorComp';
import BotonComp from './BotonComp';
import CheckboxComp from './CheckboxComp';
import GridTable from './GridTable';
import LinkComp from './LinkComp';
import SidebarComp from './SidebarComp';

export const REGISTRY: Record<string, React.FC<any>> = {
  Selector: SelectorComp,
  Boton: BotonComp,
  Checkbox: CheckboxComp,
  Tabla: GridTable,
  Link: LinkComp,
  Sidebar: SidebarComp,
};
