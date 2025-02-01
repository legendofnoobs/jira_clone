"use client";
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
import {
    createProjectFormDefaultValues,
    createProjectSchema,
} from "@/features/projects/schemas";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "../api/use-create-project";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { toast } from "sonner";

interface ICreateProjectFormProps {
    onCancel?: () => void;
}

function CreateProjectForm({ onCancel }: ICreateProjectFormProps) {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const { mutate, isPending } = useCreateProject();

    const form = useForm<z.infer<typeof createProjectSchema>>({
        resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
        defaultValues: createProjectFormDefaultValues,
    });

    const onSubmit = (values: z.infer<typeof createProjectSchema>) => {

        mutate(
            {
                form: {
                    ...values,
                    image: values.image instanceof File ? values.image : "",
                    workspaceId,
                },
            },
            {
                onSuccess: ({ data }) => {
                    form.reset();
                    router.push(`/workspaces/${workspaceId}/projects/${data?.$id}`);
                },
            }
        );
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
    }

    return (
        <Card className="w-full h-full border-none shadow-none bg-neutral-900 text-white">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    create new project
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <Separator className="bg-neutral-700"/>
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
                                            <FormLabel>project</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="project placeholder"
                                                    {...field} className="border-neutral-700"
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
                                            <p className="text-sm">project icon</p>
                                            <p className="text-sm text-muted-foreground">
                                                jpg, png, svg, gif, or jpeg max 1mb
                                            </p>
                                            <input
                                                className="hidden"
                                                accept=".jpg, .png, .jpeg, .svg, .gif"
                                                type="file"
                                                ref={inputRef}
                                                disabled={isPending}
                                                onChange={handleImageChange}
                                            />
                                            {field.value ? (
                                                <Button
                                                    type="button"
                                                    size="xs"
                                                    variant="destructive"
                                                    className="w-fit mt-2 border-none"
                                                    disabled={isPending}
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
                                                    className="w-fit mt-2 border-none"
                                                    disabled={isPending}
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
                            <Separator className="bg-neutral-700"/>
                        </div>
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                size="lg"
                                variant="secondary"
                                disabled={isPending}
                                onClick={onCancel}
                                className={cn(!!onCancel ? "" : "invisible border-none")}
                            >
                                cancel
                            </Button>
                            <Button
                                type="submit"
                                size="lg"
                                className="border-none"
                                variant="primary"
                                disabled={isPending}
                            >
                                create project
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

export default CreateProjectForm;