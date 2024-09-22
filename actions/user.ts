"use server"
import { signIn, auth, signOut } from "@/auth";
import { CredentialsSignin } from "next-auth";
import { loginSchema } from "@/schemas/loginSchema";
import { redirect } from "next/navigation";
import { parseWithZod } from "@conform-to/zod";

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
            return result.error;
        }
    } catch (error) {
        console.log("error occured", error)
        return error;
    }

    redirect('/')
}




export { login }