import { useState } from 'react'
import ReactJson from 'react-json-view'

import { FiltersTree } from './components'
import { EXAMPLE_FILTER_GROUP } from '../data'
import {  } from './utils'
import { IFilterGroup } from '../typings'


export const Sortable = () => {
    const [filters, setGroups] = useState<IFilterGroup[]>([EXAMPLE_FILTER_GROUP])

    return (
        <div className='lg:flex gap-8'>
            <div className='lg:w-1/2 flex-grow-0'>
                <FiltersTree groups={filters} onChange={setGroups} />
            </div>
            <div className='lg:w-1/2 flex-grow-0'>
                <ReactJson src={filters} collapseStringsAfterLength={40} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />
            </div>
        </div>
    )
}
