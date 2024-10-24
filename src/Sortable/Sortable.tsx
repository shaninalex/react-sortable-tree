import { useState } from 'react'
import ReactJson from 'react-json-view'

import { closestCorners, DndContext, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { IFilterGroupSort, IFilterSort } from '../typings';
import { generateFilterGroupWithIDs } from '../utils';
import { EXAMPLE_FILTER_GROUP } from '../data';
import { SortableFilterWrapper, SortableGroupWrapper } from './components'
import { extractPrefixAndUUID, findFilterById, findGroupById } from './utils';


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
        if (!active || !over) return

        // active.id and over.id have prefixes - "filter-", "filters-", "group-", "groups-"
        // extract both prefixes and both uuids
        const [overPrefix, overID] = extractPrefixAndUUID(over.id as string)
        const [activePrefix, activeID] = extractPrefixAndUUID(active.id as string)
        
        // TODO: get active parent group, and over parent group
        // It will help us understand exectly what and where we moving

        // There are collition logic:
        // #1
        // if group && group -- moving groups in same container ( also see #3 )
        if (activePrefix === 'group' && overPrefix === 'group') {
            console.log(activePrefix, activeID, '  -  ', overPrefix, overID)
        }

        // #2
        // if group && groups -- inserting group into new container
        if (activePrefix === 'group' && overPrefix === 'groups') {
            console.log(activePrefix, activeID, '  -  ', overPrefix, overID)
        }

        // #3
        // if filter && filter -- moving filter in same container
        // Need additionaly check if they are in same container.
        // if filterA and filterB have different parents it meens you move filterA to another group and now hovering around filterB from that group.
        if (activePrefix === 'filter' && overPrefix === 'filter') {
            console.log(activePrefix, activeID, '  -  ', overPrefix, overID)
        }

        // #4
        // if filter && filters -- inserting filter into new container ( NOTE: this condition is never heppends )

        // TODO: also need to check and properly handle situation on moving groups/filters into empty list of groups or filters

        // all other collitions is not interesting. Because we can't insert filter in group or groups. And vice versa...
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
