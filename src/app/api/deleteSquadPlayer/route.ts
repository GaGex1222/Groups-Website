import { db } from "@/src/db";
import { groupsTable, usersToGroups } from "@/src/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest){
    try{
        const {squadId, userId, userInSquad} = await req.json()
        console.log("userIN SQuad", userInSquad)
        console.log("userIN SQuad", squadId)
        console.log("userIN SQuad", userId)
        if(!userInSquad){
            return NextResponse.json({result: "false", message: "User is not in the squad!"})
        }
        
        await db.delete(usersToGroups).where(and(eq(usersToGroups.userId, userId), eq(usersToGroups.squadId, squadId)))
        
        return NextResponse.json({ result: "true", message: "Removed from squad successfully!" })
    } catch (error) {
        console.log("Error Deleting player From Squad!", error)
        return NextResponse.json({ result: "false", message: "Error completing action, try again later" })
    }
}