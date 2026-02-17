import { requireAuth } from "@/lib/auth-utils"

const Page = async()=>{
await requireAuth()
    return <p>executons page</p>
}

export default Page