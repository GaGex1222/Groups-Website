import { db } from "@/src/db";
import { groupsTable } from "@/src/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const {name, game, maxPlayers, date, userId} = await req.json()

    
    try{
        const res = await db.insert(groupsTable).values({
            name: name,
            ownerId: userId,
            maxPlayers: maxPlayers,
            date: date,
            game: game,
            players: JSON.stringify({"players": []})
        })
        return NextResponse.json({ success: true })
    } catch (error){
        console.log("Error occured when trying to add squad to the db", error)
        return NextResponse.json({ success: false })
    }
}