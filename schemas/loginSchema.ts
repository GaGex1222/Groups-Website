import {string, z} from "zod"
export const loginSchema = z.object({
    email: string().email({
        message: "Email is invalid."
    }),
    password: string()
})