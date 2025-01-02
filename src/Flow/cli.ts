import { executeGraph } from './engine';
import type { FlowGraph } from './engine';

import graph from './graph.json';

try {
  const results = executeGraph(graph as FlowGraph);
  console.info('Results:', results);
} catch (error) {
  console.error('Execution error:', error);
}
