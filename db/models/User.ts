import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
    name: string;
    userId: string;
    password: string;
    role: "admin" | "manager" | "engineer" | "operator";
    created_at: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["admin", "manager", "engineer", "operator"],
        default: "operator",
    },
    created_at: { type: Date, default: Date.now },
});

export default models.User || mongoose.model<IUser>("User", UserSchema);
