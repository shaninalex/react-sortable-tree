import { useEffect, useState } from "react";
import GroupTree from "./components/GroupTree";
import { IFilterGroupSort } from "./types";
import { EXAMPLE_FILTER_GROUP } from "../data";
import { convertToFilterGroup, generateFilterGroupWithIDs } from "./utils";
import ReactJson from 'react-json-view'
import { IFilterGroup } from "../typings";


export const Sortable = () => {
    const [filters, setGroups] = useState<IFilterGroupSort[]>([generateFilterGroupWithIDs(EXAMPLE_FILTER_GROUP)]);
    const [clearFilters, setClearFilters] = useState<IFilterGroup[]>([]);
    useEffect(() => {
        setClearFilters([convertToFilterGroup(filters[0])])
    }, [filters])

    return (
        <div className="flex gap-8">
            <div className="w-1/2 flex-grow-0">
                <GroupTree groups={filters} onChange={setGroups} />
            </div>
            <div className="w-1/2 flex-grow-0">
                <ReactJson src={filters} collapseStringsAfterLength={40} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />
                <h1 className="font-bold text-3xl text-slate-800">Clear filter without ids:</h1>
                <ReactJson src={clearFilters} collapseStringsAfterLength={40} enableClipboard={false} displayObjectSize={false} displayDataTypes={false} />
            </div>
        </div>
    );
}