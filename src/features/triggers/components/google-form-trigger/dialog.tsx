"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { generateGoogleFormScript } from "./utils"

interface GoogleFormTriggerDialogProp {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const GoogleFormTriggerDialog = ({ open, onOpenChange }: GoogleFormTriggerDialogProp) => {

    const params = useParams()
    const workflowId = params.workflowId as string

    //  construct the webhook url
    const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const webHookUrl = `${baseURL}/api/webhooks/google-form?workflowId=${workflowId}`
    

    const copyToClipBoard = async () => {
        try {
            await navigator.clipboard.writeText(webHookUrl)
            toast.success("webhook Url copied to clipboard")
        } catch (err) {
            toast.error("failed to copy url")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Google Form Trigger Configuration
                    </DialogTitle>
                    <DialogDescription>
                        Use this webHook URL in your Google Form's App Script to trigger this
                        workflow when a form is submitted
                    </DialogDescription>
                </DialogHeader>
                <div className="sapce-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="webhook-url">
                            WebHook URL
                        </Label>
                        <div className="flex gap-2">
                            <Input
                            id="webhook-url"
                            value={webHookUrl}
                            readOnly
                            className="font-mono text-sm" />

                            <Button type="button" size={"icon"} variant={"outline"} onClick={copyToClipBoard}>
                                <CopyIcon className="size-4" />
                                </Button>
                        </div>
                    </div>
                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Setup instruction:</h4>
                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Open Your Google Form</li>
                            <li>Click the three dots menu → Script editor</li>
                            <li>Copy and paste the script below</li>
                            <li>Replace WEBHOOK_URL with your webhook url above</li>
                            <li>Save and Click "Triggers" → Add Trigger</li>
                            <li>Choose: From form → On form submit → Save</li>
                        </ol>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-3">
                       <h4 className="font-medium text-sm">Google Apps Script:</h4>
                       <Button
                       type="button"
                       variant="outline"
                       onClick={async()=>{
                        const script = generateGoogleFormScript(webHookUrl)
                        try{
                            await navigator.clipboard.writeText(script)
                            toast.success("Script Copied to Clipboard")
                        }catch(err){
                            toast.error("Failed to Copy the Script")
                        }
                       }}
                       >
                         <CopyIcon className="size-4 mr-2"/>
                         Copy Google Apps Script
                       </Button>
                       <p className="text-xs text-muted-foreground">
                        This Script includes your webhook URL and handels form submission
                       </p>
                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Available Variables</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{googleForm.respondentEmail}}"}
                                </code>
                                -Respondent's email
                            </li>
                             <li>
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{googleForm.responses['Question Name']}}"}
                                </code>
                                -Specific answer
                            </li>
                            <li>
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{json googleForm.responses}}"}
                                </code>
                                -All responses as JSON
                            </li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}