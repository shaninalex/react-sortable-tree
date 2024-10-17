import { ReactSortable } from "react-sortablejs";
import { IFilterGroupSort, IFilterSort } from "../types";
import Wrapper from "./Wrapper";

interface ContainerProps {
    group: IFilterGroupSort;
    groupsIndex: number[];
    isRoot?: boolean;

    setList: (groupsIndex: number[], groups: IFilterGroupSort[]) => void;
    setListFilters: (filtersIndex: number[], filters: IFilterSort[]) => void;
    onEnd: () => void;
}

const Container = (props: ContainerProps) => {
    return (
        <ReactSortable
            list={props.group.groups ?? []}
            setList={(s1, _s2, s3) => s3.dragging && props.setList(props.groupsIndex, s1)}
            animation={150}
            fallbackOnBody={true}
            swapThreshold={0.25}
            ghostClass={"opacity-80"}
            group={"shared"}
            forceFallback={true}
            onEnd={props.onEnd}
            handle=".GroupSortHandle"
        >
            {(props.group.groups ?? []).map((childBlock, index) => {
                return (
                    <Wrapper
                        key={childBlock.id}
                        group={childBlock}
                        groupsIndex={[...props.groupsIndex, index]}
                        setList={props.setList}
                        setListFilters={props.setListFilters}
                        onEnd={props.onEnd}
                    />
                );
            })}
        </ReactSortable>
    );
};

export default Container;
