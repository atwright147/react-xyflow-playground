import { type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { type FC, useCallback, useEffect, useState } from 'react';

import type { Data } from '../Flow';
import { CustomHandle } from './CustomHandle';
import styles from './node.module.scss';

export const LogNode: FC<NodeProps<Data>> = (props): JSX.Element => {
  const instance = useReactFlow();
  const [value, setValue] = useState(props.data.value as string);

  useEffect(() => {
    setValue(props.data.value);
    instance.setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              value: props.data.value,
            },
          };
        }
        return node;
      }),
    );
  }, [instance.setNodes, props.id, props.data.value]);

  return (
    <>
      <div className={styles.node} style={{ minWidth: '200px' }}>
        <header
          className={styles.header}
          style={{
            backgroundColor: props.data.headerBackground,
            color: props.data.headerForeground,
          }}
        >
          <h1 className={styles.heading}>{props.data.label}</h1>
        </header>

        <div className={styles.body}>
          <div className={styles.node}>
            <div className={styles.field}>
              <pre style={{ whiteSpace: 'pre-wrap', border: '1px solid black', borderRadius: '5px', padding: '0 5px', margin: '0' }}>
                {value}
              </pre>
            </div>
          </div>

          <div className={styles.handles}>
            <CustomHandle label="In" id={props.id} type="target" position={Position.Left} valueType={props.data.valueType} />
            <CustomHandle label="Out" id={props.id} type="source" position={Position.Right} valueType={props.data.valueType} />
          </div>
        </div>
      </div>
    </>
  );
};
