import { NextRequest } from "next/server";
import { db } from "@/src/db";
import { groupsTable } from "@/src/db/schema";
import { NextResponse } from "next/server";
import { asc, like } from "drizzle-orm";
import { count } from "drizzle-orm";
import { or } from "drizzle-orm";
export async function POST(req: NextRequest){
    const { pageParam, limitParam, searchParam } = await req.json();
    let squads;
    let squadsCount;
    let maxPages;
    try{
        const offset = (pageParam - 1) * limitParam;
        if(searchParam){
            squads = await db
                    .select()
                    .from(groupsTable)
                    .orderBy(asc(groupsTable.id))
                    .where(or(like(groupsTable.game, `%${searchParam}%`), like(groupsTable.name, `%${searchParam}%`)))
                    .limit(Number(limitParam))
                    .offset(offset)
                    squadsCount = await db.select({count: count()}).from(groupsTable).where(or(like(groupsTable.game, `%${searchParam}%`), like(groupsTable.name, `%${searchParam}%`)))
        } else {
            squads = await db
                .select()
                .from(groupsTable)
                .orderBy(asc(groupsTable.id))
                .limit(Number(limitParam))
                .offset(offset);
                squadsCount = await db.select({count: count()}).from(groupsTable)
        }
        if (squadsCount){
            maxPages = Math.ceil(squadsCount[0]["count"] / limitParam)
        }
        console.log(maxPages)
        return NextResponse.json({
            squads: squads,
            maxPages: maxPages
        })
    } catch (error) {
        console.log("Error when fetching squads:", error)
        return NextResponse.json({error: "Error when fetching squads"});
    }
}