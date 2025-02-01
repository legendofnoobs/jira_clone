"use client";

import { useGetProjects } from "@/features/projects/api/use-get-projects";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RiAddCircleFill } from "react-icons/ri";

function Projects() {
    const { open } = useCreateProjectModal();
    const pathName = usePathname();
    const workspaceId = useWorkspaceId();
    const { data } = useGetProjects({ workspaceId });

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase text-white">
                    projects
                </p>
                <RiAddCircleFill
                    onClick={open}
                    className="size-5 text-white cursor-pointer hover:opacity-75 transition"
                />
            </div>
            {data?.documents.map((project) => {
                const href = `/workspaces/${workspaceId}/projects/${project.$id}`
                const isActive = pathName === href;

                return (
                    <Link
                        key={project.$id}
                        href={href}
                    >
                        <div
                            className={cn(
                                "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-white",
                                isActive
                                    ? "bg-neutral-900 shadow-sm hover:opacity-100 text-primary"
                                    : ""
                            )}
                        >
                            <div className="flex justify-center items-center gap-2 font-medium">
                                <ProjectAvatar
                                    name={project.name}
                                    image={project?.imageUrl}
                                />
                                <span className="truncate">{project?.name}</span>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}

export default Projects;