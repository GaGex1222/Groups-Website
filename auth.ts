
const argon2 = require("argon2")
import { RowDataPacket } from "mysql2/promise";
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google";
import github from "next-auth/providers/github";
import { eq } from "drizzle-orm";
import { db } from "./src/db";
import { usersTable } from "./src/db/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      
      credentials: {
        email: {label: "email"},
        password: {label: "password"}
      },

      authorize: async (credentials) => {
        let user = null;
        const {email, password} = credentials;

        try {
          const userFromDb = await db.select().from(usersTable).where(eq(usersTable.email, email as string)).limit(1)
          if (userFromDb.length > 0) {
            const userId = userFromDb[0].id
            const userUsername = userFromDb[0].username
            const userPassword = userFromDb[0].password
            const userEmail = userFromDb[0].email
            const passwordMatch = await argon2.verify(userPassword, password)
            if (passwordMatch) {
              user = {
                userId: userId,
                username: userUsername as string | null,
                email: userEmail as string | null
              };
              return user;
            } else {
              return null;
            }
          } else {
            return null;
          }
        } catch (error) {
          console.log("Error occured gal:", error)
          return null;
        }
      }
    }),
    Google,
    github


  ],
  pages: {
    signIn: "/login",
    signOut: '/login'
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "Google" || account?.provider === "github") {
        // Get the user's email
        const email = user.email;
        try{
          const userExists = await db.select().from(usersTable).where(eq(usersTable.email, email as string)).limit(1);
          if (!userExists.length){
            await db.insert(usersTable).values({
              email: email as string,
              username: user.name,
              password: ''
            })

          }
        } catch (error){
          console.error("Error adding Oauth user to db", error);
          return false;
        }
      }
      return true
    },

    async jwt({ token, user }) {
      // Add user info to the token if available
      if (user) {
        if (user.username){
          token.name = user.username;
          token.userId = user.userId;
        } 
      }
      return token;
    },
    async session({ session, token }) {
      // Add token info to the session
      session.user.name = token.name || null;  
      session.user.userId = token.userId;
      return session;
    },
  },
})