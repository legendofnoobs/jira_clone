import { useEffect, useState, useCallback } from "react";
import { storage } from "../lib/appwriteClient";

type FileType = {
    $id: string;
    name: string;
};

export function useFetchFiles(projectId: string) {
    const [files, setFiles] = useState<FileType[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFiles = useCallback(async () => {
        setLoading(true);
        try {
            const bucketId = process.env.NEXT_PUBLIC_APPWRITE_FILES_BUCKET_ID;
            if (!bucketId) {
                throw new Error("NEXT_PUBLIC_APPWRITE_FILES_BUCKET_ID is not defined");
            }

            const response = await storage.listFiles(bucketId);

            const projectFiles = response.files
                .filter((file) => file.$id.startsWith(`${projectId}_`))
                .map((file) => ({
                    ...file,
                    originalName: file?.name || "Unknown File", // Fetch original name
                }));

            setFiles(projectFiles);
        } catch (error) {
            console.error("Error fetching files", error);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    return { files, loading, refetch: fetchFiles };
}
