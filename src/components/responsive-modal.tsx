'use client'

import { useMedia } from "react-use";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ReactNode } from "react";

interface ResponsiveModalProps {
    children: ReactNode,
    open: boolean,
    onOpenChange: (open: boolean) => void
}

function ResponsiveModal({ children, open, onOpenChange }: ResponsiveModalProps) {

    const isDesktop = useMedia("(min-width: 1024px)", true);

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="w-full sm:max-w-lg p-0 border-none overflow-y-auto hide-scrollbar max-h-[85vh] outline-none">
                    {children}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            <DrawerContent>
                <div className="overflow-y-auto hide-scrollbar max-h-[85vh] bg-neutral-900">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    );
}

export default ResponsiveModal;