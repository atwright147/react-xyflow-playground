import { type Node, Position, useReactFlow } from '@xyflow/react';
import { type FC, type JSX, useCallback, useEffect, useState } from 'react';

import type { CustomNodeData } from '../../../types/nodes';
import { CustomHandle } from './CustomHandle';

import styles from './node.module.scss';

type Props = Node<CustomNodeData, 'maths'>;

export const MathsNode: FC<Props> = ({ data, id }): JSX.Element => {
  const instance = useReactFlow();
  const [value, setValue] = useState(data.value as string);

  useEffect(() => {
    if (!data.operation) {
      instance.setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                operation: 'add',
              },
            };
          }
          return node;
        }),
      );
    }
  }, [data.operation, id, instance]);

  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      setValue(evt.target.value);
      instance.setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                operation: evt.target.value,
                value: evt.target.value,
              },
            };
          }
          return node;
        }),
      );
    },
    [instance.setNodes, id],
  );

  return (
    <>
      <div className={styles.node} style={{ minWidth: '200px' }}>
        <header
          className={styles.header}
          style={{
            backgroundColor: data.headerBackground,
            color: data.headerForeground,
          }}
        >
          <h1 className={styles.heading}>{data.label}</h1>
        </header>

        <div className={styles.body}>
          <div className={styles.node}>
            <div className={styles.field}>
              <select
                aria-label={data.label}
                name="operator"
                onChange={onChange}
                value={value}
                className="nodrag"
              >
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
                <option value="multiply">Multiply</option>
                <option value="divide">Divide</option>
              </select>
            </div>
          </div>
          <div className={styles.handles}>
            <CustomHandle
              label="Value A"
              id="a"
              type="target"
              position={Position.Left}
              valueType="number"
            />
            <CustomHandle
              label="Value B"
              id="b"
              type="target"
              position={Position.Left}
              valueType="number"
            />
            <CustomHandle
              label="Output"
              id="o"
              type="source"
              position={Position.Right}
              valueType="number"
            />
          </div>
        </div>
      </div>
    </>
  );
};
