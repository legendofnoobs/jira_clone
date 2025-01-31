import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { ProjectIdClient } from "./client";

async function Project() {
    const user = await getCurrent();
    if (!user) {
        redirect(`/sign-in`);
    }

    return (
        <ProjectIdClient/>
    );
}

export default Project;