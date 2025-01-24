import { type Node, Position } from '@xyflow/react';
import type { FC, JSX } from 'react';

import type { CustomNodeData } from '../../../types/nodes';
import { CustomHandle } from './CustomHandle';
import styles from './node.module.scss';

type Props = Node<CustomNodeData, 'timesTwo'>;

const defaultData: CustomNodeData = {
  label: 'Times Two',
  headerBackground: 'blue',
  headerForeground: 'white',
};

export const TimesTwoNode: FC<Props> = ({ data }): JSX.Element => {
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
              label="In"
              id={'timesTwo-in'}
              type="target"
              position={Position.Left}
              valueType={data.valueType}
            />
            <CustomHandle
              label="Original"
              id={'timesTwo-original'}
              type="source"
              position={Position.Right}
              valueType={data.valueType}
            />
            <CustomHandle
              label="TimesTwo"
              id={'timesTwo-timesTwo'}
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
