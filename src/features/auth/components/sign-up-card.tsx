"use client";
// import { FcGoogle } from "react-icons/fc"
// import { FaGithub } from "react-icons/fa"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from "next/link"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema } from "../schemas"
import { useRegister } from "../api/use-register"


const SignUpCard = () => {
    const { mutate, isPending } = useRegister();

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    })

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        mutate({ json: values })
    }

    return (
        <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
            <CardHeader className='flex justify-center items-center text-center p-7'>
                <CardTitle className='text-2xl'>Sign Up</CardTitle>
                <CardDescription>
                    By signing up, you agree to our {" "}
                    <Link href={`/privacy`}>
                        <span className="text-blue-700">Privacy Policy</span>
                    </Link>{" "} and {" "}
                    <Link href={`/terms`}>
                        <span className="text-blue-700">Terms</span>
                    </Link>

                </CardDescription>
            </CardHeader>
            <div className='px-7'>
                <Separator />
            </div>
            <CardContent className='p-7'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
                        <FormField name="name" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type='text'
                                        placeholder='Enter your name'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="email" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type='email'
                                        placeholder='Enter email address'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField name="password" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type='password'
                                        placeholder='Enter password'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button className='w-full' disabled={isPending} size={`lg`}>
                            Register
                        </Button>
                    </form>
                </Form>
            </CardContent>
            {/* <div className='px-7'>
                <Separator />
            </div>
            <CardContent className='p-7 flex flex-col gap-y-4'>
                <Button className='w-full' variant={`secondary`} size={`lg`} disabled={isPending}>
                    <FcGoogle className="mr-2 size-5" />
                    Login with Google
                </Button>
                <Button className='w-full' variant={`secondary`} size={`lg`} disabled={isPending}>
                    <FaGithub className="mr-2 size-5" />
                    Login with Github
                </Button>
            </CardContent> */}
        </Card>
    )
}

export default SignUpCard