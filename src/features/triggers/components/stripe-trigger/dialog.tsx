"use client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CopyIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { toast } from "sonner"


interface StripeTriggerDialogProp {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export const StripeTriggerDialog = ({ open, onOpenChange }: StripeTriggerDialogProp) => {

    const params = useParams()
    const workflowId = params.workflowId as string

    //  construct the webhook url
    const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const webHookUrl = `${baseURL}/api/webhooks/stripe?workflowId=${workflowId}`
    

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
                        Stripe Trigger Configuration
                    </DialogTitle>
                    <DialogDescription>
                        Configure this webHook url in your Stripe DashBoard to trigger this workflow on payment events 
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
                            <li>Open Your Stripe DashBoard</li>
                            <li>Go to developers → Webhooks </li>
                            <li>Click "add endpoint"</li>
                            <li>paste the  webhook url above</li>
                            <li>select events to listen for (e.g., 
                                payment_intent.succeeded
                            </li>
                            <li>save and copy the signin secret</li>
                        </ol>
                    </div>

                    

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Available Variables</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                           <li><code className="bg-backgrount px-1 py-0.5 rounded ">{"{{stripe.amount}}"}
                            </code>- payment amount</li>
                            <li><code className="bg-backgrount px-1 py-0.5 rounded ">{"{{stripe.currency}}"}
                            </code>- Currency code</li>
                             <li><code className="bg-backgrount px-1 py-0.5 rounded ">{"{{stripe.customeId}}"}
                            </code>- Customer ID</li>
                            <li><code className="bg-backgrount px-1 py-0.5 rounded ">{"{{json stripe}}"}
                            </code>- full event data as json</li>
                            <li><code className="bg-backgrount px-1 py-0.5 rounded ">{"{{stripe.eventType}}"}
                            </code>- Event type (e.g., payment_intent.succeeded</li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}