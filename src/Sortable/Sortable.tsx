import { useState } from 'react'
import ReactJson from 'react-json-view'

import { CSS } from '@dnd-kit/utilities'
import { closestCorners, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { IFilter, IFilterGroupSort, IFilterSort } from '../typings';
import { generateFilterGroupWithIDs } from '../utils';
import { EXAMPLE_FILTER_GROUP } from '../data';
import _, { filter, find } from 'lodash';


interface SortableFilterWrapperProps {
    filter: IFilterSort
}
export const SortableFilterWrapper = (props: SortableFilterWrapperProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: props.filter.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    };

    const { filter } = props;
    if (!filter) return null
    return (
        <div className='p-3 border rounded bg-white' ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div className='mb-2'>
                {filter.field}: {filter.id.split('-')[0]}
            </div>
        </div>
    )
}

interface SortableGroupWrapperProps {
    id: string
    group: IFilterGroupSort
}
export const SortableGroupWrapper = (props: SortableGroupWrapperProps) => {
    const { group, id } = props;

    // 
    return (
        <div className='p-3 border rounded border-slate-800'>
            <div className='mb-2'>Group: {id.split('-')[0]}</div>
            <div className='p-2 rounded border bg-blue-100 flex flex-col gap-2 mb-2'>
                <SortableContext items={group.filters} strategy={verticalListSortingStrategy}>
                    {group.filters.map(f => <SortableFilterWrapper key={f.id} filter={f} />)}
                </SortableContext>
            </div>
            <div className='p-2 rounded border  bg-green-100 flex flex-col gap-2'>
                {group.groups.map(group => <SortableGroupWrapper key={group.id} id={group.id} group={group} />)}
            </div>
        </div>
    )
}

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
        const filter = findFilterById(tree[0], event.active.id as string)
        if (!filter) return
        setActiveFilter(filter)
    }

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over || !activeFilter) return;
        const overContainer = findGroupByFilterID(tree[0], over.id as string)
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
    }

    const handleDragEnd = (event: DragEndEvent) => {
        // console.log("End: ", event);
    }

    return (
        <div className='lg:flex gap-8'>
            <div className='lg:w-1/2 flex-grow-0'>
                <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
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

function findGroupByFilterID(tree: IFilterGroupSort, filterId: string): IFilterGroupSort | null {
    const filter = _.find(tree.filters, { id: filterId });
    if (filter) return tree

    if (tree.groups && tree.groups.length > 0) {
        for (const group of tree.groups) {
            const filter = findGroupByFilterID(group, filterId)
            if (filter) {
                return group
            }
        }
    }
    return null
}


function findFilterById(tree: IFilterGroupSort, targetId: string): IFilterSort | null {
    const filter = _.find(tree.filters, { id: targetId });
    if (filter) return filter
    if (tree.groups && tree.groups.length > 0) {
        for (const group of tree.groups) {
            const result = findFilterById(group, targetId)
            if (result) {
                return result
            }
        }
    }
    return null;
}

function removeFilterById(tree: IFilterGroupSort[], targetId: string): IFilterSort | null {
    for (const group of tree) {
        const filterIndex = group.filters.findIndex(f => f.id === targetId);
        if (filterIndex !== -1) {
            return group.filters.splice(filterIndex, 1)[0];
        }
        const result = removeFilterById(group.groups, targetId);
        if (result) return result;
    }
    return null;
}

function addFilterToGroup(tree: IFilterGroupSort[], targetId: string, filterToAdd: IFilterSort) {
    for (const group of tree) {
        if (group.id === targetId) {
            group.filters.push(filterToAdd)
            return true
        }
        const result = addFilterToGroup(group.groups, targetId, filterToAdd);
        if (result) return true;
    }
    return false;
}


function removeGroupById(tree: IFilterGroupSort[], targetId: string): IFilterGroupSort | null {
    for (const group of tree) {
        const index = group.groups.findIndex(g => g.id === targetId);
        if (index !== -1) {
            return group.groups.splice(index, 1)[0];
        }
        const result = removeGroupById(group.groups, targetId);
        if (result) return result;
    }
    return null;
}

function addGroupToTarget(tree: IFilterGroupSort[], targetId: string, groupToAdd: IFilterGroupSort) {
    for (const group of tree) {
        if (group.id === targetId) {
            group.groups.push(groupToAdd);
            return true;
        }
        const result = addGroupToTarget(group.groups, targetId, groupToAdd);
        if (result) return true;
    }
    return false;
}
