import { type Node, Position } from '@xyflow/react';
import type { FC, JSX } from 'react';

import type { CustomNodeData } from '../../../types/nodes';
import { CustomHandle } from './CustomHandle';

import styles from './node.module.scss';

type Props = Node<CustomNodeData, 'log'>;

export const LogNode: FC<Props> = ({ data, id }): JSX.Element => {
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
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  border: '1px solid black',
                  borderRadius: '5px',
                  padding: '0 5px',
                  margin: '0',
                }}
              >
                {data.value}
              </pre>
            </div>
          </div>

          <div className={styles.handles}>
            <CustomHandle
              label="In"
              id={id}
              type="target"
              position={Position.Left}
              valueType={data.valueType}
            />
            <CustomHandle
              label="Out"
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
