import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { IFilterGroupSort } from "../../typings";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities'

interface SortableGroupWrapperProps {
    id: string
    group: IFilterGroupSort
    root?: boolean
}
export const SortableGroupWrapper = (props: SortableGroupWrapperProps) => {
    const { group, id } = props;

    // Sortable setup
    const sortHook = useSortable({ id: `group-${id}` });
    const sortTransition = sortHook.transition;
    const groupSortstyle = {
        transform: CSS.Transform.toString(sortHook.transform),
        transition: sortTransition,
        opacity: sortHook.isDragging ? 0.5 : 1,
        zIndex: sortHook.isDragging ? 1 : 'auto',
    };

    // Droppable setup for filters
    // const dropHook = useDroppable({ id: `filters-${id}` });
    // const filterDropstyle = { backgroundColor: dropHook.isOver ? 'lightgreen' : 'white', border: '1px dashed lightgray' };

    // Droppable setup for groups
    const groupDropHook = useDroppable({ id: `groups-${id}` });
    const groupDropStyle = { backgroundColor: groupDropHook.isOver ? 'lightblue' : 'lightgreen', border: '1px dashed lightgray' };

    return (
        <div ref={sortHook.setNodeRef} style={groupSortstyle}
            className='p-3 border rounded border-slate-800 mb-2'>
            <div className='flex items-center justify-between mb-2'>
                <div>Group: {id.split('-')[0]}</div>
                {!props.root ? (<button className='border rounded px-2' {...sortHook.attributes} {...sortHook.listeners}><i className="fa-solid fa-grip-vertical"></i></button>) : null}
            </div>

            {/* Droppable Area for Filters */}
            {/* TEMPORARY REMOVE FILTERS */}
            {/* <div ref={dropHook.setNodeRef}
                className='p-2 rounded border bg-blue-100 mb-2'
                style={group.filters.length === 0 ? filterDropstyle : {}}>
                <SortableContext items={group.filters.length > 0 ? group.filters.map(f => f.id) : []} strategy={verticalListSortingStrategy}>
                    {group.filters.length > 0 ? (
                        group.filters.map(f => <SortableFilterWrapper key={f.id} filter={f} />)
                    ) : (
                        <div className="text-center text-gray-500">Drop filter here</div>
                    )}
                </SortableContext>
            </div> */}

            {/* Droppable Area for Groups */}
            <div ref={groupDropHook.setNodeRef} className='p-2 rounded border bg-green-100' style={group.groups.length === 0 ? groupDropStyle : {}}>
                <SortableContext items={group.groups.length > 0 ? group.groups.map(f => f.id) : []} strategy={verticalListSortingStrategy}>
                    {group.groups.length > 0 ? (
                        group.groups.map(g => (
                            <SortableGroupWrapper key={g.id} id={g.id} group={g} />
                        ))
                    ) : (
                        <div className="text-center text-gray-500">Drop group here</div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
}
