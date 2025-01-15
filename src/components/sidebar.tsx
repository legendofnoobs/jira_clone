import Image from "next/image";
import Link from "next/link";

import { Separator } from "./ui/separator";
import { Navigation } from "./navigation";
import { WorkspaceSwitcher } from "./workspace-switcher";



function Sidebar() {
    return (
        <aside className="h-full bg-neutral-100 p-4 w-full">
            <Link href="/">
                <Image src="/logo.svg" width={152} height={56} alt="Logo" />
            </Link>
            <Separator className="my-4" />
            <WorkspaceSwitcher />
            <Separator className="my-4" />
            <Navigation />
        </aside>
    );
}

export default Sidebar;