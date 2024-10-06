import {
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  NodeProps,
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';
import React, { useCallback } from 'react';

interface XYFlowNodeData {
  label: string;
  headerBackground: string;
  headerForeground: string;
  value: number;
  valueType: string;
  operation?: 'add' | 'subtract' | 'multiply' | 'divide';
}

export type XYFlowNode = Node<XYFlowNodeData>;
export type XYFlowEdge = Edge;

export class XYFlowExecutionEngine {
  private nodes: XYFlowNode[];
  private edges: XYFlowEdge[];

  constructor(nodes: XYFlowNode[], edges: XYFlowEdge[]) {
    this.nodes = nodes;
    this.edges = edges;
  }

  private getNodeById(id: string): XYFlowNode | undefined {
    return this.nodes.find((node) => node.id === id);
  }

  private getInputNodes(nodeId: string): XYFlowNode[] {
    const inputEdges = this.edges.filter((edge) => edge.target === nodeId);
    return inputEdges.map((edge) => this.getNodeById(edge.source)).filter((node): node is XYFlowNode => node !== undefined);
  }

  private updateMathsNode(node: XYFlowNode): void {
    const inputNodes = this.getInputNodes(node.id);
    if (inputNodes.length !== 2) {
      console.error(`Maths node ${node.id} should have exactly 2 inputs`);
      return;
    }

    const a = +inputNodes[0].data.value;
    const b = +inputNodes[1].data.value;

    switch (node.data.operation) {
      case 'add':
        node.data.value = a + b;
        break;
      case 'subtract':
        node.data.value = a - b;
        break;
      case 'multiply':
        node.data.value = a * b;
        break;
      case 'divide':
        if (b !== 0) {
          node.data.value = a / b;
        } else {
          console.error(`Division by zero in Maths node ${node.id}`);
          node.data.value = Number.NaN;
        }
        break;
      default:
        console.error(`Unknown operation in Maths node ${node.id}`);
        break;
    }
  }

  private updateLogNode(node: XYFlowNode): void {
    const inputNodes = this.getInputNodes(node.id);
    if (inputNodes.length !== 1) {
      console.error(`Log node ${node.id} should have exactly 1 input`);
      return;
    }

    const input = inputNodes[0].data.value;
    console.log(`Log node ${node.id}: ${input}`);
    node.data.value = input;
  }

  public execute(): XYFlowNode[] {
    const sortedNodes = this.topologicalSort();

    for (const node of sortedNodes) {
      switch (node.type) {
        case 'maths':
          this.updateMathsNode(node);
          break;
        case 'log':
          this.updateLogNode(node);
          break;
        default:
          // For other node types (e.g., textUpdater), we don't need to do anything
          break;
      }
    }

    return this.nodes;
  }

  private topologicalSort(): XYFlowNode[] {
    const visited = new Set<string>();
    const stack: XYFlowNode[] = [];

    const visit = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const outgoingEdges = this.edges.filter((edge) => edge.source === nodeId);
      for (const edge of outgoingEdges) {
        visit(edge.target);
      }

      const node = this.getNodeById(nodeId);
      if (node) stack.unshift(node);
    };

    for (const node of this.nodes) {
      if (!visited.has(node.id)) {
        visit(node.id);
      }
    }

    return stack;
  }
}

export function useXYFlowEngine(initialNodes: XYFlowNode[], initialEdges: XYFlowEdge[]) {
  const [nodes, setNodes] = React.useState<XYFlowNode[]>(initialNodes);
  const [edges, setEdges] = React.useState<XYFlowEdge[]>(initialEdges);

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds) as unknown as XYFlowNode[]);
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const executeGraph = useCallback(() => {
    const engine = new XYFlowExecutionEngine(nodes, edges);
    const updatedNodes = engine.execute();
    setNodes(updatedNodes);
  }, [nodes, edges]);

  const updateNodeValue = useCallback((nodeId: string, newValue: number) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              value: newValue,
            },
          };
        }
        return node;
      }),
    );
  }, []);

  const updateMathsOperation = useCallback((nodeId: string, operation: 'add' | 'subtract' | 'multiply' | 'divide') => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId && node.type === 'maths') {
          return {
            ...node,
            data: {
              ...node.data,
              operation,
            },
          };
        }
        return node;
      }),
    );
  }, []);

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    executeGraph,
    updateNodeValue,
    updateMathsOperation,
  };
}
