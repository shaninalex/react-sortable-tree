import { IFilterGroup, IFilter } from '../../typings'
import { Container } from './Container'
import { ContainerFilters } from './ContainerFilters'
import { v4 as uuid } from "uuid"

interface WrapperProps {
    group: IFilterGroup
    groupsIndex: number[]
    setList: (groupsIndex: number[], groups: IFilterGroup[]) => void
    setListFilters: (filtersIndex: number[], filters: IFilter[]) => void
    onEnd: () => void
    isRoot?: boolean
}

export const Wrapper = (props: WrapperProps) => {
    const id = uuid()
    return (
        <div className='relative text-sm bg-gray-300 bg-opacity-35 p-2 mt-2 border border-slate-400 rounded select-none'>
            <div className='flex items-center justify-between'>
                <div className='font-bold text-slate-500'>
                    Group {id}
                </div>
                <div className='GroupSortHandle text-violet-500 cursor-move'><i className='fa-solid fa-bars'></i></div>
            </div>
            {props.group.filters.length ? (
                <div className='bg-white p-2 mt-2 border rounded select-none'>
                    <ContainerFilters key={id} filters={props.group.filters} filtersIndex={props.groupsIndex} setListFilters={props.setListFilters}
                        onEnd={props.onEnd} />
                </div>
            ) : null}
            <Container key={id} {...props} />
        </div>
    )
}
