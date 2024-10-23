import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { IFilterGroupSort } from "../../typings";
import { SortableFilterWrapper } from "./SortableFilterWrapper";

interface SortableGroupWrapperProps {
    id: string
    group: IFilterGroupSort
}
export const SortableGroupWrapper = (props: SortableGroupWrapperProps) => {
    const { group, id } = props;

    // 
    return (
        <div className='p-3 border rounded border-slate-800 mb-2'>
            <div className='mb-2'>Group: {id.split('-')[0]}</div>
            <div className='p-2 rounded border bg-blue-100 mb-2'>
                <SortableContext items={group.filters} strategy={verticalListSortingStrategy}>
                    {group.filters.map(f => <SortableFilterWrapper key={f.id} filter={f} />)}
                </SortableContext>
            </div>
            <div className='p-2 rounded border bg-green-100'>
                {group.groups.map(group => <SortableGroupWrapper key={group.id} id={group.id} group={group} />)}
            </div>
        </div>
    )
}