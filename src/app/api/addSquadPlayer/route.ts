import { db } from "@/src/db";
import { groupsTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest){
    try{
        const {username, squadId} = await req.json()
        const currentSquad = await db.select().from(groupsTable).where(eq(groupsTable.id, squadId))
        const squadPlayers = currentSquad[0].players !== null && JSON.parse(currentSquad[0].players).players
        const inSquad = squadPlayers.some((player: string) => {player === username})
        if (currentSquad[0].maxPlayers === squadPlayers.length){
            return NextResponse.json({result: 'false', message: "Squad Is Full!" })
        }

        if (!inSquad){
            squadPlayers.push(username)
        } else {
            return NextResponse.json({result: 'false', message: "Already in squad!" })
        }

        await db.update(groupsTable).set({
            players: JSON.stringify({ players: squadPlayers })
        }).where(eq(groupsTable.id, squadId))
        return NextResponse.json({result: "true", message: "Successfully Added To Squad"})
    } catch (error) {
        console.log("Error Adding player to Squad!", error)
        return NextResponse.json({ result: "false", message:"Failed to complete action, try again later" })
    }
    // await db.update(groupsTable).set({})
}