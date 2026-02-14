"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {useForm} from "react-hook-form"
import {toast} from "sonner"
import {z} from "zod"
import { Button } from "@/components/ui/button"

import {Card, CardContent, CardDescription,  CardHeader, CardTitle} from "@/components/ui/card"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"

import { authClient } from "@/lib/auth_client"

const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

type LoginFormValues = z.infer<typeof loginFormSchema>  

export function LoginForm(){

    const router = useRouter()
    const form= useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data: LoginFormValues) => {
        await authClient.signIn.email({
          email:data.email,
          password:data.password,
          callbackURL:"/"
        },
        {
          onSuccess:()=>{
            router.push("/")
          },
          onError:(err)=>{
            toast.error(err.error.message)
          }
        }
      )
    }
    const ispending = form.formState.isSubmitting

    return <div className="flex flex-col gap-6">
      <CardHeader className="text-center" >
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Enter your email and password to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
               <div className="grid gap-6">
                  <div className="flex flex-col gap-4">
                    <Button variant="outline" className="w-full" type="button" disabled={ispending}>
                      continue with google
                    </Button>
                    <Button variant="outline" className="w-full" type="button" disabled={ispending}>
                      continue with github
                    </Button>
                  </div>
                  <div className="grif gap-6">
                    <FormField control={form.control} name="email" render={({field})=>(
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    />

                    <FormField control={form.control} name="password" render={({field})=>(
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="••••••••" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    />
                    <Button type="submit" disabled={ispending} className="w-full">Login</Button>
                  </div>
                  <div className="text-center text-sm">
                    Don't have an account?{" "}
                    <Link href="/signup" className="underline underline-offset-4" >
                      Sign up
                    </Link>
                  </div>
               </div>
            </form>
            </Form>
      </CardContent>
    </div>
}