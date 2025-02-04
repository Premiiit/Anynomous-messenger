import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(req: Request){
    await dbConnect()
    try {
        const {username, code} = await req.json();
        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({username: decodedUsername})

        if(!user){
            return Response.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const isCodeVaild = user.verifyCode === code
        const isCodeExpired = new Date() > user.verifyCodeExpiry

        if(isCodeVaild && !isCodeExpired){
            user.isVerified = true;
            await user.save();
            return Response.json({ success: true, message: "User Verified Successfully" }, { status: 200 });
        }else if(isCodeExpired){
            return Response.json({ success: false, message: "Code Expired" }, { status: 400 });
        }else{
            return Response.json({ success: false, message: "Invalid Code" }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "Error Verifying User" }, { status: 500 });
        
    }
}