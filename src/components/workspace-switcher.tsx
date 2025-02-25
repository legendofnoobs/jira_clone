"use client";

import { RiAddCircleFill } from "react-icons/ri";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";
import { useRouter } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";

export const WorkspaceSwitcher = () => {
    const { data: workspaces } = useGetWorkspaces();

    const workspaceId = useWorkspaceId();

    const { open } = useCreateWorkspaceModal();

    // Handle cases where `documents` may not exist
    const documents = workspaces && "documents" in workspaces ? workspaces.documents : [];
    //=============================================

    const router = useRouter();

    const onSelect = (id: string) => {
        router.push(`/workspaces/${id}`)
    }

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase text-white">
                    workspaces
                </p>
                <RiAddCircleFill
                onClick={open}
                    className="size-5 text-white cursor-pointer hover:opacity-75 transition"
                />
            </div>
            <Select onValueChange={onSelect} value={workspaceId}>
                <SelectTrigger className="w-full bg-neutral-900 border-none font-medium px-2 py-7">
                    <SelectValue placeholder="no workspace selected" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-900 border-none text-white">
                    {documents.map((workspace) => (
                        <SelectItem key={workspace.$id} value={workspace.$id} >
                            <div className="flex justify-center group-hover:bg-neutral-700 bg-neutral-900 items-center gap-2 font-medium">
                                <WorkspaceAvatar
                                    name={workspace.name}
                                    image={workspace.imageUrl}
                                />
                                <span className="truncate">{workspace.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
