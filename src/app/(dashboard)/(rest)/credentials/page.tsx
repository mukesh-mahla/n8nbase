import { CredentialsContainer, CredentialsError, CredentialsList, CredentialsLoading } from "@/features/credentials/components/credentials"
import { credentialParamLoader } from "@/features/credentials/server/param-loader"
import { prefetchCredentials } from "@/features/credentials/server/prefetch"
import { requireAuth } from "@/lib/auth-utils"
import { HydrateClient } from "@/trpc/server"

import { SearchParams } from "nuqs"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

type props={
    searchParams:Promise<SearchParams>
}

const Page = async({searchParams}:props)=>{
await requireAuth()

const params = await credentialParamLoader(searchParams)

prefetchCredentials(params)
    
    return (
        <CredentialsContainer>
        <HydrateClient>
            <ErrorBoundary fallback={<CredentialsError/>}>
             <Suspense fallback={<CredentialsLoading/>}>
               <CredentialsList/>
             </Suspense>
            </ErrorBoundary>
        </HydrateClient>
        </CredentialsContainer>
    )
}

export default Page