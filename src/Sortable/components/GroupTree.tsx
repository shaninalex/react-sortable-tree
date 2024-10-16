import { useRef } from "react";
import { Group } from "./types";
import Wrapper from "./Wrapper";

interface GroupTreeProps {
    groups: Group[];
    onChange: (groups: Group[]) => void;
}

const GroupTree = ({
    groups,
    onChange: handleChangeGroups
}: GroupTreeProps) => {
    const ref = useRef<any[]>([]);// eslint-disable-line

    const handleSetGroups = (groupsIndex: number[], currentList: Group[]) => {
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
            const lastArr = _blockIndex.reduce(
                (arr, i) => arr[i]["child"] ?? [],
                tempList
            );
            lastArr[lastIndex]["child"] = attemp.currentList;
        }
        ref.current = [];
        handleChangeGroups(tempList);
    };

    return (
        <div>
            <Wrapper
                key={groups[0].id}
                group={groups[0]}
                groupsIndex={[0]}
                setList={handleSetGroups}
                onEnd={handleOnEnd}
                isRoot
            />
        </div>
    );
};

export default GroupTree;
