import dbConnect from "@/lib/dbConnect"
import UserModel,{Message} from "@/models/User"

export async function POST(req:Request) {
    await dbConnect()
    const {username, content} = await req.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404})
        }
        if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "User not accepting message"
            }, {status: 403})
        }

        const newMessage = {content, createdAt: new Date()}
        user.message.push(newMessage as Message)//important, see why used 'as Message'
        await user.save()

        return Response.json({
            success: true,
            message: "message sent successfully"
        }, {status: 200})
    } catch (error) {
        console.log("Error adding messages : ", error);
        
        return Response.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }
}