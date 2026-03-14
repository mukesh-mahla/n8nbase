"use client"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"






const formSchema = z.object({
    variableName: z.string().min(1, { message: "variable name required" }).regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
        message: "variabel name must start with a letter or underscore and contains only letters,numbers and underscore "
    }),
    
    content: z.string().min(1, "content is required"),
    webhookUrl: z.string().min(1, "Webhook URL is required")
})

export type SlackFormValues = z.infer<typeof formSchema>

interface ManualTriggerDialogProp {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: z.infer<typeof formSchema>) => void
    defaultValues?: Partial<SlackFormValues>
}

export const SlackDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {}
}: ManualTriggerDialogProp) => {

  

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            content: defaultValues.content || "",
            webhookUrl: defaultValues.webhookUrl || ""
        }
    })

    useEffect((() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                content: defaultValues.content || "",
                webhookUrl: defaultValues.webhookUrl || ""
            })
        }
    }), [open, defaultValues, form])



    const handelSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values)
        onOpenChange(false)

    }

    const watchVariableName = form.watch("variableName") || "mySlack"
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Slack Configuration
                    </DialogTitle>
                    <DialogDescription>
                        configure the Slack Webhook Settings for this node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handelSubmit)}
                        className="space-y-2"
                    >

                        <FormField control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        variable Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="mySlack"
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
                            name="webhookUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Webhook URL </FormLabel>
                                 <FormControl>
                                    <Input placeholder="https://slack.com/api/webhooks/..." {...field}/>
                                 </FormControl>
                                 <FormDescription>
                                    Get this from Slack: workspace Settings → Workflows → Webhooks 
                                 </FormDescription>
                                 <FormDescription>
                                    Make sure you have "content" variable
                                 </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                     

                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Message Content
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            className="min-h-[80px] font-mono text-sm"
                                            placeholder={
                                                "Summary:{{myGemini.text }}"
                                            }
                                        />
                                    </FormControl>
                                    <FormDescription>
                                       The message to send. use {"{{variables}}"} for simple values or {"{{json variable}}"} to stringfy objects
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