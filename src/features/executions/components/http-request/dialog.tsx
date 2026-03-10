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

const formSchema = z.object({
    variableName: z.string().min(1, { message: "variable name required" }).regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
        message: "variabel name must start with a letter or underscore and contains only letters,numbers and underscore "
    }),
    endpoint: z.string().min(1,{ message: "Please enter a valid url" }),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    body: z.string().optional()
    // .refine()
})

export type HttpRequestFormValues = z.infer<typeof formSchema>

interface ManualTriggerDialogProp {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: z.infer<typeof formSchema>) => void
    defaultValues?: Partial<HttpRequestFormValues>
}

export const HttpRequestDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues = {}
}: ManualTriggerDialogProp) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues.variableName || "",
            endpoint: defaultValues.endpoint,
            method: defaultValues.method,
            body: defaultValues.body
        }
    })

    useEffect((() => {
        if (open) {
            form.reset({
                variableName: defaultValues.variableName || "",
                endpoint: defaultValues.endpoint,
                method: defaultValues.method,
                body: defaultValues.body
            })
        }
    }), [open, defaultValues, form])

    const watchMethod = form.watch("method")
    const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod)

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
                        Http Request
                    </DialogTitle>
                    <DialogDescription>
                        configure the setting for Http Request node.
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
                                        {`{{${watchVariableName}.httpResponse.data}}`}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Method
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full ">
                                                <SelectValue placeholder="select a method" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        the Http method to use for this request
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField control={form.control}
                            name="endpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        EndPoint URL
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://api.example.com/user/{{httpResponse.data.id}}"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Static URL or use {"{{variables}}"} for
                                        simple values or {"{{json variable}}"} to
                                        stringify objects
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {showBodyField && (
                            <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Request Body
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                className="min-h-[120px] font-mono text-sm"
                                                placeholder={
                                                    '{ "userId": {{httpsResponse.data.Id}},\n "name":{{httpResponse.data.name}},\n "items":{{httpsResponse.data.items}} }'
                                                }
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            JSON with  template variabels, use {"{{variables}}"} for
                                            simple values or {"{{json variable}}"} to
                                            stringify objects
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <DialogFooter className="mt-4">
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    )
}