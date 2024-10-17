import { TFilterCondition, TFilterLogicCondition } from "../typings";

export interface Group {
    id: string;
    child?: Group[];
}

export interface IFilterSort {
    id: string
    field: string
    condition: TFilterCondition
    value: string
    unit?: string
    includeCurrent?: boolean
    group: string
    disabled: boolean
}
export interface IFilterGroupSort {
    id: string
    condition: TFilterLogicCondition
    groups: IFilterGroupSort[]
    filters: IFilterSort[]
}