import { ReactSortable } from "react-sortablejs";
import { Group } from "./types";
import Wrapper from "./Wrapper";

interface ContainerProps {
    group: Group;
    groupsIndex: number[];
    setList: (groupsIndex: number[], groups: Group[]) => void;
    onEnd: () => void;
    isRoot?: boolean;
}

const Container = ({
    group,
    groupsIndex,
    setList,
    onEnd,
}: ContainerProps) => {

    const sortableOptions = {
        animation: 150,
        fallbackOnBody: true,
        swapThreshold: 0.65,
        ghostClass: "ghost",
        group: "shared",
        forceFallback: true
    };

    return (
        <ReactSortable
            list={group.child ?? []}
            setList={(s1, _s2, s3) => s3.dragging && setList(groupsIndex, s1)}
            {...sortableOptions}
            onEnd={onEnd}
            style={{ minHeight: "20px" }}
        >
            {(group.child ?? []).map((childBlock, index) => {
                return (
                    <Wrapper
                        key={childBlock.id}
                        group={childBlock}
                        groupsIndex={[...groupsIndex, index]}
                        setList={setList}
                        onEnd={onEnd}
                    />
                );
            })}
        </ReactSortable>
    );
};

export default Container;
