import { db } from "@/src/db";
import { groupsTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest){
    const { params } = await req.json()
    try{
        const squad = await db
                            .select()
                            .from(groupsTable)
                            .limit(1)
                            .where(eq(groupsTable.id, params.squadId))

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