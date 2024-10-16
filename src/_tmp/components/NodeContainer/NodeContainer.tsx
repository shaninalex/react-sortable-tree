import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { TreeNode } from "../../typings"
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core"

interface NodeProps {
    node: TreeNode
}

export const NodeContainer = (props: NodeProps) => {
    const { id, content, children } = props.node
    const { attributes, listeners, setNodeRef, transition, transform } = useSortable({ id })

    const style = transform ? {
        transition,
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        // NOTE: if use documented method:
        // transform: CSS.Translate.toString(transform),
        // it can rescale and resize items during dragg
    } : undefined;
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        // TODO: logic to move out the item from current node
        console.log(active, over)
    }
    return (
        <div ref={setNodeRef} className="border border-slate-500 bg-slate-100 rounded p-3" style={style} {...attributes} {...listeners}>
            <small className="text-sm text-slate-700">{id}</small>
            {content}
            {children.length ? (
                <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                    <SortableContext items={children} strategy={verticalListSortingStrategy}>
                        <div className="bg-slate-100 rounded p-4 flex flex-col gap-2">
                            {children.map(node => (
                                <NodeContainer key={node.id} node={node} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            ) : null}
        </div>
    )
}