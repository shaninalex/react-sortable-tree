import { IFilterGroupSort, IFilterSort } from "../types";
import Container from "./Container";
import ContainerFilters from "./ContainerFilters";

interface WrapperProps {
    group: IFilterGroupSort;
    groupsIndex: number[];
    setList: (groupsIndex: number[], groups: IFilterGroupSort[]) => void;
    setListFilters: (filtersIndex: number[], filters: IFilterSort[]) => void;
    onEnd: () => void;
    isRoot?: boolean;
}

const Wrapper = (props: WrapperProps) => {
    return (
        <div className="relative text-sm bg-gray-300 bg-opacity-35 p-2 mt-2 border border-slate-400 rounded select-none">
            <div className="flex items-center justify-between">
                <div className="font-bold text-slate-500">
                    Group: {props.group.id.split('-')[0]}
                </div>
                <div className="GroupSortHandle text-violet-500 cursor-move"><i className="fa-solid fa-bars"></i></div>
            </div>
            {props.group.filters.length ? (
                <div className="bg-white p-2 mt-2 border rounded select-none">
                    <ContainerFilters key={props.group.id} filters={props.group.filters} filtersIndex={props.groupsIndex} setListFilters={props.setListFilters}
                        onEnd={props.onEnd} />
                </div>
            ) : null}
            <Container key={props.group.id} {...props} />
        </div>
    );
};

export default Wrapper;
