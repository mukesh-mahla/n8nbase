import { Connection, Node } from "@prisma/client";
import toposort from "toposort";

export const topologicalSort = (nodes:Node[], connections:Connection[]):Node[]=>{
     
    if(connections.length === 0) return nodes;

    // create a edges array for toposort
    const edges:[string,string][] = connections.map((connecton)=>{
        return [connecton.fromNodeId,connecton.toNodeId]
    })

    // all nodes should be included in the edges array, even if they are not connected to any other node
       const connectedNodeIds = new Set<string>()
       for(const connection of connections){
        connectedNodeIds.add(connection.fromNodeId)
        connectedNodeIds.add(connection.toNodeId)
       }


       for (const node of nodes){
        if(!connectedNodeIds.has(node.id)){
            edges.push([node.id,node.id])
        }
       }

       // topological sort
       let sortedNodeIds:string[] =[]
       try{
        sortedNodeIds = toposort(edges)
        //remove duplicate (form self-edges)
        sortedNodeIds = [...new Set(sortedNodeIds)]
       }catch(error){
        if(error instanceof Error && error.message.includes("Cyclic") ){
            throw new Error("Cyclic dependency detected in workflow")
       }
    }
    // map sorted node ids to node objects
   const nodeMap = new Map(nodes.map((node)=>[node.id,node]))

   return sortedNodeIds.map((nodesId)=>nodeMap.get(nodesId)!).filter(Boolean)

}