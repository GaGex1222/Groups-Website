import { db } from "@/src/db";
import { groupsTable, usersToGroups } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const {squadId, userId } = await req.json();
    const userInSquad = await db.select().from(usersToGroups).where(and(eq(usersToGroups.userId, userId), eq(usersToGroups.squadId, squadId)))
    console.log("User In Squads", userInSquad)
    if (!userInSquad.length) {
        return NextResponse.json({ result: "false"});
    } else {
        return NextResponse.json({ result: "true" });
    }
}