import {
  type Edge,
  type HandleProps,
  type NodeData,
  type NodeTypes,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type Position,
  ReactFlow,
  type ReactFlowInstance,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
} from '@xyflow/react';
import { useCallback, useState } from 'react';

import { LogNode } from './nodes/LogNode';
import { MathsNode } from './nodes/MathsNode';
import { SourceNode } from './nodes/SourceNode';
import { TextUpdaterNode } from './nodes/TextUpdaterNode';
import { TimesTwoNode } from './nodes/TimesTwoNode';

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
};

//#region Nodes Config
const nodeTypes: NodeTypes = {
  textUpdater: TextUpdaterNode,
  source: SourceNode,
  target: SourceNode,
  concatenate: SourceNode,
  maths: MathsNode,
  log: LogNode,
  timesTwo: TimesTwoNode,
};

const initialNodes: Node<Data>[] = [
  {
    id: 'text-1',
    type: 'textUpdater',
    position: { x: 50, y: 50 },
    data: {
      label: 'Value',
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
    id: 'times-two-1',
    type: 'timesTwo',
    position: { x: 400, y: 300 },
    data: {
      label: 'Times Two',
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
      headerBackground: 'blue',
      headerForeground: 'white',
      value: 0,
      valueType: 'number',
    },
  },
  {
    id: 'log-2',
    type: 'log',
    position: { x: 700, y: 250 },
    data: {
      label: 'Log',
      headerBackground: 'blue',
      headerForeground: 'white',
      value: 0,
      valueType: 'number',
    },
  },
  {
    id: 'log-3',
    type: 'log',
    position: { x: 700, y: 400 },
    data: {
      label: 'Log',
      headerBackground: 'blue',
      headerForeground: 'white',
      value: 0,
      valueType: 'number',
    },
  },
];
//#endregion

const initialEdges: Edge[] = [
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
];

export const Flow = (): JSX.Element => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();
  const { setViewport } = useReactFlow();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [],
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      console.group('Saved Data');
      console.info(JSON.stringify(flow, null, 2));
      console.groupEnd();
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      try {
        const req = await fetch('http://localhost:8882/flows/1');
        const flow = await req.json();
        console.info(flow);

        if (flow) {
          const { x = 0, y = 0, zoom = 1 } = flow.viewport;
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          setViewport({ x, y, zoom });
        }
      } catch (err) {
        console.info(err);
      }

      // const flow = JSON.parse(localStorage.getItem(flowKey));
    };

    restoreFlow();
  }, [setViewport]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
      >
        {/* Add your custom node types here */}
      </ReactFlow>
      <div style={{ position: 'absolute', top: 10, right: 10 }}>
        <button type="button" onClick={onSave}>
          Save
        </button>
      </div>
    </div>
  );
};
