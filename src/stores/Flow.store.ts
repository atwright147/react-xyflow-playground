// biome-ignore lint/suspicious/noExplicitAny: temporary
type types = any;
// biome-ignore lint/suspicious/noExplicitAny: temporary
type NodeType = any;

import {
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CustomNodeData } from '../../types/nodes';

//#region Nodes Config
const initialNodes: Node<CustomNodeData>[] = [
  // {
  //   id: 'text-1',
  //   type: 'textUpdater',
  //   position: { x: 50, y: 50 },
  //   data: {
  //     label: 'Value',
  //     headerBackground: 'purple',
  //     headerForeground: 'white',
  //     value: 5,
  //     valueType: 'number',
  //   },
  // },
  // {
  //   id: 'text-2',
  //   type: 'textUpdater',
  //   position: { x: 50, y: 200 },
  //   data: {
  //     label: 'Value 2',
  //     headerBackground: 'purple',
  //     headerForeground: 'white',
  //     value: 10,
  //     valueType: 'number',
  //   },
  // },
  // {
  //   id: 'maths-1',
  //   type: 'maths',
  //   position: { x: 400, y: 100 },
  //   data: {
  //     label: 'Maths',
  //     headerBackground: 'blue',
  //     headerForeground: 'white',
  //     value: 0,
  //     valueType: 'number',
  //     operation: 'add',
  //   },
  // },
  // {
  //   id: 'times-two-1',
  //   type: 'timesTwo',
  //   position: { x: 400, y: 300 },
  //   data: {
  //     label: 'Times Two',
  //     headerBackground: 'blue',
  //     headerForeground: 'white',
  //     value: 0,
  //     valueType: 'number',
  //     operation: 'add',
  //   },
  // },
  // {
  //   id: 'log-1',
  //   type: 'log',
  //   position: { x: 700, y: 100 },
  //   data: {
  //     label: 'Log',
  //     headerBackground: 'blue',
  //     headerForeground: 'white',
  //     value: 0,
  //     valueType: 'number',
  //   },
  // },
  // {
  //   id: 'log-2',
  //   type: 'log',
  //   position: { x: 700, y: 250 },
  //   data: {
  //     label: 'Log',
  //     headerBackground: 'blue',
  //     headerForeground: 'white',
  //     value: 0,
  //     valueType: 'number',
  //   },
  // },
  // {
  //   id: 'log-3',
  //   type: 'log',
  //   position: { x: 700, y: 400 },
  //   data: {
  //     label: 'Log',
  //     headerBackground: 'blue',
  //     headerForeground: 'white',
  //     value: 0,
  //     valueType: 'number',
  //   },
  // },
];

const initialEdges: Edge[] = [
  // {
  //   source: 'text-1',
  //   sourceHandle: 'text-1',
  //   target: 'maths-1',
  //   targetHandle: 'a',
  //   id: 'xy-edge__text-1text-1-maths-1a',
  // },
  // {
  //   source: 'text-2',
  //   sourceHandle: 'text-2',
  //   target: 'maths-1',
  //   targetHandle: 'b',
  //   id: 'xy-edge__text-2text-2-maths-1b',
  // },
];
//#endregion

export interface FlowStore {
  nodes: NodeType[];
  edges: Edge[];
  setNodes: (nodes: NodeType[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  isValidConnection: (connection: Edge | Connection) => boolean;
  selectedNodeType: types | null;
  onNodeMouseEnter: (event: React.MouseEvent, node: NodeType) => void;
  draggedItem: types | null;
  handleDragStart: (event: React.DragEvent) => void;
  handleDragEnd: (event: React.DragEvent) => void;
}

const useFlowStore = create<FlowStore>()(
  devtools(
    (set, get) => ({
      nodes: initialNodes,
      edges: initialEdges,
      setNodes: (nodes: NodeType[]) => {
        set({ nodes });
      },
      setEdges: (edges: Edge[]) => {
        set({ edges });
      },
      onNodesChange: (changes: NodeChange<NodeType>[]) => {
        set({
          nodes: applyNodeChanges<NodeType>(changes, get().nodes),
        });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection: Connection) => {
        set({
          edges: addEdge(connection, get().edges),
        });
      },
      isValidConnection: (connection: Edge | Connection) => {
        if (connection.source === connection.target) {
          return false;
        }

        return true;
      },
      selectedNodeType: null,
      onNodeMouseEnter: (event, node) => {
        set({ selectedNodeType: node.type });
      },
      draggedItem: null,
      handleDragStart: (event) => {
        // set({ draggedItem: event.active.id });
      },
      handleDragEnd: (event) => {
        set({ draggedItem: null });

        const nodes = get().nodes;
        const setNodes = get().setNodes;

        // if (event.over) {
        //   console.log('Dropped over:', event.over.id);

        //   const nodeType = event.active.id as types;
        //   // FIXME: make position dynamic
        //   const position = {
        //     x: 100,
        //     y: 100,
        //   };
        //   const newNode: NodeType = {
        //     id: getId(),
        //     type: nodeType,
        //     position: position,
        //     data: { value: 0 },
        //   };

        //   setNodes([...nodes, newNode]);
        //   console.log('New node:', newNode);
        // }
      },
    }),
    { enabled: true, name: 'FlowStore' },
  ),
);

export default useFlowStore;
