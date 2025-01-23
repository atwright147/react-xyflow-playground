import type { HandleProps, Position } from '@xyflow/react';

export interface HandleConfig extends Omit<HandleProps, 'position'> {
  label: string;
  position: Position;
  x: number;
  y: number;
}

// must be a type rather than an interface
export type CustomNodeData = {
  label?: string;
  headerForeground?: string;
  headerBackground?: string;
  handles?: HandleConfig[];
  minWidth?: number;
  resizable?: boolean;
  value?: string | number | boolean;
  valueType?: string;
  operation?: string;
};
