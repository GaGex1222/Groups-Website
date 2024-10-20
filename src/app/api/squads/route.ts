import { NextRequest } from "next/server";
import { db } from "@/src/db";
import { groupsTable, usersToGroups, usersTable } from "@/src/db/schema";
import { NextResponse } from "next/server";
import { asc, eq, like } from "drizzle-orm";
import { count } from "drizzle-orm";
import { or } from "drizzle-orm";
export async function POST(req: NextRequest){
    const { pageParam, limitParam, searchParam, onlyMySquads, userId } = await req.json();
    let squads: any;
    let squadsCount;
    let maxPages;
    interface SquadPlayers {
        squadId: number,
        players: string[];
    }
    const allPlayers: SquadPlayers[] = []
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
        if (squadsCount){
            maxPages = Math.ceil(squadsCount[0]["count"] / limitParam)
        }
        const fetchAllPlayers = async () => {
            const results = await Promise.all(
                squads.map(async (squad: any) => {
                    const players = await db
                        .select()
                        .from(usersToGroups)
                        .leftJoin(usersTable, eq(usersTable.id, usersToGroups.userId))
                        .where(eq(usersToGroups.squadId, squad.id));
        
                    const usernameOfPlayers: string[] = players.map((player) => player.users?.username as string);
        
                    return {
                        squadId: squad.id,
                        players: usernameOfPlayers,
                    };
                })
            );
        
            results.forEach(result => {
                allPlayers.push(result);
            });
    
        };
        
        await fetchAllPlayers();

        return NextResponse.json({
            squads: squads,
            maxPages: maxPages,
            allPlayers: allPlayers
        })
    } catch (error) {
        console.log("Error when fetching squads:", error)
        return NextResponse.json({error: "Error when fetching squads"});
    }
}