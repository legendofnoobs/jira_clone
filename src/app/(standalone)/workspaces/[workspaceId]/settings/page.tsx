import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { getWorkspace } from "@/features/workspaces/queries";
import EditWorkSpaceForm from "@/features/workspaces/components/edit-workspace-form";


interface WorkspaceSettingsProps {
    params: {
        workspaceId: string
    }
}

async function WorkspaceIdSettingsPage({ params }: WorkspaceSettingsProps) {

    const user = await getCurrent();
    if (!user) {
        redirect(`/sign-in`);
    }

    const initialValues = await getWorkspace({ workspaceId: params.workspaceId });

    if (!initialValues) {
        redirect(`/workspaces/${params.workspaceId}`);
    }

    return (
        <div className="w-full lg:max-w-xl">
            <EditWorkSpaceForm initialValues={initialValues} />
        </div>
    );
}

export default WorkspaceIdSettingsPage