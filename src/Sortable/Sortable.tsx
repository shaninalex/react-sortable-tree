import { useState } from "react";
import GroupTree from "./components/GroupTree";
import { Group } from "./components/types";

export const Sortable = () => {
    const [groups, setGroups] = useState<Group[]>([
        {
            id: "ROOT",
            child: [
                { id: "G1" },
                { id: "G2" },
                { id: "G3", child: [{ id: "G4", child: [{ id: "G5" }] }] },
                { id: "G6" }
            ]
        }
    ]);

    return (
        <div>
            <GroupTree groups={groups} onChange={setGroups} />
        </div>
    );
}