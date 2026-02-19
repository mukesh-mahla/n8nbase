import {useEffect,useState} from "react"
import { PAGINATION } from "@/config/constant"
import { useDayRender } from "react-day-picker";

interface UseEntitySearchProps<T extends {
    search:string
    page:number
}>{
    params:T;
    setParams:(params:T)=>void;
    debounceMs?:number
}

export function UseEntitySearch<T extends{
    search:string
    page:number
}>({
    params,setParams,debounceMs = 500
}: UseEntitySearchProps<T>){
     const [localSearch,setlocalSearch] = useState(params.search)
     useEffect(()=>{
        if(localSearch === "" && params.search !== ""){
            setParams({...params,search:"",
            page:PAGINATION.DEFAULT_PAGE
            });

            return
        }
        const timer = setTimeout(() => {
            if(localSearch !== params.search){
                setParams({
                    ...params,
                    search:localSearch,
                    page:PAGINATION.DEFAULT_PAGE
                })
            }
        }, debounceMs);

        return ()=>clearTimeout(timer)
     },[localSearch,params,setParams,debounceMs])

     useEffect(()=>{
        setlocalSearch(params.search)
     },[params.search])

     return {
        searchValue:localSearch,
        onSearchChange:setlocalSearch
     }
}