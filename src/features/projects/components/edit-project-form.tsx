'use client';

import { ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Project } from "../types";
import useConfirm from "@/hooks/use-confirm";
import { useDeleteProject } from "../api/use-delete-project";
import { updateProjectSchema } from "../schemas";
import { useUpdateProject } from "../api/use-update-project";
import { toast } from "sonner";

interface EditProjectFormProps {
    onCancel?: () => void;
    initialValues: Project
}

function EditProjectForm({
    onCancel,
    initialValues,
}: EditProjectFormProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { mutate, isPending } = useUpdateProject();
    const { mutate: deleteProject, isPending: isDeletingProject } = useDeleteProject();

    const [DeleteDialog, confirmDelete] = useConfirm(
        "Delete Project",
        "Are you sure you want to delete this Project?",
        "destructive"
    );

    const form = useForm<z.infer<typeof updateProjectSchema>>({
        resolver: zodResolver(updateProjectSchema),
        defaultValues: {
            name: initialValues.name,
            image: initialValues.imageUrl ?? "",
        },
    });

    const handleDelete = async () => {
        const ok = await confirmDelete();
        if (!ok) return;

        deleteProject({
            param: {
                projectId: initialValues.$id
            }
        }, {
            onSuccess: () => {
                window.location.href = `/workspaces/${initialValues.workspaceId}`;
            }
        });
    }

    const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : "",
        }
        mutate({
            form: finalValues,
            param: { projectId: initialValues.$id }
        })
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        const checkSize = (file: File) => {
            if (file.size > 1048576) {
                toast.error("Image size should be less than 1mb");
                return
            }
        }

        if (file) {
            checkSize(file)
            form.setValue("image", file)
        }
    };


    return (
        <div className="flex flex-col gap-y-4">
            <DeleteDialog />
            <Card className="w-full h-full border-none shadow-none">
                <CardHeader className="flex flex-row items-center justify-between gap-x-4 p-7 space-y-0">
                    <CardTitle className="text-xl font-bold">
                        {initialValues.name}
                    </CardTitle>
                    <Button
                        size={"sm"}
                        variant={"secondary"}
                        onClick={
                            onCancel
                                ? onCancel
                                : () => router.push(`/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`)
                        }
                    >
                        <ArrowLeftIcon className="size-4" />
                        back
                    </Button>
                </CardHeader>
                <div className="px-7">
                    <Separator className="h-[1px] border-[1px solid #E5E5E5]" />
                </div>
                <CardContent className="p-7">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => {
                                        return (
                                            <FormItem>
                                                <FormLabel>
                                                    Project
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Project placeholder"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        );
                                    }}
                                />
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field }) => (
                                        <div className="flex gap-y-2 gap-x-5">
                                            <div className="flex items-center gap-x-5">
                                                {field.value ? (
                                                    <div className="size-[72px] relative rounded-md overflow-hidden">
                                                        <Image
                                                            alt="Logo"
                                                            fill
                                                            className="object-cover"
                                                            src={
                                                                field.value instanceof File
                                                                    ? URL.createObjectURL(field.value)
                                                                    : field.value
                                                            }
                                                        />
                                                    </div>
                                                ) : (
                                                    <Avatar className="size-[72px]">
                                                        <AvatarFallback>
                                                            <ImageIcon className="size-[36px] text-neutral-400" />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                )}
                                            </div>
                                            <div className="flex flex-col">
                                                <p className="text-sm">
                                                    Project icon
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    jpg, png, svg, gif,or jpeg max 1mb
                                                </p>
                                                <input
                                                    className="hidden"
                                                    accept=".jpg, .png, .jpeg, .svg, .gif"
                                                    type="file"
                                                    ref={inputRef}
                                                    disabled={
                                                        isPending
                                                    }
                                                    onChange={handleImageChange}
                                                />
                                                {field.value ? (
                                                    <Button
                                                        type="button"
                                                        size="xs"
                                                        variant="destructive"
                                                        className="w-fit mt-2"
                                                        disabled={
                                                            isPending
                                                        }
                                                        onClick={() => {
                                                            field.onChange(null);
                                                            if (inputRef.current) {
                                                                inputRef.current.value = "";
                                                            }
                                                        }}
                                                    >
                                                        remove image
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        size="xs"
                                                        variant="teritary"
                                                        className="w-fit mt-2"
                                                        disabled={
                                                            isPending
                                                        }
                                                        onClick={() => {
                                                            inputRef.current?.click();
                                                        }}
                                                    >
                                                        upload image
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="py-7">
                                <Separator className="h-[1px] border-[1px solid #E5E5E5]" />
                            </div>
                            <div className="flex items-center justify-between">
                                <Button
                                    type="button"
                                    size="lg"
                                    variant="secondary"
                                    disabled={
                                        isPending
                                    }
                                    onClick={onCancel}
                                    className={cn(!!onCancel ? "" : "invisible")}
                                >
                                    cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="lg"
                                    variant="primary"
                                    disabled={
                                        isPending
                                    }
                                >
                                    save changes
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="w-full h-full border-none shadow-none">
                <CardContent className="p-7">
                    <div className="flex flex-col">
                        <h3 className="font-bold">danger zone</h3>
                        <p className="text-sm text-muted-foreground">
                            deleting a Project is irreversible and will delete all associated data
                        </p>
                        <Button
                            className="mt-6 w-fit ml-auto"
                            size={"sm"}
                            variant={"destructive"}
                            type="button"
                            disabled={
                                isPending || isDeletingProject
                            }
                            onClick={handleDelete}
                        >
                            delete Project
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default EditProjectForm;