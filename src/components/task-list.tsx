import { CalendarIcon, PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useCreateTaskModal } from "@/features/tasks/hooks/use-create-task-modal";
import { Task } from "@/features/tasks/types";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Card, CardContent } from "./ui/card";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "./ui/separator";


interface TaskListProps {
    data: Task[];
    total: number
}

export const TaskList = ({ data, total }: TaskListProps) => {

    const workspaceId = useWorkspaceId();
    const { open: createTask } = useCreateTaskModal();

    return (
        <div className="flex flex-col gap-y-4 col-span-1 bg-neutral-900 rounded-lg">
            <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Tasks ({total})
                    </p>
                    <Button
                    className="border-none"
                        size="icon"
                        onClick={createTask}
                    >
                        <PlusIcon className="size-4 text-white" />
                    </Button>
                </div>
                <Separator className="my-4 bg-neutral-700" />
                <ul className="flex flex-col gap-y-4 h-96 overflow-y-auto">
                    {data.map((task) => (
                        <li key={task.$id}>
                            <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                                <Card className="shadow-none rounded-lg border-neutral-700 hover:bg-neutral-800 transition bg-neutral-900 text-white">
                                    <CardContent className="p-4">
                                        <p className="text-lg font-medium truncate">
                                            {task.name}
                                        </p>
                                        <div className="flex items-center gap-x-2">
                                            <p>{task.project?.name}</p>
                                            <div className="size-1 rounded-full bg-neutral-300" />
                                            <div className="text-sm text-muted-foreground flex items-center">
                                                <CalendarIcon className="size-3 mr-1" />
                                                <span className="truncate">
                                                    {formatDistanceToNow(new Date(task.dueDate))}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </li>
                    ))}
                    <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
                        No tasks found
                    </li>
                </ul>
                <Button
                    asChild
                    className="mt-4 w-full border-none transition"
                >
                    <Link href={`/workspaces/${workspaceId}/tasks`}>
                        Show All
                    </Link>
                </Button>
            </div>
        </div>
    )
}