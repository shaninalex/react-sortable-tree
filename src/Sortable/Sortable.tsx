import { useState } from 'react'
import ReactJson from 'react-json-view'

import { closestCorners, DndContext, DragStartEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { IFilterGroupSort } from '../typings';
import { generateFilterGroupWithIDs } from '../utils';
import { EXAMPLE_FILTER_GROUP } from '../data';
import { CSS } from '@dnd-kit/utilities';


interface SortableItemProps {
    id: string
    group: IFilterGroupSort
}

export function SortableItem(props: SortableItemProps) {
    const { group, id } = props
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    function handleDragStart(event: DragStartEvent) {
        console.log(event)
    }

    return (
        <div ref={setNodeRef} className='p-3 border rounded' style={style} {...attributes} {...listeners}>
            <div className='mb-2'>
                {props.id.split('-')[0]}
            </div>
            <div className='flex flex-col gap-2'>
                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart}>
                    <SortableContext items={group.groups} strategy={verticalListSortingStrategy}>
                        {group.groups.map(g => <SortableItem key={g.id} id={g.id} group={g} />)}
                    </SortableContext>
                </DndContext>
            </div>
        </div>
    )
}

export const Sortable = () => {
    const [tree, setTree] = useState<IFilterGroupSort[]>([generateFilterGroupWithIDs(EXAMPLE_FILTER_GROUP)])
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    function handleDragStart(event: DragStartEvent) {
        const { active } = event
        const { id } = active
        console.log(event)
        setActiveId(id)
    }

    return (
        <div className='lg:flex gap-8'>
            <div className='lg:w-1/2 flex-grow-0'>
                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart}>
                    <SortableContext items={tree} strategy={verticalListSortingStrategy}>
                        {tree.map(group => <SortableItem key={group.id} id={group.id} group={group} />)}
                    </SortableContext>
                </DndContext>
            </div>
            <div className='lg:w-1/2 flex-grow-0'>
                <ReactJson src={tree} collapseStringsAfterLength={40} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />
            </div>
        </div>
    )
}
