
const argon2 = require("argon2")
const crypto = require('crypto')
import { RowDataPacket } from "mysql2/promise";
import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google";
import github from "next-auth/providers/github";
import { eq } from "drizzle-orm";
import { db } from "./src/db";
import { groupsTable, usersTable } from "./src/db/schema";
import { InvalidCredentialsError, UserNotFoundError } from "./errors";
import { error } from "console";
import { redirect } from "next/navigation";

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
            const userUsername = userFromDb[0].username
            const userPassword = userFromDb[0].password
            const userEmail = userFromDb[0].email
            const passwordMatch = await argon2.verify(userPassword, password)
            if (passwordMatch) {
              user = {
                username: userUsername as string | null,
                email: userEmail as string | null
              };
              return user;
            } else {
              throw new InvalidCredentialsError("Invalid Credentials!");
            }
          } else {
            throw new UserNotFoundError("No user found with this email");
          }
        } catch (error) {
          console.log("Error at auth" ,error)
          throw error;
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
      
      if (account?.provider === "google" || account?.provider === "github") {
        const email = user.email;

        const username = user.name ? user.name : user.username

        console.log("The Provider is ", account.provider, "The username is ", username)
        
      try{
          const userExists = await db.select().from(usersTable).where(eq(usersTable.email, email as string)).limit(1);
          console.log(userExists)
          if (!userExists.length){
            console.log("Doesnt exist, ill add it now to the db")
            await db.insert(usersTable).values({
              email: email as string,
              username: '',
              password: ''
            })
          }
          const userCreated = await db.select().from(usersTable).where(eq(usersTable.email, email as string)).limit(1);
          if (userCreated[0].username === ''){
            const token = crypto.randomBytes(20).toString('hex')
            await db.update(usersTable).set({usernameToken: token}).where(eq(usersTable.email, email as string))
          }
        } catch (error){
          console.error("Error adding Oauth user to db", error);
          return false;
        }

        
      }
      return true
    },

    async jwt({ token, user, trigger, session }) {
      // Add user info to the token if available
      if (trigger === 'update' && session?.name){
        token.name = session.name;
      }
      if (user) {
        if (user.username || user.name){
          const userEmail = user.email
          const userFromDb = await db.select().from(usersTable).where(eq(usersTable.email, userEmail as string)).limit(1)
          token.name = user.username;
          token.userId = userFromDb[0].id; 
        } 
      }
      return token;
    },
    async session({ session, token }) {
      // Add token info to the session
      const email = session.user.email 
      const user = await db.select({username: usersTable.username}).from(usersTable).where(eq(usersTable.email, email));
      if (user[0].username !== ''){
        console.log("found username, changing from defaukt ", user)
        session.user.name = user[0].username;
      } else {
        console.log("No username found in this email, using defaukt")
        session.user.name = token.name
      }
      session.user.userId = token.userId;
      return session;
    },
  },
})