import type { FC } from 'react';

import { ConcatenateNode } from './ConcatenateNode';
import { LogNode } from './LogNode';
import { MathsNode } from './MathsNode';
import { SourceNode } from './SourceNode';
import { TimesTwoNode } from './TimesTwoNode';
import { ValueNode } from './ValueNode';

// biome-ignore lint/suspicious/noExplicitAny: 🤷
export const nodeTypes: { [key: string]: FC<any> } = {
  value: ValueNode,
  source: SourceNode,
  target: SourceNode,
  concatenate: ConcatenateNode,
  maths: MathsNode,
  log: LogNode,
  timesTwo: TimesTwoNode,
} as const;
