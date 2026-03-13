"use client"
import {formatDistanceToNow } from "date-fns"
import { EmptyView, EntityContainer, EntityHeader, EntityItems, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components"
import {  useRemoveCredential, useSuspanseCredentials } from "../hooks/use-credntials"
import { useRouter } from "next/navigation"
import { useCredentialParams } from "../hooks/use-credential-params"
import { UseEntitySearch } from "../hooks/use-entity-search"
import  type {Credential } from "@prisma/client"

import Image from "next/image"
import {CredentialType} from "@prisma/client"
export const CredentialsSearch = ()=>{
    const [params,setParams] = useCredentialParams()
    const {searchValue,onSearchChange} = UseEntitySearch({
        params,setParams
    })

    return ( <EntitySearch value={searchValue} onChange={onSearchChange} placeholder="search credentials"/>)
}

export const CredentialsList = ()=>{
   
    const credentials = useSuspanseCredentials() 

    return (
        <EntityList items={credentials.data.items} 
        getKey={(credential)=>credential.id}
        renderItem={(credential)=><CredentialItem data={credential}/>}
        emptyView={<CredentialsEmpty/>}
        />
    )
}

export const Credentialsheaders = ({disabled}:{disabled?:boolean})=>{
     
    return (
          
        <EntityHeader title="Credentials"
        description="create and manage your Credentials"
        
        newButtonLabel="New Credentials"
        newButtonHref={"/credentials/new"}
        disabled={disabled}
       
        />
    )
}

export const CredentialsPagination = ()=>{
    const workflows = useSuspanseCredentials()
    const [params,setParams] = useCredentialParams()

    return <EntityPagination  diabled={workflows.isFetching} 
    totalPages={workflows.data.totalPages}
    page={workflows.data.page}
    onPageChange={(page)=>{setParams({...params,page})}}/>
}

export const CredentialsContainer = ({children}:{children:React.ReactNode})=>{
 return (
    <EntityContainer
        header={<Credentialsheaders/>}
        search={<CredentialsSearch/>}
        pagination={<CredentialsPagination/>}
        >
        {children}
    </EntityContainer>
 )
}

export const CredentialsLoading = ()=>{

    return <LoadingView message="Loading Credentials..."/>
}

export const CredentialsError = ()=>{

    return <ErrorView message="Error Loading Credentials..."/>
}

export const CredentialsEmpty = ()=>{
    
    const router = useRouter()
   

    const HandelCreate = ()=>{
       
           
                router.push(`/credentials/new`)
            
        }
    
    return <>
   
    <EmptyView onNew={HandelCreate} message="you haven't created a credentials yet. Get started by creating your first credential"/>
    </>
}

const credentialLogos:Record<CredentialType,string> = {
    [CredentialType.ANTHROPIC]:"/anthropic.svg",
    [CredentialType.GEMINI]:"/gemini.svg",
    [CredentialType.OPENAI]:"/openai.svg"
}

export const CredentialItem = ({data}:{data:Credential})=>{

        const removeCredential = useRemoveCredential()

        const handelRemove = ()=>{
            removeCredential.mutate({id:data.id})
        }
     
         const logos = credentialLogos[data.type] || "/openai.svg"

    return (
        <EntityItems href={`/credentials/${data.id}`}
        title={data.name}
        subtitle={<>
        Update {formatDistanceToNow(data.updatedAt,{addSuffix:true})}{" "}
        &bull; Created{" "}
        {formatDistanceToNow(data.createdAt,{addSuffix:true})}
        </>}
        image={ 
            <div className="size-8 flex items-center justify-center">
                <Image src={logos} alt={data.type} width={20} height={20} />
            </div>
        }
        onRemove={handelRemove}
        isRemoving={removeCredential.isPending}
        ></EntityItems>
    )
}