"use client";

import ProjectAvatar from '@/features/projects/components/ProjectAvatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { DownloadCloud, PencilIcon, Trash2 } from 'lucide-react';
import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher';
import { useProjectId } from '@/features/projects/hooks/use-project-id';
import { PageLoader } from '@/components/page-loader';
import { PageError } from '@/components/page-error';
import { useGetProject } from '@/features/projects/api/use-get-project';
import { useGetProjectAnalytics } from '@/features/projects/api/use-get-project-analytics';
import { Analytics } from '@/components/analytics';

import { useUploadFile } from "@/hooks/useUploadFile";
import { useFetchFiles } from "@/hooks/useFetchFiles";
import { FILES_BUCKET_ID } from '@/config';
import { toast } from 'sonner';
import { storage } from '@/lib/appwriteClient';
import useConfirm from "@/hooks/use-confirm"; // Import custom confirmation hook

export const ProjectIdClient = () => {
    const projectId = useProjectId();
    const { data: project, isLoading: isLoadingProject } = useGetProject({ projectId });
    const { data: analytics, isLoading: isLoadingAnalytics } = useGetProjectAnalytics({ projectId });

    const { uploadFile, loading: uploading } = useUploadFile();
    const { files, loading: fetching, refetch } = useFetchFiles(projectId);

    const [ConfirmDialog, confirmAction] = useConfirm("Delete File", "Are you sure you want to delete this file?", "destructive");

    if (isLoadingProject || isLoadingAnalytics) return <PageLoader />;
    if (!project || !analytics) return <PageError message="Project not found" />;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length && projectId) {
            await uploadFile(e.target.files[0], projectId);
            refetch()
        }
    };

    const deleteFile = async (fileId: string) => {
        const confirmed = await confirmAction();
        if (!confirmed) return;

        try {
            const bucketId = process.env.NEXT_PUBLIC_APPWRITE_FILES_BUCKET_ID;
            if (!bucketId) {
                throw new Error("NEXT_PUBLIC_APPWRITE_FILES_BUCKET_ID is not defined");
            }
            await storage.deleteFile(bucketId, fileId);
            toast.success("File deleted");
            refetch()
        } catch (error) {
            console.error("Delete failed", error);
            toast.error("Failed to delete file");
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            <ConfirmDialog />
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <ProjectAvatar image={project.imageUrl} name={project.name} className="size-8" />
                    <p className="text-lg font-bold">{project.name}</p>
                </div>
                <Button variant="secondary" size="sm" asChild>
                    <Link href={`/workspaces/${project.workspaceId}/projects/${project.$id}/settings`}>
                        <PencilIcon className="size-4 mr-2" />
                        Edit Project
                    </Link>
                </Button>
            </div>

            {analytics && <Analytics data={analytics} />}
            <TaskViewSwitcher hideProjectFilter />

            {/* File Upload & Display */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Upload Files for This Project</h2>
                <input type="file" onChange={handleFileChange} disabled={uploading} />
                {uploading && <p>Uploading...</p>}

                <h2 className="mt-4 text-lg font-semibold">Uploaded Files:</h2>
                {fetching ? (
                    <p>Loading files...</p> 
                ) : (
                    <ul className="mt-2 grid md:grid-cols-3 grid-cols-1 gap-4">
                        {files.map((file) => (
                            <li key={file.$id} className="flex justify-between items-center border border-neutral-700 p-4 rounded w-full">
                                <p className="truncate">{file.name}</p>
                                <div className="flex gap-2">
                                    <a
                                        href={`https://cloud.appwrite.io/v1/storage/buckets/${FILES_BUCKET_ID}/files/${file.$id}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                    >
                                        <DownloadCloud className="size-4" />
                                    </a>
                                    <button
                                        onClick={() => deleteFile(file.$id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="size-4" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {files.length === 0 && !fetching && <p>no files uploaded</p>}
            </div>
        </div>
    );
};
