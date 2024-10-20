import { db } from "@/src/db";
import { groupsTable, usersTable, usersToGroups } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest){
    const { params } = await req.json()
    try{
        const squad = await db
                            .select({
                                squad: groupsTable,
                                ownerUsername: usersTable.username
                            })
                            .from(groupsTable)
                            .innerJoin(usersTable, eq(usersTable.id, groupsTable.ownerId))
                            .limit(1)
                            .where(eq(groupsTable.id, params.squadId))
        const players = await db.select().from(usersToGroups).leftJoin(usersTable, eq(usersTable.id, usersToGroups.userId)).where(eq(usersToGroups.squadId ,params.squadId))
        console.log("players", players)
        const playersUsernames: string[] = []
        players.map((player) => {
            playersUsernames.push(player.users?.username as string)
        })
        console.log("Squad" ,squad)
        console.log("sernamearray", playersUsernames)
        if (squad.length < 1){
            return NextResponse.json({
                error: "Couldn't find squad"
            })
        }
        return NextResponse.json({
            squad: squad,
            players: playersUsernames
        })                   
    } catch (error){
        return NextResponse.json({
            error: "Couldn't Fetch Data."
        })
    }
}