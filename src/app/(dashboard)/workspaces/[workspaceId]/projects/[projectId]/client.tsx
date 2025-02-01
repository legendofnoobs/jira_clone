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
// import { Analytics } from '@/components/analytics';

export const ProjectIdClient = () => {

    const projectId = useProjectId();
    const { data: project, isLoading: isLoadingProject } = useGetProject({ projectId });
    const { data: analytics, isLoading: isLoadingAnalytics } = useGetProjectAnalytics({ projectId });

    const isLoading = isLoadingProject 
    || isLoadingAnalytics;

    if (isLoading) {
        return <PageLoader />
    }

    if (!project || !analytics) {
        return <PageError message="Project not found" />
    }

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

        </div>
    )
}