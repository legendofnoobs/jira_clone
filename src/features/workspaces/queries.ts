"use server"

import { cookies } from "next/headers"
import { Account, Client, Databases, Query } from "node-appwrite"
import { AUTH_COOKIE } from "../auth/constants"
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config"
import { getMember } from "../members/utils"
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

export const getWorkspace = async ({ workspaceId }: GetWorkspaceProps) => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)

    const session = cookies().get(AUTH_COOKIE);

    if (!session) return null

    client.setSession(session.value)
    const databases = new Databases(client);
    const account = new Account(client);
    const user = await account.get();

    const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
    })

    if (!member) throw new Error("You are not a member of this workspace")

    const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
    );
    return workspace;
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