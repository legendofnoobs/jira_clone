"use server"

import { Query } from "node-appwrite"
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config"
import { Workspace } from "./types"
import { createSessionClient } from "@/lib/appwrite"

export const getWorkspaces = async () => {
    const { databases, account } = await createSessionClient();
    const user = await account.get();

    const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal("userId", user.$id)]
    )

    if (members.total === 0) {
        return { document: [], total: 0 }
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
        DATABASE_ID,
        WORKSPACES_ID,
        [
            Query.orderDesc("$createdAt"),
            Query.contains("$id", workspaceIds)
        ]
    );
    return workspaces;
}

interface GetWorkspaceProps {
    workspaceId: string
}

export const getWorkspaceInfo = async ({
    workspaceId,
}: GetWorkspaceProps): Promise<{ name: string } | null> => {
    const { databases } = await createSessionClient();

    const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
    );

    return { name: workspace.name };
};