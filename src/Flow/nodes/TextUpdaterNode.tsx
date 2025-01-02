import { type Node, Position, useReactFlow } from '@xyflow/react';
import { type FC, useCallback, useState } from 'react';

import type { CustomNodeData } from '../Flow';
import { CustomHandle } from './CustomHandle';
import styles from './node.module.scss';

type Props = Node<CustomNodeData, 'textUpdater'>;

export const TextUpdaterNode: FC<Props> = ({ data, id }): JSX.Element => {
  const instance = useReactFlow();
  const [value, setValue] = useState(data.value as string);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value);
      instance.setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                value: event.target.value,
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
              <input
                aria-label={data.label}
                name="text"
                onChange={onChange}
                value={value}
                className="nodrag"
              />
            </div>
          </div>
          <div className={styles.handles}>
            <CustomHandle
              label={data.label}
              id={id}
              type="source"
              position={Position.Right}
              valueType={data.valueType}
            />
          </div>
        </div>
      </div>
    </>
  );
};
