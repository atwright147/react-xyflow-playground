import type { Edge, Node } from '@xyflow/react';
import graph from './graph.json';

interface XYFlowNode extends Node {
  data: {
    label: string;
    headerBackground: string;
    headerForeground: string;
    value: number;
    valueType: string;
  };
}

interface XYFlowEdge extends Edge {}

class XYFlowExecutionEngine {
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

    const a = inputNodes[0].data.value;
    const b = inputNodes[1].data.value;
    node.data.value = a + b; // For this example, we'll just add the two inputs
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

// // Example usage
// const nodes: XYFlowNode[] = [
//   // ... (nodes from the provided example)
// ];

// const edges: XYFlowEdge[] = [
//   // ... (edges from the provided example)
// ];

// const engine = new XYFlowExecutionEngine(nodes, edges);
const engine = new XYFlowExecutionEngine(graph.nodes, graph.edges);
const updatedNodes = engine.execute();
console.log(updatedNodes);
