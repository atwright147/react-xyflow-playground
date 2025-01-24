import type { JSX } from 'react';

export const NodeItem = ({
  name,
  type,
  onDragStart,
}: {
  name: string;
  type: string;
  onDragStart: (event: React.DragEvent) => void;
}): JSX.Element => {
  const id = `${name}-${type}`;

  return (
    <div key={id}>
      <div className="nodeItem" draggable onDragStart={onDragStart}>
        {type.charAt(0).toUpperCase() + type.slice(1)} Node
      </div>
    </div>
  );
};
