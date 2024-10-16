import React, { ReactNode } from 'react';
import {CSS} from '@dnd-kit/utilities';
import { useDraggable } from '@dnd-kit/core';

interface DraggableProps {
    id: string
    children: ReactNode;
}

export const Draggable = (props: DraggableProps) => {
    const { children, id } = props;
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
    });

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
    } : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
}