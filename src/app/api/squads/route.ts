import { NextRequest } from "next/server";
import { db } from "@/src/db";
import { groupsTable } from "@/src/db/schema";
import { NextResponse } from "next/server";
import { asc, eq, like } from "drizzle-orm";
import { count } from "drizzle-orm";
import { or } from "drizzle-orm";
export async function POST(req: NextRequest){
    const { pageParam, limitParam, searchParam, onlyMySquads, userId } = await req.json();
    let squads;
    let squadsCount;
    let maxPages;
    try{
        const offset = (pageParam - 1) * limitParam;
        if(searchParam){
            if(onlyMySquads){
                squads = await db
                        .select()
                        .from(groupsTable)
                        .orderBy(asc(groupsTable.id))
                        .where(or(like(groupsTable.game, `%${searchParam}%`), like(groupsTable.name, `%${searchParam}%`), eq(groupsTable.ownerId, userId)))
                        .limit(Number(limitParam))
                        .offset(offset)
                        squadsCount = await db.select({count: count()}).from(groupsTable)
            } else {
                squads = await db
                    .select()
                    .from(groupsTable)
                    .orderBy(asc(groupsTable.id))
                    .where(or(like(groupsTable.game, `%${searchParam}%`), like(groupsTable.name, `%${searchParam}%`)))
                    .limit(Number(limitParam))
                    .offset(offset)
                    squadsCount = await db.select({count: count()}).from(groupsTable).where(or(like(groupsTable.game, `%${searchParam}%`), like(groupsTable.name, `%${searchParam}%`)))
            }
        } else {
            if(onlyMySquads){
                console.log("Searching for squads only user has")
                squads = await db
                        .select()
                        .from(groupsTable)
                        .orderBy(asc(groupsTable.id))
                        .where(eq(groupsTable.ownerId, userId))
                        .limit(Number(limitParam))
                        .offset(offset)
                        squadsCount = await db.select({count: count()}).from(groupsTable).where(eq(groupsTable.ownerId, userId))
            } else {
            squads = await db 
                .select()
                .from(groupsTable)
                .orderBy(asc(groupsTable.id))
                .limit(Number(limitParam))
                .offset(offset);
                squadsCount = await db.select({count: count()}).from(groupsTable)
            }

        }
        console.log("SQUADSSS",squads)
        if (squadsCount){
            console.log("Squds count" ,squadsCount)
            maxPages = Math.ceil(squadsCount[0]["count"] / limitParam)
        }
        console.log("MaxPages", maxPages)
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