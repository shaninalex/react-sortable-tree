import { useState } from 'react'
import ReactJson from 'react-json-view'

import { closestCorners, DndContext, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { IFilterGroupSort, IFilterSort } from '../typings';
import { generateFilterGroupWithIDs } from '../utils';
import { EXAMPLE_FILTER_GROUP } from '../data';
import { SortableFilterWrapper, SortableGroupWrapper } from './components'
import { addFilterToGroup, findFilterById, findGroupByFilterID, findGroupById, removeFilterById } from './utils';


export const Sortable = () => {
    const [tree, setTree] = useState<IFilterGroupSort[]>([generateFilterGroupWithIDs(EXAMPLE_FILTER_GROUP)])
    const [activeGroup, setActiveGroup] = useState<IFilterGroupSort | null>(null)
    const [activeFilter, setActiveFilter] = useState<IFilterSort | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    const handleDragStart = (event: DragStartEvent) => {
        const activeId = event.active.id as string;
        if (activeId.startsWith('filter-')) {
            // Extract actual filter id by removing 'filter-' prefix
            const filterId = activeId.replace('filter-', '');
            const filter = findFilterById(tree[0], filterId);
            if (filter) {
                setActiveGroup(null);
                setActiveFilter(filter);
            }
        } else if (activeId.startsWith('group-')) {
            // Extract actual group id by removing 'group-' prefix
            const groupId = activeId.replace('group-', '');
            const group = findGroupById(tree[0], groupId);
            if (group) {
                setActiveFilter(null);
                setActiveGroup(group);
            }
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        console.log(active, over)

        // TODO: handle drag over based on new id prefixes logic
    }

    return (
        <div className='lg:flex gap-8'>
            <div className='lg:w-1/2 flex-grow-0'>
                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver}>
                    <DragOverlay>
                        {activeFilter ? <SortableFilterWrapper filter={activeFilter} /> : null}
                        {activeGroup ? <SortableGroupWrapper id={activeGroup.id} group={activeGroup} root /> : null}
                    </DragOverlay>
                    {tree.map(group => <SortableGroupWrapper key={group.id} id={group.id} group={group} root />)}
                </DndContext>
            </div>
            <div className='lg:w-1/2 flex-grow-0'>
                <ReactJson src={tree} collapseStringsAfterLength={40} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />
            </div>
        </div>
    )
}
