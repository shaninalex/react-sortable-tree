import { IFilter, IFilterGroup } from "../typings";
import { v4 as uuid } from "uuid"
import { IFilterGroupSort, IFilterSort } from "./types";


export function generateFilterGroupWithIDs(filterGroup: IFilterGroup): IFilterGroupSort {
    const newGroup: IFilterGroupSort = {
        ...filterGroup,
        id: uuid(),
        filters: filterGroup.filters.map(generateFilterWithID),
        groups: filterGroup.groups.map(generateFilterGroupWithIDs),
    };
    return newGroup;
}

function generateFilterWithID(filter: IFilter): IFilterSort {
    return {
        ...filter,
        id: uuid(),
    };
}

export function convertToFilterGroup(groupSort: IFilterGroupSort): IFilterGroup {
    const newGroup: IFilterGroup = {
        condition: groupSort.condition,
        filters: groupSort.filters.map(convertToFilter),
        groups: groupSort.groups.map(convertToFilterGroup),
    };
    return newGroup;
}

function convertToFilter(filterSort: IFilterSort): IFilter {
    return {
        field: filterSort.field,
        condition: filterSort.condition,
        value: filterSort.value,
        unit: filterSort.unit,
        includeCurrent: filterSort.includeCurrent,
        group: filterSort.group,
        disabled: filterSort.disabled,
    };
}