import { z } from "zod"

export const registerSchema = z.object({
    email: z.string().email({
        message: "Email is invalid."
    }),
    username: z.string().min(4, {
        message: "Username has to be at least 4 letters."
    }),
    password: z.string().min(8, {
        message: "Password has to be 8 letters."
    })
})
