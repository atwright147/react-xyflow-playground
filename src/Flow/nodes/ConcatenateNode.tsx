import { type Node, Position } from '@xyflow/react';
import type { FC, JSX } from 'react';

import type { CustomNodeData } from '../../../types/nodes';
import { CustomHandle } from './CustomHandle';
import styles from './node.module.scss';

type Props = Node<CustomNodeData, 'concatenate'>;

const defaultData: CustomNodeData = {
  label: 'Concatenate',
  headerBackground: 'blue',
  headerForeground: 'white',
};

export const ConcatenateNode: FC<Props> = ({ data }): JSX.Element => {
  data = { ...defaultData, ...data };

  return (
    <>
      <div className={styles.node} style={{ minWidth: '200px' }}>
        <header
          className={styles.header}
          style={{
            backgroundColor: String(data.headerBackground),
            color: String(data.headerForeground),
          }}
        >
          <h1 className={styles.heading}>{data.label}</h1>
        </header>

        <div className={styles.body}>
          <div className={styles.handles}>
            <CustomHandle
              label="String A"
              id={'concatenate-input-a'}
              type="target"
              position={Position.Left}
              valueType={data.valueType}
            />
            <CustomHandle
              label="String B"
              id={'concatenate-input-b'}
              type="target"
              position={Position.Left}
              valueType={data.valueType}
            />
            <CustomHandle
              label="Link"
              id={'concatenate-link'}
              type="target"
              position={Position.Left}
              valueType={data.valueType}
            />
            <CustomHandle
              label="Link"
              id={'concatenate-out'}
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
