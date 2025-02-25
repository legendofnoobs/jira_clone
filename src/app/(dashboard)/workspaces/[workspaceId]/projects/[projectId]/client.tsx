"use client"

import ProjectAvatar from '@/features/projects/components/ProjectAvatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PencilIcon } from 'lucide-react';
import { TaskViewSwitcher } from '@/features/tasks/components/task-view-switcher';
import { useProjectId } from '@/features/projects/hooks/use-project-id';
import { PageLoader } from '../../../../../../components/page-loader';
import { PageError } from '@/components/page-error';
import { useGetProject } from '@/features/projects/api/use-get-project';
import { useGetProjectAnalytics } from '@/features/projects/api/use-get-project-analytics';
import { Analytics } from '@/components/analytics';

import { useUploadFile } from "@/hooks/useUploadFile";
import { useFetchFiles } from "@/hooks/useFetchFiles";

export const ProjectIdClient = () => {

    const projectId = useProjectId();
    const { data: project, isLoading: isLoadingProject } = useGetProject({ projectId });
    const { data: analytics, isLoading: isLoadingAnalytics } = useGetProjectAnalytics({ projectId });

    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_FILES_BUCKET_ID;
    if (!bucketId) {
        throw new Error("NEXT_PUBLIC_APPWRITE_FILES_BUCKET_ID is not defined");
    }

    const { uploadFile, loading: uploading } = useUploadFile();
    const { files, loading: fetching } = useFetchFiles(projectId); // Fetch files for this specific project

    const isLoading = isLoadingProject
        || isLoadingAnalytics;

    if (isLoading) {
        return <PageLoader />
    }

    if (!project || !analytics) {
        return <PageError message="Project not found" />
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0 && projectId) {
            await uploadFile(e.target.files[0], projectId); // Upload file with projectId association
        }
    };

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-x-2">
                    <ProjectAvatar
                        image={project.imageUrl}
                        name={project.name}
                        className="size-8"
                    />
                    <p className="text-lg font-bold">
                        {project.name}
                    </p>
                </div>

                <div>
                    <Button
                        variant="secondary"
                        size="sm"
                        asChild
                    >
                        <Link href={`/workspaces/${project?.workspaceId}/projects/${project.$id}/settings`}>
                            <PencilIcon className="size-4 mr-2" />
                            Edit Project
                        </Link>
                    </Button>
                </div>
            </div>

            {analytics ? (
                <Analytics data={analytics} />
            ) : null}

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
                    <ul className="mt-2 grid grid-cols-3 gap-2">
                        {files.map((file) => (
                            <li key={file.$id} className="flex justify-between items-center border p-4 rounded w-96">
                                <p className="truncate">{file.name.replace(`project-${projectId}-`, "")}</p>
                                <a
                                    href={`https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${file.$id}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Download
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>
    )
}