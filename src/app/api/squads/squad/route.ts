import { db } from "@/src/db";
import { groupsTable, usersTable } from "@/src/db/schema";
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
        console.log(squad)
        if (squad.length < 1){
            return NextResponse.json({
                error: "Couldn't find squad"
            })
        }
        return NextResponse.json({
            squad: squad
        })                   
    } catch (error){
        return NextResponse.json({
            error: "Couldn't Fetch Data."
        })
    }
}