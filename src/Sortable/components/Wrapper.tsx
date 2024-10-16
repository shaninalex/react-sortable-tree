import Container from "./Container";
import { Group } from "./types";

import "./Wrapper.css";

interface WrapperProps {
    group: Group;
    groupsIndex: number[];
    setList: (groupsIndex: number[], groups: Group[]) => void;
    onEnd: () => void;
    isRoot?: boolean;
}

const Wrapper = (props: WrapperProps) => {
    return (
        <div className="block wrapper">
            <div>id: {props.group.id}</div>
            <Container key={props.group.id} {...props} />
        </div>
    );
};

export default Wrapper;
