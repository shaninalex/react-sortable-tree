import React, { useState } from "react";
import { DndContext, useDroppable, useDraggable, DragEndEvent, DragStartEvent, UniqueIdentifier } from "@dnd-kit/core";
import { v4 as uuid } from "uuid"

interface TreeNode {
    id: string;
    children: TreeNode[];
}

const initialTree: TreeNode[] = [
    {
        id: uuid(),
        children: [
            {
                id: uuid(),
                children: []
            },
            {
                id: uuid(),
                children: [
                    { id: uuid(), children: [] },
                    { id: uuid(), children: [] },
                    { id: uuid(), children: [] },
                ]
            },
            {
                id: uuid(),
                children: [
                    { id: uuid(), children: [] },
                    { id: uuid(), children: [] },
                    { id: uuid(), children: [] },
                ]
            },
            {
                id: uuid(),
                children: [
                    { id: uuid(), children: [] },
                    { id: uuid(), children: [] },
                    { id: uuid(), children: [] },
                ]
            }
        ]
    },
];

export const Main = () => {
    const [tree, setTree] = useState<TreeNode[]>(initialTree);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { over } = event;
        if (over && activeId !== over.id as string) {
            setTree((prevTree) => moveNode(prevTree, activeId! as string, over.id as string));
        }
        setActiveId(null);
    };

    return (
        <div className="flex gap-4">
            <div className="w-2/3">
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                    <div className="tree">
                        {tree.map((node) => (
                            <TreeNodeComponent key={node.id} node={node} />
                        ))}
                    </div>
                </DndContext>
            </div>
            <div className="w-1/3">
                <pre className="overflow-auto text-sm border rounded p-4 bg-slate-200 text-slate-700">{JSON.stringify(tree, null, 2) }</pre>
            </div>
        </div>

    );
};

interface TreeNodeProps {
    node: TreeNode;
}

const TreeNodeComponent = ({ node }: TreeNodeProps) => {
    const { isOver, setNodeRef } = useDroppable({
        id: node.id,
    });

    const droppableStyle = {
        border: isOver ? "2px solid green" : "1px solid gray",
        position: 'relative',
    };

    const placeholderStyle = {
        display: isOver ? "block" : "none",
        backgroundColor: "#f0f0f0",
        border: "2px dashed gray",
        padding: "10px",
        textAlign: "center",
        marginBottom: "5px",
    };

    return (
        <div ref={setNodeRef} className="border rounded m-2 p-2" style={droppableStyle}>
            <Draggable id={node.id}>{node.id}</Draggable>
            <div style={placeholderStyle}>
                Drop here
            </div>
            {node.children.length > 0 ? (
                <div className="children">
                    {node.children.map((childNode) => (
                        <TreeNodeComponent key={childNode.id} node={childNode} />
                    ))}
                </div>
            ) : null}
        </div>
    );
};

interface DraggableProps {
    id: string;
    children: React.ReactNode;
}

const Draggable = ({ id, children }: DraggableProps) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });

    const style = transform
        ? {
            transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
        : undefined;

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </div>
    );
};

const moveNode = (tree: TreeNode[], sourceId: string, targetId: string): TreeNode[] => {
    const [sourceNode, remainingTree] = removeNode(tree, sourceId);
    if (!sourceNode) return remainingTree;

    return insertNode(remainingTree, targetId, sourceNode);
};

const removeNode = (tree: TreeNode[], nodeId: string): [TreeNode | null, TreeNode[]] => {
    let nodeToRemove: TreeNode | null = null;

    const filteredTree = tree.filter((node) => {
        if (node.id === nodeId) {
            nodeToRemove = node;
            return false;
        }
        const [removedChild, remainingChildren] = removeNode(node.children, nodeId);
        if (removedChild) {
            nodeToRemove = removedChild;
            node.children = remainingChildren;
        }
        return true;
    });

    return [nodeToRemove, filteredTree];
};

const insertNode = (tree: TreeNode[], targetId: string, nodeToInsert: TreeNode): TreeNode[] => {
    return tree.map((node) => {
        if (node.id === targetId) {
            return {
                ...node,
                children: [...node.children, nodeToInsert],
            };
        }
        return {
            ...node,
            children: insertNode(node.children, targetId, nodeToInsert),
        };
    });
};
