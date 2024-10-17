import { IFilterGroupSort, IFilterSort } from "../types";
import Container from "./Container";
import ContainerFilters from "./ContainerFilters";

import "./Wrapper.css";

interface WrapperProps {
    group: IFilterGroupSort;
    groupsIndex: number[];
    setList: (groupsIndex: number[], groups: IFilterGroupSort[]) => void;
    onEnd: () => void;
    isRoot?: boolean;
}

const Wrapper = (props: WrapperProps) => {
    const { group } = props
    const setListFilters = (filtersIndex: number[], filters: IFilterSort[]) => {
        console.log(filtersIndex, filters)
    }

    return (
        <div className="relative text-sm bg-gray-300 bg-opacity-35 p-2 mt-2 border border-slate-400 rounded select-none">
            <div className="flex items-center justify-between">
                <div className="font-bold text-slate-500">
                    Group: {group.id.split('-')[0]}
                </div>
                <div className="GroupSortHandle text-violet-500 cursor-move"><i className="fa-solid fa-bars"></i></div>
            </div>
            {group.filters.length ? (
                <div className="bg-white p-2 mt-2 border rounded select-none">
                    <ContainerFilters key={group.id} filters={group.filters} filtersIndex={props.groupsIndex} setList={setListFilters}
                        onEnd={props.onEnd} />
                </div>
            ) : null}
            <Container key={group.id} {...props} />
        </div>
    );
};

export default Wrapper;
