import {number, string, z} from "zod"

export const createSquadSchema = z.object({
    name: string().min(0).optional(),
    game: string(),
    maxPlayers: number().min(1),
    date: string(),
})