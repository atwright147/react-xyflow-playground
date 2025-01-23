import type { FC } from 'react';

import { LogNode } from './LogNode';
import { MathsNode } from './MathsNode';
import { SourceNode } from './SourceNode';
import { TextUpdaterNode } from './TextUpdaterNode';
import { TimesTwoNode } from './TimesTwoNode';

// biome-ignore lint/suspicious/noExplicitAny: 🤷
export const nodeTypes: { [key: string]: FC<any> } = {
  textUpdater: TextUpdaterNode,
  source: SourceNode,
  target: SourceNode,
  concatenate: SourceNode,
  maths: MathsNode,
  log: LogNode,
  timesTwo: TimesTwoNode,
} as const;
