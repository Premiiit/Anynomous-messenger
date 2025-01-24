import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content : string;  // yaha pe semicolon aata hai
    createdAt : Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    message: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {type: String, required: [true, "Username is required"], trim: true, unique: true},
    email: {type: String, required: [true, "Username is required"], unique: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email"] //not as same as in the video (2nd video 16.51)
    },
    password: {type: String, required: [true, "Password is required"]},
    verifyCode: {type: String, required: [true, "Verify code is required"]},
    verifyCodeExpiry: {type: Date, required: [true, "Verify code expiry is required"]},
    isVerified: {type: Boolean, default: false},
    isAcceptingMessage: {type: Boolean, default: true},
    message: [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;