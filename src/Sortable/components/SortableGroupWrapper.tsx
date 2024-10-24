import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { IFilterGroupSort } from "../../typings";
import { SortableFilterWrapper } from "./SortableFilterWrapper";
import { useDroppable } from "@dnd-kit/core";

interface SortableGroupWrapperProps {
    id: string
    group: IFilterGroupSort
}
export const SortableGroupWrapper = (props: SortableGroupWrapperProps) => {
    const { group, id } = props;

    // Droppable setup
    const { isOver, setNodeRef } = useDroppable({
        id: id,
    });

    const style = {
        backgroundColor: isOver ? 'lightgreen' : 'white',
        border: '1px dashed lightgray',
    };

    return (
        <div className='p-3 border rounded border-slate-800 mb-2'>
            <div className='mb-2'>Group: {id.split('-')[0]}</div>

            {/* Droppable Area for Filters */}
            <div
                ref={setNodeRef}
                className='p-2 rounded border bg-blue-100 mb-2'
                style={group.filters.length === 0 ? style : {}}
            >
                <SortableContext items={group.filters} strategy={verticalListSortingStrategy}>
                    {group.filters.length > 0 ? (
                        group.filters.map(f => <SortableFilterWrapper key={f.id} filter={f} />)
                    ) : (
                        <div className="text-center text-gray-500">Drop filter here</div>
                    )}
                </SortableContext>
            </div>

            {/* Nested Groups */}
            <div className='p-2 rounded border bg-green-100'>
                {group.groups.map(group => (
                    <SortableGroupWrapper key={group.id} id={group.id} group={group} />
                ))}
            </div>
        </div>
    );
}