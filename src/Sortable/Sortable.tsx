import { useState } from "react";
import GroupTree from "./components/GroupTree";
import { Group } from "./components/types";
import { v4 as uuid } from "uuid"


export const Sortable = () => {
    const [groups, setGroups] = useState<Group[]>([
        {
            id: "ROOT",
            child: [
                { id: uuid() },
                { id: uuid() },
                { id: uuid(), child: [{ id: uuid(), child: [{ id: uuid() }] }] },
                { id: uuid() }
            ]
        }
    ]);

    return (
        <div className="flex">
            <div className="w-1/2">
                <GroupTree groups={groups} onChange={setGroups} />
            </div>
            <div className="w-1/2">
                <pre>{JSON.stringify(groups, null, 2)}</pre>
            </div>
        </div>
    );
}