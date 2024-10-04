import { db } from "@/src/db";
import { groupsTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest){
    try{
        const {username, squadId} = await req.json()
        const currentSquad = await db.select().from(groupsTable).where(eq(groupsTable.id, squadId))
        const playersData = currentSquad[0].players;
        const squadPlayers = playersData && JSON.parse(playersData).players 
        const indexOfPlayer = squadPlayers.indexOf(username)
        
        if (indexOfPlayer > -1){
            squadPlayers.splice(indexOfPlayer, 1)
        }

        await db.update(groupsTable).set({
            players: JSON.stringify({ players: squadPlayers })
        }).where(eq(groupsTable.id, squadId))

        return NextResponse.json({result: "true", message: "Successfully deleted from squad!"})
    } catch (error) {
        console.log("Error Deleting player From Squad!", error)
        return NextResponse.json({ result: "false", message: "Error completing action, try again later" })
    }
    // await db.update(groupsTable).set({})
}