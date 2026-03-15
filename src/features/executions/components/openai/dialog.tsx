"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { CredentialType } from "@/../generated/prisma"
import { useCredentialByType } from "@/features/credentials/hooks/use-credntials"
import Image from "next/image"

export const openaiModels = [
    "gpt-5.2",
    "gpt-5-mini",
    "gpt-5-nano",
    "gpt-4.1",
    "gpt-4.1-mini"
] as const

const formSchema = z.object({
    variableName: z.string().min(1, { message: "variable name required" }).regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
        message: "variabel name must start with a letter or underscore and contains only letters,numbers and underscore "
    }),
     credentialId: z.string().min(1, "Credential is Required"),
    model: z.enum(openaiModels),
    systemPrompts: z.string().optional(),
    userPrompt: z.string().min(1, "User Propmt is Required")
    // .refine()
})

export type OpenAiFormValues = z.infer<typeof formSchema>

interface ManualTriggerDialogProp {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: z.infer<typeof formSchema>) => void
    defaultValues?: Partial<OpenAiFormValues>
}

export const OpenAiDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {}
}: ManualTriggerDialogProp) => {
     const { data: credentials, isLoading: isLoadingCredentials } = useCredentialByType(CredentialType.OPENAI)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            credentialId: defaultValues.credentialId || "",
            model: defaultValues.model || openaiModels[0],
            systemPrompts: defaultValues.systemPrompts || "",
            userPrompt: defaultValues.userPrompt || ""
        }
    })

    useEffect((() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                credentialId: defaultValues.credentialId || "",
                model: defaultValues.model || openaiModels[0],
                systemPrompts: defaultValues.systemPrompts || "",
                userPrompt: defaultValues.userPrompt || ""
            })
        }
    }), [open, defaultValues, form])



    const handelSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values)
        onOpenChange(false)

    }
    const watchVariableName = form.watch("variableName") || "MyVariableName"
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        OpenAi Configuration
                    </DialogTitle>
                    <DialogDescription>
                        configure the Ai model and propmpts for this node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handelSubmit)}
                        className="space-y-8 mt-4"
                    >

                        <FormField control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        variable Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="variableName"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        use this name to refernce the result in other nodes:{" "}
                                        {`{{${watchVariableName}.text}}`}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="credentialId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>OpenAi Credentials </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isLoadingCredentials || !credentials?.length}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a Credential" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {credentials?.map((options) => (
                                                <SelectItem
                                                    key={options.id}
                                                    value={options.id}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Image src={"/openai.svg"} alt={"openai"} width={16} height={16} />
                                                        {options.name}
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
                            name="model"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Models
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full ">
                                                <SelectValue placeholder="select a model" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {openaiModels.map((model) =>
                                                <SelectItem key={model} value={model}>{model}</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        the Anthropic model to use for Completion . some model may not work because of your subscription or updates in gemini model
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <FormField
                            control={form.control}
                            name="systemPrompts"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        System Propmt (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            className="min-h-[80px] font-mono text-sm"
                                            placeholder={
                                                "you are a help full assistant"
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        set the behavior of the assistant. use {"{{variabels}}"} for simple values or {"{{json variable}}"} to stringify objects
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="userPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        User Propmt
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            className="min-h-[80px] font-mono text-sm"
                                            placeholder={
                                                "Summarize this text: {{json httpResponse.data}}"
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        the prompt to send to AI. use {"{{variabels}}"} for simple values or {"{{json variable}}"} to stringify objects
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    )
}