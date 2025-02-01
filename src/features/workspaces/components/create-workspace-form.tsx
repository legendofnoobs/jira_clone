"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useRef } from "react";
import { useForm } from "react-hook-form";
import { createWorkspaceSchema } from "../schemas";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CreateWorkspaceFormProps {
    onCancel?: () => void;
}

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
    const router = useRouter();
    const { mutate, isPending } = useCreateWorkspace();

    const inputRef = useRef<HTMLInputElement>(null)

    const form = useForm<z.infer<typeof createWorkspaceSchema>>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues: {
            name: "",
        }
    })

    const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : "",
        };

        mutate({ form: finalValues }, {
            onSuccess: ({ data }) => {
                form.reset();
                router.push(`/workspaces/${data.$id}`)
            }
        });
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            form.setValue("image", file)
        }
    }

    return (
        <Card className="w-full h-full border-none shadow-none bg-neutral-900 text-white">
            <CardHeader className="flex p-7">
                <CardTitle className="text-xl font-bold">
                    create new workspace
                </CardTitle>
            </CardHeader>
            <div className="px-7">
                <Separator className="bg-neutral-700"/>
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-y-4">
                            <FormField control={form.control} name="name" render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel>
                                            Workspace name
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} type="text" placeholder="Enter workspace name" className="border-neutral-700"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}>
                            </FormField>
                            <FormField control={form.control} name="image" render={({ field }) => (
                                <div className="flex flex-col gap-y-2">
                                    <div className="flex items-center gap-x-5 bg-bl">
                                        {field.value ? (
                                            <div className="size-[72px] relative rounded-md overflow-hidden">
                                                <Image alt="Logo"
                                                    fill
                                                    className=" object-cover"
                                                    src={
                                                        field.value instanceof File
                                                            ? URL.createObjectURL(field.value)
                                                            : field.value
                                                    } />
                                            </div>
                                        ) : (
                                            <Avatar className="size-[72px]">
                                                <AvatarFallback>
                                                    <ImageIcon className="size-[36px] text-neutral-400" />
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className="flex flex-col">
                                            <p className="text-sm">Workspace Icon</p>
                                            <p className="text-sm text-gray-500">JPG, PNG, SVG, OR JPEG, max 1mb</p>
                                            <input
                                                className="hidden"
                                                accept=".jpg, .png, .jpeg, .svg"
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
                                                    variant={`teritary`}
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
                                </div>
                            )}>

                            </FormField>
                        </div>
                        <div className="py-7">
                            <Separator className="bg-neutral-700"/>
                        </div>
                        <div className="flex items-center justify-between">
                            <Button
                                type="button"
                                size={`lg`}
                                variant={`secondary`}
                                onClick={onCancel}
                                disabled={isPending}
                                className={cn(!onCancel && "invisible border-none")}>
                                Cancel
                            </Button>
                            <Button type="submit" className="border-none" size={`lg`} disabled={isPending}>
                                Create Workspace
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}