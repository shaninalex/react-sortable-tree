import { useState } from 'react'
import ReactJson from 'react-json-view'

import { CSS } from '@dnd-kit/utilities'
import { closestCorners, DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { IFilterGroupSort, IFilterSort } from '../typings';
import { generateFilterGroupWithIDs } from '../utils';
import { EXAMPLE_FILTER_GROUP } from '../data';
import _, { find } from 'lodash';


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
                Filter: {filter.id.split('-')[0]}
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
        console.log(filter)
        if (!filter) return
        setActiveFilter(filter)
    }

    const handleDragOver = (event: DragOverEvent) => {
        // console.log(event);
    }

    const handleDragEnd = (event: DragEndEvent) => {
        // console.log(event);
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



function findFilterById(tree: IFilterGroupSort, targetId: string): IFilterSort | null {
    const filter = _.find(tree.filters, { id: targetId });
    if (filter) return filter
    if (tree.groups && tree.groups.length > 0) {
        for (const group of tree.groups) {
            const result = findFilterById(group, targetId);
            if (result) {
                return result;
            }
        }
    }
    return null;
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
