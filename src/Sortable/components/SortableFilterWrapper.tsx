import { CSS } from '@dnd-kit/utilities'
import { useSortable } from "@dnd-kit/sortable";
import { IFilterSort } from "../../typings";

interface SortableFilterWrapperProps {
    filter: IFilterSort
}
export const SortableFilterWrapper = (props: SortableFilterWrapperProps) => {
    const { filter } = props;
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: `filter-${props.filter.id}` });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1 : 'auto',
    };
    return (
        <div className='p-3 border rounded bg-white mb-2' ref={setNodeRef} style={style}>
            <div className='flex items-center justify-between'>
                <div>{filter.field}: {filter.id.split('-')[0]}</div>
                <button className='border rounded px-2' {...attributes} {...listeners}><i className="fa-solid fa-grip-vertical"></i></button>
            </div>
        </div>
    )
}