import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import {z} from "zod"
import {usernameValidation} from "@/schemas/signUpSchema"

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

//this is used when the user is typing his username and we are at the same time checking for the uniqueness
//if we call the api multiple times in the frontend there will be issues, so we use debounding techniques

export async function GET(req: Request) {
    await dbConnect();

    try {
        //checking username from url query
        const {searchParams} = new URL(req.url);
        const queryParam = {
            username: searchParams.get("username")
        }
        const result = UsernameQuerySchema.safeParse(queryParam);   
        console.log(result)
        if(!result.success){
            const usernameError = result.error.format().username?._errors || []
            return Response.json({ success: false, message: usernameError?.length > 0 ? usernameError.join(', ') : 'Invalid query parameter'}, { status: 400 });
        }
        const { username } = result.data;

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true });

        if(existingVerifiedUser){
            return Response.json({ success: false, message: "Username already exists" },{ status: 400 });
        }
        return Response.json({ success: true, message: "Username is unique" },{ status: 200 });
    }
    catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}