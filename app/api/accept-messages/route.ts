import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

export async function POST(req: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    const userId = user._id
    const { acceptMessage } = await req.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAcceptingMessage: acceptMessage }, { new: true })
        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "Failed to update user status to accept messages"
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            message: "User status updated to accept messages successfully",
            updatedUser
        },
            { status: 200 }
        )
    } catch (error) {
        console.log("Failed to update user status to accept messages")
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, { status: 500 })
    }
}

export async function GET(req: Request) {
    await dbConnect()
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    const userId = user._id
    try {
        const findUser = await UserModel.findById(userId)
        if (!findUser) {
            return Response.json({
                success: false,
                message: "Failed to find the user"
            }, { status: 404 })
        }

        return Response.json({
            success: true,
            isAcceptingMessages: user.isAcceptingMessage
        },{status: 200})

        
    } catch (error) {
        console.log(error)
        return Response.json({
            success: false,
            message: "Failed to find user accepting message"
        }, { status: 500 })
    }
}