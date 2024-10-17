import { useEffect, useState } from 'react'
import ReactJson from 'react-json-view'

import { FiltersTree } from './components'
import { IFilterGroupSort } from './types'
import { EXAMPLE_FILTER_GROUP } from '../data'
import { convertToFilterGroup, generateFilterGroupWithIDs } from './utils'
import { IFilterGroup } from '../typings'


export const Sortable = () => {
    const [filters, setGroups] = useState<IFilterGroupSort[]>([generateFilterGroupWithIDs(EXAMPLE_FILTER_GROUP)])
    const [clearFilters, setClearFilters] = useState<IFilterGroup[]>([])
    useEffect(() => {
        setClearFilters([convertToFilterGroup(filters[0])])
    }, [filters])

    return (
        <div className='lg:flex gap-8'>
            <div className='lg:w-1/2 flex-grow-0'>
                <FiltersTree groups={filters} onChange={setGroups} />
            </div>
            <div className='lg:w-1/2 flex-grow-0'>
                <h1 className='font-bold text-3xl text-slate-800'>Filter tree in Sorting component:</h1>
                <ReactJson src={filters} collapseStringsAfterLength={40} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />
                <h1 className='font-bold text-3xl text-slate-800'>Clear filter without ids:</h1>
                <ReactJson src={clearFilters} collapseStringsAfterLength={40} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />
            </div>
        </div>
    )
}