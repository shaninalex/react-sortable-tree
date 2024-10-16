import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core"
import { useState } from "react"
import { TreeNode } from "./typings"
import { v4 as uuid } from "uuid"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { NodeContainer } from "./components"

export const SimpleMain = () => {
    const [treeNodes, setTreeNodes] = useState<TreeNode[]>([
        {
            id: uuid(), content: "Node 0", children: [
                { id: uuid(), content: "Node 0.0", children: [] },
                { id: uuid(), content: "Node 0.1", children: [] },
                { id: uuid(), content: "Node 0.2", children: [] },
            ]
        },
        { id: uuid(), content: "Node 1", children: [] },
        {
            id: uuid(), content: "Node 2", children: [
                { id: uuid(), content: "Node 2.0", children: [] },
                {
                    id: uuid(), content: "Node 1.0.1", children: [
                        { id: uuid(), content: "Node 1.0.1.0", children: [] },
                        { id: uuid(), content: "Node 1.0.1.1", children: [] },
                    ]
                },
                { id: uuid(), content: "Node 2.1", children: [] },
            ]
        },
    ])
    const getNodePos = (id: string) => treeNodes.findIndex(task => task.id === id)
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) return
        if (active.id === over.id) return
        setTreeNodes(nodes => {
            const originalPos = getNodePos(active.id as string)
            const newPos = getNodePos(over.id as string)
            return arrayMove(nodes, originalPos, newPos)
        })
    }

    // For keyboard and touch
    // const sensors = useSensors(
    //     useSensor(PointerSensor),
    //     useSensor(TouchSensor),
    //     useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    // )

    return (
        <div>
            {/* 
            
            Use modifiers to change context behaviour
            modifiers={[restrictToVerticalAxis]} - move only by Y axis
            
            Applying sensors
            sensors={sensors} 
            */}
            <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
                <SortableContext items={treeNodes} strategy={verticalListSortingStrategy}>
                    <div className="bg-slate-100 rounded p-4 flex flex-col gap-2">
                        {treeNodes.map(node => (
                            <NodeContainer key={node.id} node={node} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}

