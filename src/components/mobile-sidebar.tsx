"use client";

import { useEffect, useState } from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "@/components/sidebar";
import { usePathname } from "next/navigation";

function MobileSidebar() {

    const [isOpen, setIsOpen] = useState(false);
    const pathName = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathName])

    return (
        <Sheet modal={false} open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <Button variant={"secondary"} className="lg:hidden bg-neutral-700 border-none hover:bg-neutral-800">
                    <MenuIcon className="size-4 text-neutral-100 " />
                </Button>
            </SheetTrigger>
            <SheetContent side={"left"} className="p-0 border-r border-neutral-700">
                <Sidebar />
            </SheetContent>
        </Sheet>
    );
}

export default MobileSidebar;