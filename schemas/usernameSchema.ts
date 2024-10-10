import {string, z} from "zod"
export const usernameSchema = z.object({
    username: string().min(4)
})