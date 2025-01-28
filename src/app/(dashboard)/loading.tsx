"use client";

import { Loader } from "lucide-react"

function ErrorPage() {
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <Loader className="size-6 animate-spin mt-96" />
        </div>
    );
}

export default ErrorPage