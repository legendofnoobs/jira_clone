import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { headers } from "next/headers";

async function CreateWorkspace() {
    const user = await getCurrent();
    if (!user) {
        const headersList = headers();
        const host = headersList.get("host") || "";
        const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

        // Construct the current URL
        const currentUrl = `${protocol}://${host}/workspaces/create`;
        const encodedCallbackUrl = encodeURIComponent(currentUrl);
        redirect(`/sign-in?callbackUrl=${encodedCallbackUrl}`);
    }

    return (
        <div className="w-full lg:max-w-xl">
            <CreateWorkspaceForm />
        </div>
    )
}

export default CreateWorkspace