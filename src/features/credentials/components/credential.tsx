"use client"

import { CredentialType } from "@/../generated/prisma"
import Image from "next/image"

import { useCreateCredential, useUpdateCredential, useSuspanseCredential } from "../hooks/use-credntials"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import z from "zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import Link from "next/link"



const formSchema = z.object({
    name: z.string().min(1, "name is required"),
    type: z.enum(CredentialType),
    value: z.string().min(1, "API key is required")
})

type FormValues = z.infer<typeof formSchema>

const credentialTypeOptions = [
    {
        value: CredentialType.OPENAI,
        lable: "OPENAI",
        logo: "/openai.svg"
    },
    {
        value: CredentialType.ANTHROPIC,
        lable: "ANTHROPIC",
        logo: "/anthropic.svg"
    },
    {
        value: CredentialType.GEMINI,
        lable: "GEMINI",
        logo: "/gemini.svg"
    }

]

interface CredentialFormProps {
    initialData?: {
        id?: string
        name: string
        type: CredentialType
        value: string
    }
}

export const CredentialForm = ({ initialData }: CredentialFormProps) => {
    
    const createCredential = useCreateCredential()
    const updateCredential = useUpdateCredential()
    const { handelError, modal } = useUpgradeModal()

    const isEdit = !!initialData?.id
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            type: CredentialType.OPENAI,
            value: ""
        }
    })

    const onSubmit = async (values: FormValues) => {
        if (isEdit && initialData?.id) {
            await updateCredential.mutateAsync({
                id: initialData.id,
                ...values
            })
        } else {
            await createCredential.mutateAsync(values, {
                onError: (err) => {
                    handelError(err)
                }
            })
        }
    }
    return (
        <>
            {modal}
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle>
                        {isEdit ? "Edit Credential" : "Create Credential"}
                    </CardTitle>
                    <CardDescription>
                        {isEdit ?
                            "Update your API key or credential details"
                            :
                            "Add a New API key or Credential To Your Account"
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit( onSubmit )} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel> Name </FormLabel>
                                        <FormControl>
                                            <Input placeholder="My API key" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel> Type </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {credentialTypeOptions.map((options) => (
                                                    <SelectItem
                                                        key={options.value}
                                                        value={options.value}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <Image src={options.logo} alt={options.lable} width={16} height={16} />
                                                            {options.lable}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel> API Key </FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="sk-..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-4 ">
                                <Button
                                    type="submit"
                                    disabled={
                                        createCredential.isPending ||
                                        updateCredential.isPending
                                    }
                                >
                                    {isEdit ? "Update" : "Create"}
                                </Button>
                                <Button
                                    type="button"
                                    variant={"outline"}
                                    asChild
                                >
                                    <Link href={"/credentials"} prefetch>Cancel</Link> 
                                </Button>

                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>)
}

export const CredentialView = ({credentialId}:{credentialId:string})=>{
  
    const {data:credential} = useSuspanseCredential(credentialId)

return <CredentialForm initialData={credential}/>
}