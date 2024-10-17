import { ReactSortable } from 'react-sortablejs'
import { IFilterSort } from '../types'

interface ContainerProps {
    filters: IFilterSort[]
    filtersIndex: number[]
    isRoot?: boolean

    setListFilters: (filtersIndex: number[], groups: IFilterSort[]) => void
    onEnd: () => void
}

export const ContainerFilters = (props: ContainerProps) => {
    return (
        <ReactSortable
            list={props.filters ?? []}
            setList={(s1, _s2, s3) => s3.dragging && props.setListFilters(props.filtersIndex, s1)}
            animation={150}
            fallbackOnBody={true}
            swapThreshold={0.25}
            ghostClass={'ghost'}
            group={'shared'}
            forceFallback={true}
            onEnd={props.onEnd}
            handle='.GroupSortHandle'
            className='flex flex-col gap-2'
        >
            {(props.filters ?? []).map((filter) => { // , index
                return (
                    <div key={filter.id} className='flex items-center gap-4 justify-between border border-slate-200 p-2 rounded'>
                        <div key={filter.id} className='flex items-center gap-4'>
                            <div>{filter.field}</div>
                        </div>
                        <div className='GroupSortHandle text-green-500 cursor-move'><i className='fa-solid fa-bars'></i></div>
                    </div>
                )
            })}
        </ReactSortable>
    )
}