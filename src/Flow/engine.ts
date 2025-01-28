import type { Edge, Node, Viewport } from '@xyflow/react';

interface CustomNodeData extends Record<string, unknown> {
  label: string;
  headerBackground: string;
  headerForeground: string;
  value: number;
  valueType: string;
  operation?: string;
}

type NodeTypes = 'textUpdater' | 'maths' | 'timesTwo' | 'log' | 'concatenate';

interface CustomNode extends Node<CustomNodeData> {
  type: NodeTypes;
}

interface NodeInputAndOutput {
  [handle: string]: number | string | string[] | number[] | boolean;
}

interface ExecutionResults {
  allResults: Record<string, NodeInputAndOutput>;
  finalOutputs: Record<string, NodeInputAndOutput>;
}

export interface FlowGraph {
  nodes: CustomNode[];
  edges: Edge[];
  viewport: Viewport;
}

class GraphExecutor {
  private nodes: Map<string, CustomNode>;
  private edges: Edge[];
  private executionResults: Map<string, NodeInputAndOutput>;
  private finalOutputs: Set<string>;

  constructor(graph: FlowGraph) {
    this.nodes = new Map(graph.nodes.map((node) => [node.id, node]));
    this.edges = graph.edges;
    this.executionResults = new Map();
    this.finalOutputs = new Set();
  }

  private getNodeInputs(nodeId: string): NodeInputAndOutput {
    const inputs: NodeInputAndOutput = {};
    const incomingEdges = this.edges.filter((edge) => edge.target === nodeId);

    for (const edge of incomingEdges) {
      const sourceResults = this.executionResults.get(edge.source);
      if (sourceResults && edge.sourceHandle) {
        inputs[edge.targetHandle ?? ''] = sourceResults[edge.sourceHandle];
      }
    }

    return inputs;
  }

  private executeNode(nodeId: string): NodeInputAndOutput {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node not found: ${nodeId}`);
    }

    const inputs = this.getNodeInputs(nodeId);
    const outputs: NodeInputAndOutput = {};

    switch (node.type) {
      case 'textUpdater': {
        // Text updater has a single output with the same handle as its id
        outputs[`${node.id}`] = node.data.value;
        break;
      }

      case 'maths': {
        const a = Number(inputs.a ?? 0);
        const b = Number(inputs.b ?? 0);
        let result: number;

        switch (node.data.operation) {
          case 'add':
            result = a + b;
            break;
          case 'subtract':
            result = a - b;
            break;
          case 'multiply':
            result = a * b;
            break;
          case 'divide':
            if (b === 0) throw new Error('Division by zero');
            result = a / b;
            break;
          default:
            throw new Error(`Unknown math operation: ${node.data.operation}`);
        }

        outputs.o = result;
        break;
      }

      case 'timesTwo': {
        const input = Number(inputs['timesTwo-in'] ?? 0);
        // Output both the original value and the doubled value
        outputs['timesTwo-original'] = input;
        outputs['timesTwo-timesTwo'] = input * 2;
        break;
      }

      case 'concatenate': {
        const inputA = String(inputs['concatenate-input-a'] ?? '');
        const inputB = String(inputs['concatenate-input-b'] ?? '');
        const link = String(inputs['concatenate-link'] ?? '');

        outputs['concatenate-out'] = [inputA, inputB].join(link);
        break;
      }

      case 'log': {
        const logInput = inputs[node.id] ?? 0;
        outputs[node.id] = logInput;
        break;
      }

      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }

    this.executionResults.set(nodeId, outputs);
    return outputs;
  }

  private findStartNodes(): string[] {
    const nodesWithIncoming = new Set(this.edges.map((edge) => edge.target));
    return Array.from(this.nodes.keys()).filter(
      (nodeId) => !nodesWithIncoming.has(nodeId),
    );
  }

  private findEndNodes(): string[] {
    const nodesWithOutgoing = new Set(this.edges.map((edge) => edge.source));
    return Array.from(this.nodes.keys()).filter(
      (nodeId) => !nodesWithOutgoing.has(nodeId),
    );
  }

  private getNextNodes(nodeId: string): string[] {
    return this.edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => edge.target);
  }

  execute(): ExecutionResults {
    this.validateGraph();
    const queue: string[] = [...this.findStartNodes()];
    const visited = new Set<string>();
    const inDegree = new Map<string, number>();

    // Calculate in-degree for each node
    for (const edge of this.edges) {
      inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
    }

    // Execute nodes in BFS order
    while (queue.length > 0) {
      const currentNodeId = queue.shift();
      if (!currentNodeId || visited.has(currentNodeId)) continue;

      // Check if all inputs are ready
      const requiredInputs = inDegree.get(currentNodeId) ?? 0;
      const availableInputs = this.edges
        .filter((edge) => edge.target === currentNodeId)
        .filter((edge) => this.executionResults.has(edge.source)).length;

      if (availableInputs < requiredInputs) {
        queue.push(currentNodeId); // Put back in queue
        continue;
      }

      try {
        this.executeNode(currentNodeId);
        visited.add(currentNodeId);

        // Add next nodes to queue
        const nextNodes = this.getNextNodes(currentNodeId);
        queue.push(...nextNodes);
      } catch (err) {
        const error = err as Error;
        throw new Error(
          `Error executing node ${currentNodeId}: ${error.message}\nStack: ${error.stack}`,
        );
      }
    }

    // Identify final outputs
    const endNodes = this.findEndNodes();
    for (const nodeId of endNodes) {
      this.finalOutputs.add(nodeId);
    }

    return {
      allResults: Object.fromEntries(this.executionResults),
      finalOutputs: Object.fromEntries(
        Array.from(this.finalOutputs).map((nodeId) => [
          nodeId,
          this.executionResults.get(nodeId) ?? {},
        ]),
      ),
    };
  }

  validateGraph(): void {
    // Validate nodes and edges
    for (const edge of this.edges) {
      if (!this.nodes.has(edge.source)) {
        throw new Error(
          `Edge references non-existent source node: ${edge.source}`,
        );
      }
      if (!this.nodes.has(edge.target)) {
        throw new Error(
          `Edge references non-existent target node: ${edge.target}`,
        );
      }
      if (!edge.sourceHandle || edge.sourceHandle === '') {
        throw new Error(`Edge from ${edge.source} is missing sourceHandle`);
      }
      if (!edge.targetHandle || edge.targetHandle === '') {
        throw new Error(`Edge to ${edge.target} is missing targetHandle`);
      }
    }

    // Check for cycles
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    const hasCycle = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;

      visited.add(nodeId);
      recursionStack.add(nodeId);

      const neighbors = this.getNextNodes(nodeId);
      for (const neighbor of neighbors) {
        if (hasCycle(neighbor)) return true;
      }

      recursionStack.delete(nodeId);
      return false;
    };

    for (const nodeId of this.nodes.keys()) {
      if (hasCycle(nodeId)) {
        throw new Error(`Graph contains cycles at node: ${nodeId}`);
      }
    }
  }
}

// Helper function to create and execute a graph
export const executeGraph = (graph: FlowGraph): ExecutionResults => {
  const executor = new GraphExecutor(graph);
  return executor.execute();
};
