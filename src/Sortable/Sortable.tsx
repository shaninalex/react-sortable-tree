import { useState } from 'react'
import ReactJson from 'react-json-view'

import { closestCorners, DndContext, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { IFilterGroupSort, IFilterSort } from '../typings';
import { generateFilterGroupWithIDs } from '../utils';
import { EXAMPLE_FILTER_GROUP } from '../data';
import { SortableFilterWrapper, SortableGroupWrapper } from './components'
import { addFilterToGroup, findFilterById, findGroupByFilterID, findGroupById, findItemById, removeFilterById } from './utils';


export const Sortable = () => {
    const [tree, setTree] = useState<IFilterGroupSort[]>([generateFilterGroupWithIDs(EXAMPLE_FILTER_GROUP)])
    // const [activeGroup, setActiveGroup] = useState<IFilterGroupSort | null>(null)
    const [activeFilter, setActiveFilter] = useState<IFilterSort | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        const filter = findFilterById(tree[0], event.active.id as string)
        if (!filter) return
        setActiveFilter(filter)
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over || !activeFilter) return;
        let overContainer = findGroupByFilterID(tree[0], over.id as string)
        if (!overContainer) {
            console.log(over)
            const group = findGroupById(tree[0], over.id as string)
            if (group) overContainer = group
        }
        const activeContainer = findGroupByFilterID(tree[0], active.id as string)
        if (overContainer && activeContainer) {
            if (activeContainer.id !== overContainer.id) {
                setTree((prevTree) => {
                    const filterToMove = removeFilterById(prevTree, activeFilter.id);
                    if (!filterToMove) return prevTree;

                    addFilterToGroup(prevTree, overContainer.id, filterToMove);
                    return [...prevTree];
                });
            }
        }
        if (activeContainer && overContainer && activeContainer.id === overContainer.id) {
            setTree((prevTree) => {
                const activeIndex = activeContainer.filters.findIndex(f => f.id === active.id);
                const overIndex = overContainer.filters.findIndex(f => f.id === over.id);

                if (activeIndex !== -1 && overIndex !== -1) {
                    const [movedFilter] = activeContainer.filters.splice(activeIndex, 1);
                    activeContainer.filters.splice(overIndex, 0, movedFilter);
                }

                return [...prevTree];
            });
        }
    }

    // const handleDragEnd = (event: DragEndEvent) => {}

    return (
        <div className='lg:flex gap-8'>
            <div className='lg:w-1/2 flex-grow-0'>
                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver}> {/* onDragEnd={handleDragEnd} */}
                    <DragOverlay>
                        {activeFilter ? <SortableFilterWrapper filter={activeFilter} /> : null}
                        {/* activeGroup */}
                    </DragOverlay>
                    {tree.map(group => <SortableGroupWrapper key={group.id} id={group.id} group={group} />)}
                </DndContext>
            </div>
            <div className='lg:w-1/2 flex-grow-0'>
                <ReactJson src={tree} collapseStringsAfterLength={40} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />
            </div>
        </div>
    )
}
