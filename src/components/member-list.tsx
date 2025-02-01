import { SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Card, CardContent } from "./ui/card";
import { Member } from "@/features/members/types";
import MemberAvatar from "@/features/members/components/member-avatar";
import { Separator } from "./ui/separator";


interface MemberListProps {
    data: Member[];
    total: number
}

export const MemberList = ({ data, total }: MemberListProps) => {

    const workspaceId = useWorkspaceId();

    return (
        <div className="flex flex-col gap-y-4 col-span-1 ">
            <div className=" rounded-lg p-4 bg-neutral-900">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold">
                        Members ({total})
                    </p>
                    <Button
                        asChild
                        className="border-none"
                        size="icon"
                    >
                        <Link href={`/workspaces/${workspaceId}/members`}>
                            <SettingsIcon className="size-4 text-white" />
                        </Link>
                    </Button>
                </div>
                <Separator className="my-4 bg-neutral-700" />
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((member) => (
                        <li key={member.$id}>

                            <Card className="shadow-none rounded-lg overflow-hidden border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition text-white">
                                <CardContent className="p-4 flex flex-col items-center gap-x-2">
                                    <MemberAvatar
                                        name={member.name}
                                        className="size-12"
                                    />
                                    <div className="flex flex-col items-center overflow-hidden">
                                        <p className="text-lg font-medium line-clamp-1">
                                            {member.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground line-clamp-1 truncate">
                                            {member.email}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                        </li>
                    ))}
                    <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
                        No members found
                    </li>
                </ul>
            </div>
        </div>
    )
}