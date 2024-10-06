import { type NodeProps, Position, useReactFlow } from '@xyflow/react';
import { type FC, useCallback, useState } from 'react';
import type { Data } from '../Flow';
import { CustomHandle } from './CustomHandle';

import styles from './node.module.scss';

export const MathsNode: FC<NodeProps<Data>> = (props): JSX.Element => {
  const instance = useReactFlow();
  const [value, setValue] = useState(props.data.value as string);

  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      setValue(evt.target.value);
      instance.setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === props.id) {
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
    [instance.setNodes, props.id],
  );

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
              <select aria-label={props.data.label} name="operator" onChange={onChange} value={value} className="nodrag">
                <option value="add">Add</option>
                <option value="subtract">Subtract</option>
                <option value="multiply">Multiply</option>
                <option value="divide">Divide</option>
              </select>
            </div>
          </div>
          <div className={styles.handles}>
            <CustomHandle label="Value A" id="a" type="target" position={Position.Left} valueType="number" />
            <CustomHandle label="Value B" id="b" type="target" position={Position.Left} valueType="number" />
            <CustomHandle label="Output" id="o" type="source" position={Position.Right} valueType="number" />
          </div>
        </div>
      </div>
    </>
  );
};
