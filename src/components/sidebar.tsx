import Image from "next/image";
import Link from "next/link";

import { Separator } from "./ui/separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";
import Projects from "./projects";



function Sidebar() {
    return (
        <aside className="h-full p-4 w-full bg-black text-white border-r border-neutral-700">
            <Link href="/">
                <Image src="/logo.svg" width={152} height={56} alt="Logo" />
            </Link>
            <Separator className="my-4 bg-neutral-700" />
            <WorkspaceSwitcher />
            <Separator className="my-4 bg-neutral-700" />
            <Navigation />
            <Separator className="my-4 bg-neutral-700" />
            <Projects />
        </aside>
    );
}

export default Sidebar;