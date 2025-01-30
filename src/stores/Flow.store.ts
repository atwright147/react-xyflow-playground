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
const initialNodes: Node<CustomNodeData>[] = [];

const initialEdges: Edge[] = [];
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
      handleDragStart: (event: React.DragEvent) => {
        // set({ draggedItem: event.active.id });
      },
      handleDragEnd: (event: React.DragEvent) => {
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
