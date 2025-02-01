"use client";
import { UserButton } from "@/features/auth/components/user-button";
import MobileSidebar from "@/components/mobile-sidebar";
import { usePathname } from "next/navigation"
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const pathnameMap = {
    "tasks": {
        title: "My Tasks",
        description: "View all of your tasks across the workspace here",
    },
    "projects": {
        title: "My Projects",
        description: "View task of your projects here",
    },
}

const defaultMap = {
    title: "Home",
    description: "Monitor all your projects and taks here",
}

function Navbar() {
    const pathname = usePathname();
    const pathnameParts = pathname.split("/");
    const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;
    const { title, description } = pathnameMap[pathnameKey] || defaultMap;
    return (
        <nav className="pt-4 px-6 flex items-center justify-between">
            <div className="flex-col hidden lg:flex">
                <h1 className="text-2xl font-semibold">
                    {title}
                </h1>
                <p className="text-muted-foreground">
                    {description}
                </p>
            </div>
            <MobileSidebar />
            <div className="flex gap-4 items-center">
                <Link href={`https://github.com/legendofnoobs/jira_clone`} target={`_blank`} className="flex gap-2 items-center">
                    <FaGithub className="size-6"/>
                    star repo
                </Link>
                <UserButton />
            </div>
        </nav>
    );
}

export default Navbar