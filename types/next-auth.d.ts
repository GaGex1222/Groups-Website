import 'next-auth'
import 'next-auth/jwt'


declare module 'next-auth' {
    interface User{
        username: string | null;
        userId: number | null; 
        email: string | null; 
    }

    interface Session {
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        username: string | null
        userId: number | null;
    }
}