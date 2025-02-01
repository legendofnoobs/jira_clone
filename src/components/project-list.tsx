import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Card, CardContent } from "./ui/card";
import { Project } from "@/features/projects/types";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import ProjectAvatar from "@/features/projects/components/ProjectAvatar";
import { Separator } from "./ui/separator";


interface ProjecListProps {
    data: Project[];
    total: number
}

export const ProjectList = ({ data, total }: ProjecListProps) => {

    const workspaceId = useWorkspaceId();
    const { open: createProject } = useCreateProjectModal();

    return (
        <div className="flex flex-col gap-y-4 col-span-1">
            <div className="bg-neutral-900 border-none rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Projects ({total})
                    </p>
                    <Button
                        className="border-none"
                        size="icon"
                        onClick={createProject}
                    >
                        <PlusIcon className="size-4 text-white" />
                    </Button>
                </div>
                <Separator className="my-4 bg-neutral-700" />
                <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {data.map((project) => (
                        <li key={project.$id}>
                            <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                                <Card className="shadow-none rounded-lg hover:bg-neutral-800 transition bg-neutral-900 text-white border-neutral-700">
                                    <CardContent className="p-4 flex items-center gap-x-2.5">
                                        <ProjectAvatar
                                            name={project.name}
                                            image={project.imageUrl}
                                            fallbackClassName="text-lg"
                                            className="size-12"
                                        />
                                        <p className="text-lg font-medium truncate">
                                            {project.name}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                    <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
                        No projects found
                    </li>
                </ul>
            </div>
        </div>
    )
}