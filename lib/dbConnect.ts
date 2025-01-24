import { log } from "console";
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {}

async function dbConnect() {
    if (connection.isConnected) {
        log("Using existing database connection");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
        connection.isConnected = db.connections[0].readyState;
        console.log("Connected to database");
    } catch (error) {
        log("Error connecting to database: ", error);
        process.exit(1);
    }
}

export default dbConnect;