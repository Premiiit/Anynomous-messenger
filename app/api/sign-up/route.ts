import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request, res: Response) {
    await dbConnect();

    try {
        const { username, email, password } = await req.json();
    
        const existingUser = await
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "An error occurred" },{ status: 500 });
    }
}