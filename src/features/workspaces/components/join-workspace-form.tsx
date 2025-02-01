"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useJoinWorkspace } from "../api/use-join-workspace";
// import { useInviteCode } from ;
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useRouter } from "next/navigation";
import { useInviteCode } from "../hooks/use-invite-code";

interface JoinWorkspaceFormProps {
    initialValues: {
        name: string;
    };
}

function JoinWorkspaceForm({ initialValues }: JoinWorkspaceFormProps) {
    const router = useRouter();
    const inviteCode = useInviteCode();
    const workspaceId = useWorkspaceId();

    const { mutate, isPending } = useJoinWorkspace();

    const handleInvite = () => {
        mutate({
            param: { workspaceId },
            json: { code: inviteCode }
        }, {
            onSuccess: ({ data }) => {
                router.push(`/workspaces/${data.$id}`)
            }
        })
    }

    return (
        <Card className="w-full h-full border-none shadow-none bg-neutral-900 text-white">
            <CardHeader className="p-7">
                <CardTitle className="text-xl font-bold">
                    Join workspace
                </CardTitle>
                <CardDescription>
                    youve been invited to join <strong>{initialValues.name}</strong> workspace
                </CardDescription>
            </CardHeader>
            <CardContent className="p-7">
                <div className="flex flex-col gap-2 lg:flex-row items-center justify-between">
                    <Button
                        type="button"
                        variant="secondary"
                        asChild
                        className="w-full lg:w-fit"
                        size={"lg"}
                    disabled={isPending}
                    >
                        <Link href={"/"}>cancel</Link>
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        className="w-full lg:w-fit border-none"
                        size={"lg"}
                    onClick={handleInvite}
                    disabled={isPending}
                    >
                        join workspace
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default JoinWorkspaceForm;