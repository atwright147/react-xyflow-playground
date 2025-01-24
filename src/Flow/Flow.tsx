import { Grid, GridItem } from '@atwright147/react-layout';
import { ReactFlow, type ReactFlowInstance } from '@xyflow/react';
import clsx from 'clsx';
import type { JSX } from 'react';
import type React from 'react';
import { useCallback, useState } from 'react';
import { useShallow } from 'zustand/shallow';

import { NodeItem } from '../components/NodeItem/NodeItem';
import useFlowStore from '../stores/Flow.store';
import { nodeTypes } from './nodes/node-types';

export const Flow = (): JSX.Element => {
  const id = 'flow-droppable';
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance>();

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    isValidConnection,
    onNodeMouseEnter,
    setNodes,
    setEdges,
  } = useFlowStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      isValidConnection: state.isValidConnection,
      selectedNodeType: state.selectedNodeType,
      onNodeMouseEnter: state.onNodeMouseEnter,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
    })),
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      console.group('Saved Data');
      console.info(JSON.stringify(flow));
      console.groupEnd();
    }
  }, [rfInstance]);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const onDragStart = (event: React.DragEvent, nodeType: any): void => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDropEnd = useCallback((event: React.DragEvent): void => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent): void => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const position = {
        x:
          event.clientX -
          (event.target as HTMLElement).getBoundingClientRect().left,
        y:
          event.clientY -
          (event.target as HTMLElement).getBoundingClientRect().top,
      };

      console.info('onDrop', type, position);

      const newNode = {
        id: `${type}-${nodes.length + 1}`,
        type,
        position,
        data: { label: `${type} node` },
        // style: {
        //   // @ts-ignore
        //   backgroundColor: nodeTypes[type].backgroundColor,
        //   padding: '10px',
        // },
      };

      // @ts-ignore
      setNodes([...nodes, newNode]);
    },
    [nodes, setNodes],
  );

  return (
    <Grid
      as="section"
      gap="16px"
      gridTemplateColumns="1fr 300px"
      style={{ width: '100vw', height: '100vh' }}
    >
      <GridItem>
        <ReactFlow
          id={id}
          className={clsx('flowWrapper', 'dropTarget')}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeMouseEnter={onNodeMouseEnter}
          isValidConnection={isValidConnection}
          onDrop={onDrop}
          onDragEnd={(event) => {
            event.preventDefault();
            console.dir(event);
          }}
          onDragOver={(event) => {
            event.preventDefault();
          }} // biome-ignore lint/suspicious/noExplicitAny: just for now
          nodeTypes={nodeTypes as any}
          onInit={setRfInstance}
        />
      </GridItem>

      <GridItem>
        <section>
          <h2>Admin</h2>
          <button type="button" onClick={onSave}>Save</button>
        </section>

        <section>
          <h2>Nodes</h2>
          {Object.entries(nodeTypes).map(([name, nodeType]) => {
            const type = nodeType.displayName ?? name;
            return (
              <NodeItem
                key={name}
                name={name}
                type={type}
                onDragStart={(event: React.DragEvent) => {
                  onDragStart(event, type);
                }}
              />
            );
          })}
        </section>
      </GridItem>
    </Grid>
  );
};
Flow.displayName = 'Flow';
