import { db } from "@/src/db";
import { groupsTable, usersToGroups } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest){
    try{
        const {squadId, userId, userInSquad} = await req.json()
        const squadPlayers = await db.select().from(usersToGroups).where(eq(usersToGroups.squadId, squadId))
        const currentSquad = await db.select().from(groupsTable).where(eq(groupsTable.id, squadId))
        
        if (currentSquad[0].maxPlayers === squadPlayers.length){
            return NextResponse.json({result: 'false', message: "Squad Is Full!" })
        }

        if (!userInSquad){
            await db.insert(usersToGroups).values({userId: userId, squadId:squadId})
        } else {
            return NextResponse.json({result: 'false', message: "Already in squad!" })
        }

        return NextResponse.json({result: "true", message: "Successfully Added To Squad"})
    } catch (error) {
        console.log("Error Adding player to Squad!", error)
        return NextResponse.json({ result: "false", message:"Failed to complete action, try again later" })
    }
    // await db.update(groupsTable).set({})
}