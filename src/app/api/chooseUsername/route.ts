import { db } from "@/src/db";
import { groupsTable, usersTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest){
    const {username, email, token} = await req.json()
    try{
        const userToken = await db.select({usernameToken: usersTable.usernameToken}).from(usersTable).where(eq(usersTable.email, email))
        if(userToken[0].usernameToken === token){
            const usernameExists = await db.select().from(usersTable).where(eq(usersTable.username, username))
            if (usernameExists[0]){
                return NextResponse.json({error: "Username Already Exists!"})
            }
            await db.update(usersTable).set({username: username}).where(eq(usersTable.email, email))
            await db.update(usersTable).set({usernameToken: ''}).where(eq(usersTable.email, email))
            return NextResponse.json({result: "success"})
        } else {
            return NextResponse.json({error: "Your session is invalid, try again."})
        }
    } catch (error){
        console.log(error)
        return NextResponse.json({error: "Error occured when trying to change username, try again later."})
    }
}