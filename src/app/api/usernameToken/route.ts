import { NextRequest, NextResponse } from "next/server"; 
import { db } from "@/src/db";
import { usersTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";


export async function POST(req: NextRequest){
    const {email} = await req.json()
    setTimeout(async () => {
        console.log("Token Expired on username, redirecting to homepage and deleting token", email)
        await db.update(usersTable).set({usernameToken: ''}).where(eq(usersTable.email, email))
      }, 300000);
    console.log("Someone trying to get username token!")
    const user = await db.select().from(usersTable).where(eq(usersTable.email, email as string))
    const usernameToken = user[0].usernameToken
    console.log(email, "Token:", usernameToken)
    if (usernameToken){
        return NextResponse.json({ token: usernameToken })
    } else {
        return NextResponse.json({ token: null })
    }
    


}