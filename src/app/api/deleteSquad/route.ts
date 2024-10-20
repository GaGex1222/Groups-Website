import { db } from "@/src/db";
import { groupsTable, usersToGroups } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest){
    const {userId, squadId} = await req.json()
    try{
        const squad = await db.select().from(groupsTable).where(eq(groupsTable.id, squadId))
        if(squad.length > 0 && userId === squad[0].ownerId){
            await db.delete(groupsTable).where(eq(groupsTable.id, squadId))
            await db.delete(usersToGroups).where(eq(usersToGroups.squadId, squadId))
        } else {
            return NextResponse.json({ result: "User is not the owner or the squad is not found" }, {status: 500})
        }
        return NextResponse.json({ result: "Success." })
    } catch (error){
        console.log(error)
        return NextResponse.json({ result: "Error Occured, try again later" }, {status: 500})
    }

}