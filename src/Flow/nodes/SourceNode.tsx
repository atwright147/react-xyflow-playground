import { type Node, NodeResizer, Position } from '@xyflow/react';
import type { FC, JSX } from 'react';

import type { CustomNodeData } from '../../../types/nodes';
import { CustomHandle } from './CustomHandle';

import styles from './node.module.scss';

type Props = Node<CustomNodeData, 'source'>;

export const SourceNode: FC<Props> = ({ data }): JSX.Element => {
  return (
    <>
      {data.resizable && <NodeResizer minWidth={200} />}

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
          <div className={styles.handles}>
            {data.handles?.map((handle) => (
              <CustomHandle
                key={handle.id}
                label={handle.label}
                id={handle.id}
                type={handle.type}
                position={
                  handle.type === 'source' ? Position.Right : Position.Left
                }
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
