import { db } from "@/src/db";
import { groupsTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const { username, squadId } = await req.json();
    const squad = await db.select().from(groupsTable).where(eq(groupsTable.id, squadId))
    const squadPlayers = squad[0].players !== null && JSON.parse(squad[0].players).players
    console.log(squad)
    console.log("username in api", username)
    const isInSquad = squadPlayers.some((player: string) => player === username);
    if (isInSquad) {
        return NextResponse.json({ result: "true"});
    } else {
        return NextResponse.json({ result: "false" });
    }
}