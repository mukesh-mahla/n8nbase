import { SignUpForm } from "@/features/auth/components/signup-form"
import { requireUnAuth } from "@/lib/auth-utils"

const Page = async()=>{

    await requireUnAuth()
    return <div>
        <SignUpForm/>
    </div>
}

export default Page