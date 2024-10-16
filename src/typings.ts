export enum TFilterCondition {
    eq = 'eq',
    neq = 'neq',
    gt = 'gt',
    gteq = 'gteq',
    lt = 'lt',
    lteq = 'lteq',
    contains = 'contains',
    ncontains = 'ncontains',
    starts = 'starts',
    nstarts = 'nstarts',
    ends = 'ends',
    nends = 'nends',
    empty = 'empty',
    nempty = 'nempty',
    named = 'named',
    time_interval = 'time_interval',
    time_part = 'time_part',
}
export enum TFilterLogicCondition {
    and = 'and',
    or = 'or',
}
export enum TSortDirection {
    asc = 'asc',
    desc = 'desc',
}
export interface IFilter {
    field: string
    condition: TFilterCondition
    value: string
    unit?: string
    includeCurrent?: boolean
    group: string
    disabled: boolean
}
export interface IFilterGroup {
    condition: TFilterLogicCondition
    groups: IFilterGroup[]
    filters: IFilter[]
}
export interface ISort {
    field: string
    direction: TSortDirection
}