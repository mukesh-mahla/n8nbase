import { requireAuth } from "@/lib/auth-utils"

const Page = async()=>{
await requireAuth()
    return <p>credential page</p>
}

export default Page