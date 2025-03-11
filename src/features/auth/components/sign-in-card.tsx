"use client";
import React from 'react'

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// import { FaGithub } from "react-icons/fa"
// import { FcGoogle } from "react-icons/fc"

import { loginSchema } from "../schemas"
import { useLogin } from '../api/use-login'

const SignInCard = () => {
    const { mutate, isPending } = useLogin();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    })

    const onSubmit = (values: z.infer<typeof loginSchema>) => {
        mutate({ json: values });
    }

    return (
        <Card className='w-full h-full md:w-[487px] border-none shadow-none bg-neutral-900 text-white'>
            <CardHeader className='flex justify-center items-center text-center p-7'>
                <CardTitle className='text-2xl'>Welcome Back!</CardTitle>
            </CardHeader>
            <div className='px-7'>
                <Separator className='bg-neutral-700'/>
            </div>
            <CardContent className='p-7'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4">
                        <FormField name="email" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type='email'
                                        id="emailInput"
                                        placeholder='Enter email address'
                                        className='border-neutral-700'
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
                                        id="passwordInput"
                                        placeholder='Enter Password'
                                        className='border-neutral-700'
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button className='w-full border-none' disabled={isPending} size={`lg`}>
                            Login
                        </Button>
                    </form>
                </Form>
            </CardContent>
            {/* <div className='px-7'>
                <Separator />
            </div> */}
            {/* <CardContent className='p-7 flex flex-col gap-y-4'>
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

export default SignInCard