import React, { ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableProps {
    id: string
    children: ReactNode
}

export const Droppable = (props: DroppableProps) => {
    const { children, id } = props;
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    const style = {
        backgroundColor: isOver ? 'rgba(144, 238, 144, 0.5)' : undefined,
        borderColor: isOver ? 'rgba(144, 238, 144, 1)' : undefined,
    };

    return (
        <div className="border p-4" ref={setNodeRef} style={{ ...style }}>
            {children}
        </div>
    );
}