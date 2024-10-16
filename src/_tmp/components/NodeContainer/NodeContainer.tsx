import { useSortable } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities'
import { TreeNode } from "../../typings"

interface NodeProps {
    node: TreeNode
}

export const NodeContainer = (props: NodeProps) => {
    const { id, content } = props.node
    const {attributes, listeners, setNodeRef, transition, transform} = useSortable({ id })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    return (
        <div ref={setNodeRef} className="border border-slate-500 bg-slate-100 rounded p-3" style={style} {...attributes} {...listeners}>
            <small className="text-sm text-slate-700">{id}</small>
            {content}
        </div>
    )
}