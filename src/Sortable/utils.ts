import _ from "lodash";
import { IFilterGroupSort, IFilterSort } from "../typings";

export function findGroupById(tree: IFilterGroupSort, groupId: string): IFilterGroupSort | null {
    if (tree.id === groupId) return tree;
    for (const group of tree.groups) {
        const foundGroup = findGroupById(group, groupId)
        if (foundGroup) return foundGroup
    }
    return null
}

export function findGroupByFilterID(tree: IFilterGroupSort, filterId: string): IFilterGroupSort | null {
    const filter = tree.filters.find(f => f.id === filterId);
    if (filter) return tree;

    for (const group of tree.groups) {
        const foundGroup = findGroupByFilterID(group, filterId);
        if (foundGroup) {
            return foundGroup;
        }
    }
    return null;
}


export function findFilterById(tree: IFilterGroupSort, targetId: string): IFilterSort | null {
    const filter = _.find(tree.filters, { id: targetId });
    if (filter) return filter
    if (tree.groups && tree.groups.length > 0) {
        for (const group of tree.groups) {
            const result = findFilterById(group, targetId)
            if (result) {
                return result
            }
        }
    }
    return null;
}

export function removeFilterById(tree: IFilterGroupSort[], targetId: string): IFilterSort | null {
    for (const group of tree) {
        const filterIndex = group.filters.findIndex(f => f.id === targetId);
        if (filterIndex !== -1) {
            return group.filters.splice(filterIndex, 1)[0];
        }
        const result = removeFilterById(group.groups, targetId);
        if (result) return result;
    }
    return null;
}

export function addFilterToGroup(tree: IFilterGroupSort[], targetId: string, filterToAdd: IFilterSort): boolean {
    for (const group of tree) {
        if (group.id === targetId) {
            group.filters.push(filterToAdd);
            return true;
        }
        const result = addFilterToGroup(group.groups, targetId, filterToAdd);
        if (result) return true;
    }
    return false;
}

export function removeGroupById(tree: IFilterGroupSort[], targetId: string): IFilterGroupSort | null {
    for (const group of tree) {
        const index = group.groups.findIndex(g => g.id === targetId);
        if (index !== -1) {
            return group.groups.splice(index, 1)[0];
        }
        const result = removeGroupById(group.groups, targetId);
        if (result) return result;
    }
    return null;
}


export function addGroupToGroup(tree: IFilterGroupSort[], targetId: string, groupToAdd: IFilterGroupSort): boolean {
    for (const group of tree) {
        if (group.id === targetId) {
            group.groups.push(groupToAdd);
            return true;
        }
        const result = addGroupToGroup(group.groups, targetId, groupToAdd);
        if (result) return true;
    }
    return false;
}

export function extractPrefixAndUUID(id: string): string[] {
    const indexOfFirstDash = id.indexOf('-');
    const prefix = id.substring(0, indexOfFirstDash);
    const uuid = id.substring(indexOfFirstDash + 1);
    return [prefix, uuid];
}

export function findParentGroupById(tree: IFilterGroupSort, groupID: string): IFilterGroupSort | null {
    for (const group of tree.groups) {
        if (group.id === groupID) return tree;
        const parent = findParentGroupById(group, groupID);
        if (parent) return parent;
    }
    return null;
}

export function swapGroupsInParent(tree: IFilterGroupSort[], parentGroupId: string, activeGroupId: string, overGroupId: string): IFilterGroupSort[] {
    const parentGroup = findGroupById(tree[0], parentGroupId);
    if (!parentGroup) return tree;
    const activeGroupIndex = parentGroup.groups.findIndex(group => group.id === activeGroupId);
    const overGroupIndex = parentGroup.groups.findIndex(group => group.id === overGroupId);
    if (activeGroupIndex === -1 || overGroupIndex === -1) return tree;
    const temp = parentGroup.groups[activeGroupIndex];
    parentGroup.groups[activeGroupIndex] = parentGroup.groups[overGroupIndex];
    parentGroup.groups[overGroupIndex] = temp;
    return [...tree];
}