"use server"
import { signIn, auth, signOut } from "@/auth";
import { loginSchema } from "@/schemas/loginSchema";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";
import { registerSchema } from "@/schemas/registerSchema";
import { db } from "@/src/db";
import { usersTable } from "@/src/db/schema";
import { eq } from "drizzle-orm";
const argon2 = require('argon2')


async function login(prevState: unknown, formData: FormData){
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    const submission = parseWithZod(formData, {
        schema: loginSchema
    })
    if(submission.status !== "success"){
        return submission.reply();
    }

    try{
        const result = await signIn("credentials", {
            redirect: false,
            email,
            password
        })
        if (result?.error) {
            console.log(result?.error)
            return {error: "Incorrect credentials"};
        }
    } catch (error) {
        console.log("error occured", error)
        return { error: "Incorrect Credentials" };
    }

    redirect('/')
}

async function register(prevState: unknown, formData: FormData){
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const username = formData.get("username") as string

    const submission = parseWithZod(formData, {
        schema: registerSchema
    })
    if(submission.status !== "success"){
        return submission.reply();
    }
    try{
        const hashedPassword = await argon2.hash(password)
        const emailExists = await db.select().from(usersTable).where(eq(usersTable.email, email as string)).limit(1)
        if (emailExists.length > 0){
            return {
                error: "Email Already Exists, try another one or change password."
            }
        }
        
        // adding user to db
        const inseretedUser = await db.insert(usersTable).values({
            email: email,
            username: username,
            password: hashedPassword
        })
        console.log("insereted", inseretedUser)
    } catch (error){
        console.log("Error occured", error)
        return {
            error: "Error occured, try again later."
        }
    }
    
    redirect('/register-success')
}





export { login, register }