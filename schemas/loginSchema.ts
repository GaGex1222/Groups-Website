import {string, z} from "zod"
export const loginSchema = z.object({
    email: string().email(),
    password: string()
})