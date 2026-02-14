import { requireAuth } from "@/lib/auth-utils"
import { caller } from "@/trpc/server"

const Page = async() =>{
 await requireAuth()

 const data = await caller.getUsers()
  return <div className="justify-center items-center flex h-screen w-screen text-center">
    
    <div>
      {JSON.stringify(data)}
   protected server component
   </div>
  </div>

}
export default Page