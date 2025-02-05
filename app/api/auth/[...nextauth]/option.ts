import { NextAuthOptions } from "next-auth";
import Credentials, { CredentialsProvider } from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        Credentials({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await User.findOne({
                        $or: [
                            {email: credentials.email},
                            {username: credentials.username}//may throw an error
                        ]
                    })
                    if (!user) {
                        throw new Error("No user found");
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your email first");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if(isPasswordCorrect){
                        return user;
                    }
                    else{
                        throw new Error("Incorrect password");
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
              }
        })
    ],
    callbacks:{
        async jwt({token, user}){
            if(user){
                    token._id = user._id?.toString()
                    token.isVerified = user.isVerified
                    token.isAcceptingMessage = user.isAcceptingMessage
                    token.username = user.username
            }
            return token
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
                session.user.username = token.username
            }
            return session
        }
    },
    pages: {
        signIn: '/sign-in',//look more into this
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
}