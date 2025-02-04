import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";
import { log } from "console";

export async function GET(req: Request){
    await dbConnect()
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    //this user._id is in string format and will create problems in mongoose aggregation, therefore convert it to mongoose id
    const userId = new mongoose.Types.ObjectId(user._id)
    //study aggregation pipeline
    try {
        const user = await UserModel.aggregate([
            {$match: {id: userId}},
            {$unwind: '$message'}, //if not working use 'messages'
            {$sort: {'message.createdAt': -1}}, //createdAt property is in message interface
            {$group: {_id: '$_id', messages: {$push: '$message'}}}
        ])

        if(!user || user.length === 0){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 401})
        }

        return Response.json({
            success: true,
            messages: user[0].messages
        }, {status: 200})
    } catch (error) {
        console.log("An unexpected error occured: ", error);
        
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }
}