import {
  Background,
  Controls,
  type Edge,
  type HandleProps,
  type Node,
  type NodeTypes,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
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

import '@xyflow/react/dist/style.css';

import styles from './Flow.module.scss';

export interface HandleConfig extends Omit<HandleProps, 'position'> {
  label: string;
}

export interface Data {
  [key: string]: unknown;
  label?: string;
  headerForeground?: string;
  headerBackground?: string;
  handles?: HandleConfig[];
  minWidth?: number;
  resizable?: boolean;
  value?: unknown;
  valueType?: string;
}

//#region Nodes Config
const nodeTypes: NodeTypes = {
  textUpdater: TextUpdaterNode,
  source: SourceNode,
  target: SourceNode,
  concatenate: SourceNode,
  maths: MathsNode,
  log: LogNode,
};

const initialNodes: Node<Data>[] = [
  // {
  //   id: 'source',
  //   type: 'source',
  //   position: { x: 50, y: 200 },
  //   data: {
  //     minWidth: 250,
  //     resizable: false,
  //     label: 'Source',
  //     headerForeground: 'white',
  //     headerBackground: 'green',
  //     handles: [
  //       {
  //         id: '1',
  //         label: 'top',
  //         type: 'source',
  //       },
  //       {
  //         id: '2',
  //         label: 'middle',
  //         type: 'source',
  //       },
  //       {
  //         id: '3',
  //         label: 'bottom',
  //         type: 'source',
  //       },
  //       {
  //         id: '4',
  //         label: 'bottom2',
  //         type: 'source',
  //       },
  //       {
  //         id: '5',
  //         label: 'Bottom3',
  //         type: 'source',
  //       },
  //     ],
  //   },
  // },
  // {
  //   id: 'target',
  //   type: 'target',
  //   position: { x: 300, y: 200 },
  //   data: {
  //     minWidth: 250,
  //     resizable: false,
  //     label: 'Target',
  //     headerBackground: 'green',
  //     headerForeground: 'white',
  //     handles: [
  //       {
  //         id: '1',
  //         label: 'top',
  //         type: 'target',
  //       },
  //       {
  //         id: '2',
  //         label: 'middle',
  //         type: 'target',
  //       },
  //       {
  //         id: '3',
  //         label: 'bottom',
  //         type: 'target',
  //       },
  //       {
  //         id: '4',
  //         label: 'bottom2',
  //         type: 'target',
  //       },
  //       {
  //         id: '5',
  //         label: 'Bottom3',
  //         type: 'target',
  //       },
  //     ],
  //   },
  // },
  // {
  //   id: 'concatenate',
  //   type: 'concatenate',
  //   position: { x: 550, y: 200 },
  //   data: {
  //     minWidth: 250,
  //     resizable: false,
  //     label: 'Concatenate',
  //     headerBackground: 'blue',
  //     headerForeground: 'white',
  //     handles: [
  //       {
  //         id: '1',
  //         label: 'Value 1',
  //         type: 'target',
  //       },
  //       {
  //         id: '2',
  //         label: 'Value 2',
  //         type: 'target',
  //       },
  //       {
  //         id: '3',
  //         label: 'Output',
  //         type: 'source',
  //       },
  //     ],
  //   },
  // },
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
      label: 'Value',
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

  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
  const onConnect: OnConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), []);

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
    <div className={styles.container}>
      <div className={styles.flowAndPreview}>
        <div className={styles.flow}>
          <ReactFlow
            nodes={nodes}
            onNodesChange={onNodesChange}
            edges={edges}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onInit={setRfInstance}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>

        <div className={styles.preview}>
          <button type="button" onClick={onSave}>
            Save
          </button>
          <button type="button" onClick={onRestore}>
            Restore
          </button>
        </div>
      </div>
    </div>
  );
};
