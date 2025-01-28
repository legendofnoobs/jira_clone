import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
// import UpdateProjectForm from "@/features/projects/components/UpdateProjectForm";
import { getProject } from "@/features/projects/queries";
import EditProjectForm from "@/features/projects/components/edit-project-form";

interface ProjectSettingsProps {
    params: {
        workspaceId: string
        projectId: string
    }
}

async function ProjectIdSettings({ params }: ProjectSettingsProps) {
    const user = await getCurrent();
    if (!user) {
        redirect(`/sign-in`);
    }

    const initialValues = await getProject({ 
        projectId: params.projectId 
    });

    if (!initialValues) {
        redirect(`/workspaces/${params.workspaceId}/projects/${params.projectId}`);
    }

    return (
        <div className="w-full lg:max-w-xl">
            <EditProjectForm initialValues={initialValues}/>
        </div>
    );
}

export default ProjectIdSettings;