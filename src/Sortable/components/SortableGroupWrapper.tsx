import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { IFilterGroupSort } from "../../typings";
import { SortableFilterWrapper } from "./SortableFilterWrapper";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities'

interface SortableGroupWrapperProps {
    id: string
    group: IFilterGroupSort
}
export const SortableGroupWrapper = (props: SortableGroupWrapperProps) => {
    const { group, id } = props;

    // Sortable setup
    const sortHook = useSortable({ id });
    const sortTransition = sortHook.transition
    const groupSortstyle = {
        transform: CSS.Transform.toString(sortHook.transform),
        sortTransition,
        opacity: sortHook.isDragging ? 0.5 : 1,
        zIndex: sortHook.isDragging ? 1 : 'auto',
    };

    // Droppable setup
    const dropHook = useDroppable({ id });
    const filterDropstyle = { backgroundColor: dropHook.isOver ? 'lightgreen' : 'white', border: '1px dashed lightgray' };

    return (
        <div ref={sortHook.setNodeRef} style={groupSortstyle}
            className='p-3 border rounded border-slate-800 mb-2'>
            <div className='flex items-center justify-between mb-2'>
                <div>Group: {id.split('-')[0]}</div>
                <button className='border rounded px-2' {...sortHook.attributes} {...sortHook.listeners}><i className="fa-solid fa-grip-vertical"></i></button>
            </div>

            {/* Droppable Area for Filters */}
            <div ref={dropHook.setNodeRef}
                className='p-2 rounded border bg-blue-100 mb-2'
                style={group.filters.length === 0 ? filterDropstyle : {}}>
                <SortableContext items={group.filters} strategy={verticalListSortingStrategy}>
                    {group.filters.length > 0 ? (
                        group.filters.map(f => <SortableFilterWrapper key={f.id} filter={f} />)
                    ) : (
                        <div className="text-center text-gray-500">Drop filter here</div>
                    )}
                </SortableContext>
            </div>

            {/* Droppable Area for Groups */}
            <div className='p-2 rounded border bg-green-100'>
                {group.groups.map(group => (
                    <SortableGroupWrapper key={group.id} id={group.id} group={group} />
                ))}
            </div>
        </div>
    );
}