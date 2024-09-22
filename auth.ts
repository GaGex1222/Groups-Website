
const argon2 = require("argon2")
import { RowDataPacket } from "mysql2/promise";
import connectDb from "./actions/dbConnection";
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

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
        try{
          const {email, password} = credentials;
          if (!email || !password) {
            return null;
          }

          const dbConnection = await connectDb();

          try {
            const [results] = await dbConnection.query<RowDataPacket[]>(
              'SELECT * FROM users WHERE email = ? LIMIT 1',
              [email]
            )
            console.log(results)
            if (results.length > 0) {
              const userUsername = results[0][1]
              const userPassword = results[0][2]
              const userEmail = results[0][3]
              const passwordMatch = await argon2.verify(userPassword, password)
              if (passwordMatch) {
                user = {
                  email: userEmail,
                  username: userUsername
                }
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



        } catch (error){
          console.error("Error Occured:", error)
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: "/login",
    signOut: '/login'
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user info to the token if available
      if (user) {
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      // Add token info to the session
      session.user.username = token.username || null;  
      return session;
    },
  },
})