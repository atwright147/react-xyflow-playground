import { ReactFlow } from '@xyflow/react';

import { type XYFlowEdge, type XYFlowNode, useXYFlowEngine } from './engine';
import { LogNode } from './nodes/LogNode';
import { MathsNode } from './nodes/MathsNode';
import { TextUpdaterNode } from './nodes/TextUpdaterNode';

export function Flow() {
  const nodeTypes = {
    textUpdater: TextUpdaterNode,
    maths: MathsNode,
    log: LogNode,
  };

  const initialNodes: XYFlowNode[] = [
    {
      id: 'text-1',
      type: 'textUpdater',
      position: { x: 50, y: 50 },
      data: {
        label: 'Value 1',
        headerBackground: 'purple',
        headerForeground: 'white',
        value: 5,
        valueType: 'number',
      },
    },
    {
      id: 'text-2',
      type: 'textUpdater',
      position: { x: 50, y: 200 },
      data: {
        label: 'Value 2',
        headerBackground: 'purple',
        headerForeground: 'white',
        value: 10,
        valueType: 'number',
      },
    },
    {
      id: 'maths-1',
      type: 'maths',
      position: { x: 400, y: 100 },
      data: {
        label: 'Maths',
        headerBackground: 'blue',
        headerForeground: 'white',
        value: 0,
        valueType: 'number',
        operation: 'add',
      },
    },
    {
      id: 'log-1',
      type: 'log',
      position: { x: 700, y: 100 },
      data: {
        label: 'Log',
        headerBackground: 'green',
        headerForeground: 'white',
        value: 0,
        valueType: 'number',
      },
    },
  ];

  const initialEdges: XYFlowEdge[] = [
    {
      source: 'text-1',
      sourceHandle: 'text-1',
      target: 'maths-1',
      targetHandle: 'a',
      id: 'xy-edge__text-1text-1-maths-1a',
    },
    {
      source: 'text-2',
      sourceHandle: 'text-2',
      target: 'maths-1',
      targetHandle: 'b',
      id: 'xy-edge__text-2text-2-maths-1b',
    },
    {
      source: 'maths-1',
      sourceHandle: 'o',
      target: 'log-1',
      targetHandle: 'log-1',
      id: 'xy-edge__maths-1o-log-1log-1',
    },
  ];

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    executeGraph,
    updateNodeValue,
    updateMathsOperation,
  } = useXYFlowEngine(initialNodes, initialEdges);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
      >
        {/* Add your custom node types here */}
      </ReactFlow>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <button type="button" onClick={executeGraph}>
          Execute Graph
        </button>
      </div>
    </div>
  );
}
