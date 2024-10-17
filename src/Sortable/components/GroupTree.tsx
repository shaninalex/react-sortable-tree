import { useRef } from "react";
import { IFilterGroupSort, IFilterSort } from "../types";
import Wrapper from "./Wrapper";

interface GroupTreeProps {
    groups: IFilterGroupSort[];
    onChange: (groups: IFilterGroupSort[]) => void;
}

const GroupTree = (props: GroupTreeProps) => {
    const { groups, onChange } = props
    const ref = useRef<any[]>([]);// eslint-disable-line

    const handleSetGroups = (groupsIndex: number[], currentList: IFilterGroupSort[]) => {
        ref.current.push({ groupsIndex, currentList });
    };

    const handleOnEnd = () => {
        const attemps = [...ref.current];
        attemps.sort((a, b) => b.groupsIndex.length - a.groupsIndex.length);

        const tempList = [...groups];
        let attempIndex = 0;
        while (attempIndex < attemps.length) {
            const attemp = { ...attemps[attempIndex] };
            attempIndex++;
            const _blockIndex = [...attemp.groupsIndex];
            const lastIndex = _blockIndex.pop()!;
            const lastArr = _blockIndex.reduce((arr, i) => arr[i]["groups"] ?? [], tempList);
            lastArr[lastIndex]["groups"] = attemp.currentList;
        }
        ref.current = [];
        onChange(tempList);
    };

    const handleSetListFilters = (filtersIndex: number[], filters: IFilterSort[]) => {
        console.log('filtersIndex:', filtersIndex)
        console.log('filters:', filters)
    }

    return (
        <div>
            <Wrapper
                key={groups[0].id}
                group={groups[0]}
                groupsIndex={[0]}
                setList={handleSetGroups}
                setListFilters={handleSetListFilters}
                onEnd={handleOnEnd}
                isRoot
            />
        </div>
    );
};

export default GroupTree;
