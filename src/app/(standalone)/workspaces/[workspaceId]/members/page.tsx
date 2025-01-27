import { getCurrent } from "@/features/auth/queries";
import MembersList from "@/features/members/components/members-list";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface WorkspaceMembersPageProps {
    params: {
        workspaceId: string;
        inviteCode: string;
    };
}

async function WorkspaceMembers({ params }: WorkspaceMembersPageProps) {
    const user = await getCurrent();
    if (!user) {
        redirect(`/sign-in`);
    }

    const workspace = await getWorkspaceInfo({ workspaceId: params.workspaceId });

    if (!workspace) {
        redirect("/");
    }

    return (
        <div className="w-full lg:max-w-xl">
            <MembersList />
        </div>
    )
}

export default WorkspaceMembers