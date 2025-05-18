import type React from 'react';
import SelectorComp from './SelectorComp';
import BotonComp from './BotonComp';
import CheckboxComp from './CheckboxComp';
import GridTable from './GridTable'; // asegúrate de que el nombre coincida

export const REGISTRY: Record<string, React.FC<any>> = {
  Selector: SelectorComp,
  Boton: BotonComp,
  Checkbox: CheckboxComp,
  Tabla: GridTable,
};
