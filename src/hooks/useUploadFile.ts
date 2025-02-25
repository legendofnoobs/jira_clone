import { useState } from "react";
import { storage } from "../lib/appwriteClient";
import { Models } from "node-appwrite";
import { nanoid } from "nanoid"; // Import nanoid for unique short IDs
import { toast } from "sonner";

export function useUploadFile() {
    const [loading, setLoading] = useState(false);

    const uploadFile = async (file: File, projectId: string): Promise<Models.File | null> => {
        setLoading(true);
        try {
            const bucketId = process.env.NEXT_PUBLIC_APPWRITE_FILES_BUCKET_ID;
            if (!bucketId) {
                throw new Error("NEXT_PUBLIC_APPWRITE_FILES_BUCKET_ID is not defined");
            }

            const shortFileId = `${projectId}_${nanoid(10)}`; // Ensures ID is within limit

            const response = await storage.createFile(
                bucketId,
                shortFileId,
                file
            );

            toast.success("Uploaded file")

            return response;
        } catch (error) {
            console.error("Upload failed", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { uploadFile, loading };
}
