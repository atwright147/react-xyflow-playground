const processGraph = (nodes: GraphNode[], edges: Edge[]): Map<string, string | number> => {
  const nodeMap = new Map<string, GraphNode>(); // Map node id to the actual node
  const inDegree = new Map<string, number>(); // Map to track incoming edges for each node
  const adjacencyList = new Map<string, string[]>(); // Map node id to its dependencies (adjacent nodes)
  const nodeValues = new Map<string, string | number>(); // Store computed values of nodes

  // Initialize nodeMap and inDegree count for each node
  for (const node of nodes) {
    nodeMap.set(node.id, node);
    inDegree.set(node.id, 0); // Start with zero incoming edges
  }

  // Build the graph (adjacency list) and count incoming edges
  for (const edge of edges) {
    const source = edge.source; // From node (provides input)
    const target = edge.target; // To node (depends on input)

    if (!adjacencyList.has(target)) {
      adjacencyList.set(target, []);
    }
    adjacencyList.get(target)!.push(source); // Add source to target's list (dependency)

    // Increment in-degree count for target node
    inDegree.set(target, (inDegree.get(target) || 0) + 1);
  }

  // Queue for BFS and initialize with nodes having no incoming edges (in-degree 0)
  const queue: string[] = [];
  for (const node of nodes) {
    if (inDegree.get(node.id) === 0) {
      queue.push(node.id);

      // For textUpdater or maths nodes with preset values, we set the initial value
      if (node.type === 'textUpdater' || node.type === 'maths') {
        nodeValues.set(node.id, Number(node.data.value) || 0);
      }
    }
  }

  // Perform BFS traversal
  while (queue.length > 0) {
    const nodeId = queue.shift()!;
    const currentNode = nodeMap.get(nodeId)!;

    switch (currentNode.type) {
      case 'concatenate': {
        // Get input values from the dependencies (source nodes)
        const inputValues = (adjacencyList.get(nodeId) || []).map((inputNodeId) => nodeValues.get(inputNodeId)!);
        // Concatenate input values if they are strings or numbers
        const result = inputValues.join(' ');
        nodeValues.set(currentNode.id, result); // Store the concatenated result
        break;
      }
      case 'maths': {
        // For maths nodes, process value
        const mathsInputValues = (adjacencyList.get(nodeId) || []).map((inputNodeId) => nodeValues.get(inputNodeId)!);
        console.info(nodeId, mathsInputValues); // Debugging log
        const mathsResult = mathsInputValues.reduce((acc: number, val) => acc + Number(val), 0); // Example: sum the values
        nodeValues.set(currentNode.id, mathsResult); // Store the sum result
        break;
      }
    }

    // Process adjacent nodes
    for (const adjacentNodeId of adjacencyList.get(nodeId) || []) {
      // Decrease the in-degree of adjacent nodes
      const inDegreeCount = (inDegree.get(adjacentNodeId) || 0) - 1;
      inDegree.set(adjacentNodeId, inDegreeCount);

      // If the in-degree is 0, add it to the queue
      if (inDegreeCount === 0) {
        queue.push(adjacentNodeId);
      }
    }
  }

  // Return a map of node ids to their computed values
  return nodeValues;
};
