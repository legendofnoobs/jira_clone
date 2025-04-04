import { UserButton } from "@/features/auth/components/user-button";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react"

interface StandaloneLayoutProps {
    children: ReactNode
}

function StandaloneLayout({ children }: StandaloneLayoutProps) {
    return (
        <main className="min-h-screen bg-black">
            <div className="mx-auto max-w-screen-xl p-4">
                <nav className="flex justify-between items-center h-[73px]">
                    <Link href="/">
                        <Image src="/logo.svg" width={101} height={37} alt="Logo" />
                    </Link>
                    <UserButton />
                </nav>
                <div className="flex flex-col items-center justify-center py-4">
                    {children}
                </div>
            </div>
        </main>
    );
}

export default StandaloneLayout