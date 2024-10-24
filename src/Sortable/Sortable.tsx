import { useState } from 'react'
import ReactJson from 'react-json-view'

import { closestCorners, DndContext, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { IFilterGroupSort, IFilterSort } from '../typings';
import { generateFilterGroupWithIDs } from '../utils';
import { EXAMPLE_FILTER_GROUP } from '../data';
import { SortableFilterWrapper, SortableGroupWrapper } from './components'
import { addFilterToGroup, addGroupToGroup, extractPrefixAndUUID, findFilterById, findGroupByFilterID, findGroupById, findParentGroupById, removeFilterById, swapGroupsInParent } from './utils';
import _ from 'lodash';


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
        const { active, over, delta } = event;
        if (!active || !over) return

        // active.id and over.id have prefixes - "filter-", "filters-", "group-", "groups-"
        // extract both prefixes and both uuids
        const [activePrefix, activeID] = extractPrefixAndUUID(active.id as string)
        const [overPrefix, overID] = extractPrefixAndUUID(over.id as string)
        // console.log(activePrefix, activeID, overPrefix, overID)

        // TODO: get active parent group, and over parent group
        // It will help us understand exectly what and where we moving

        // There are collition logic:
        // #1
        // if group && group -- moving groups between each other.
        // Same condition happend when moving one group from another paretn around another grourp from another parent
        if (activePrefix === 'group' && overPrefix === 'group') {
            const activeParentGroup = findParentGroupById(tree[0], activeID);
            const overParentGroup = findParentGroupById(tree[0], overID);
            if (activeParentGroup && overParentGroup) {
                // swap up with prev group
                if (overParentGroup.id === activeParentGroup.id && delta.y < 0) { // move up
                    setTree((prevTree) => swapGroupsInParent([...prevTree], overParentGroup.id, activeID, overID));
                }
                // swap down with next group
                if (overParentGroup.id === activeParentGroup.id && delta.y > 0) { // move down
                    setTree((prevTree) => swapGroupsInParent([...prevTree], overParentGroup.id, overID, activeID));
                }
                // move up from current group
                if (overParentGroup.id !== activeParentGroup.id) {
                    setTree((prevTree) => {
                        const newTree = [...prevTree];
                        const activeParent = findGroupById(newTree[0], activeParentGroup.id);
                        let activeGroup = null;
                        if (activeParent) {
                            activeGroup = activeParent.groups.find(g => g.id === activeID);
                            activeParent.groups = activeParent.groups.filter(g => g.id !== activeID);
                        }
                        const overParent = findGroupById(newTree[0], overParentGroup.id);
                        if (overParent && activeGroup) {
                            overParent.groups.push(activeGroup);
                        }
                        return newTree;
                    });
                }
            }
        }

        // TODO: delete this condition
        // #2
        // if group && groups -- inserting group into new container
        if (activePrefix === 'group' && overPrefix === 'groups') {
            // console.log(activePrefix, activeID, '  -  ', overPrefix, overID)
        }

        // #3
        // if filter && filter -- moving filter in same container
        // if filter && filters-- inserting filter into empty container
        // Need additionaly check if they are in same container.
        // if filterA and filterB have different parents it meens you move filterA to another group and now hovering around filterB from that group.
        if ((activePrefix === 'filter' && overPrefix === 'filter') || (activePrefix === 'filter' && overPrefix === 'filters')) {
            const activeGroup = findGroupByFilterID(tree[0], activeID)
            let overGroup = findGroupByFilterID(tree[0], overID)
            if (!overGroup) {
                overGroup = findGroupById(tree[0], overID)
            }
            if (activeGroup && overGroup) {
                setTree((prevTree) => {
                    const filterToMove = removeFilterById(prevTree, activeID);
                    if (!filterToMove) return prevTree;
                    addFilterToGroup(prevTree, overGroup.id, filterToMove);
                    return [...prevTree];
                });
            }
        }
        // TODO: also need to check and properly handle situation on moving groups into empty list of groups
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
