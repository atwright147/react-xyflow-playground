import type { DragEndEvent } from '@dnd-kit/core';

interface DroppedCoords {
  x: number;
  y: number;
}

const defaultCoords = { x: 0, y: 0 };

export const getDropCoords = (
  dragEndEvent: DragEndEvent,
  dropTarget: HTMLElement,
): DroppedCoords => {
  // Get coordinates from dnd-kit's event
  const { delta } = dragEndEvent;

  // Get the droppable's rect
  const dropRect = dropTarget.getBoundingClientRect();

  // Get the draggable element
  const draggableElement = dragEndEvent.activatorEvent.target;

  if (!draggableElement) {
    return defaultCoords;
  }

  const dragRect = (draggableElement as HTMLElement).getBoundingClientRect();

  // Calculate relative position considering the delta from the drag
  const relativeX = dragRect.left - dropRect.left + delta.x;
  const relativeY = dragRect.top - dropRect.top + delta.y;

  // Return position as percentages
  return {
    x: (relativeX / dropRect.width) * 100,
    y: (relativeY / dropRect.height) * 100,
  };
};
