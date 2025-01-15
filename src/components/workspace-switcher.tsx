"use client";

import { RiAddCircleFill } from "react-icons/ri"
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import WorkspaceAvatar from "@/features/workspaces/components/workspace-avatar";

export const WorkspaceSwitcher = () => {
    const { data: workspaces } = useGetWorkspaces();
    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase text-neutral-500 ">
                    workspaces
                </p>
                <RiAddCircleFill
                    className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
                />
            </div>
            <Select>
                <SelectTrigger className="w-full bg-neutral-200 font-medium px-2 py-7">
                    <SelectValue placeholder="no workspace selected" />
                </SelectTrigger>
                <SelectContent>
                    {workspaces?.documents?.map((workspace) => (
                        <SelectItem key={workspace.$id} value={workspace.$id}>
                            <div className="flex justify-center items-center gap-2 font-medium">
                                <WorkspaceAvatar
                                    name={workspace.name}
                                    image={workspace?.imageUrl}
                                />
                                <span className="truncate">{workspace?.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}