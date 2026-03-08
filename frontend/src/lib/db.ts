import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
import { connectDB } from "@gap/db";

if (!process.env.MONGODB_URI) {
    dotenv.config({ path: path.resolve(process.cwd(), "../backend/.env") });
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && process.env.NODE_ENV !== "production") {
    console.warn("Please define the MONGODB_URI environment variable inside ../backend/.env");
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    // eslint-disable-next-line no-var
    var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
    global.mongooseCache = cached;
}

async function frontendDbConnect(): Promise<typeof mongoose> {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        console.log("🛠️ Attempting to connect to MongoDB URI:", MONGODB_URI ? "Defined (Hidden for security)" : "UNDEFINED");

        // Use connectDB from @gap/db so we share the exact same Mongoose instance as our models!
        cached.promise = connectDB(MONGODB_URI!).then((m) => {
            console.log("✅ Successfully connected via @gap/db instance");
            // `connectDB` returns `mongoose.connection` if already connected, or `typeof mongoose` if fresh.
            // We just return `mongoose` to satisfy the promise type.
            return mongoose;
        }).catch(err => {
            console.error("❌ @gap/db connection failed:", err.message);
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default frontendDbConnect;
