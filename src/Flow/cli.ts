import { executeGraph } from './engine';

import graph from './graph.json';

try {
  // biome-ignore lint/suspicious/noExplicitAny: I'll fix it later
  const results = executeGraph(graph as any);
  console.info('Results:', results);
} catch (error) {
  console.error('Execution error:', error);
}
