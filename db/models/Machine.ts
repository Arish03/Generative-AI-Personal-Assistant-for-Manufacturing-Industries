import mongoose, { Schema, Document, models } from "mongoose";

export interface IMachine extends Document {
    machine_id: string;
    machine_name: string;
    machine_type: string;
    location: string;
    status: "running" | "idle" | "maintenance" | "offline";
}

const MachineSchema = new Schema<IMachine>({
    machine_id: { type: String, required: true, unique: true },
    machine_name: { type: String, required: true },
    machine_type: { type: String, required: true },
    location: { type: String, required: true },
    status: {
        type: String,
        enum: ["running", "idle", "maintenance", "offline"],
        default: "idle",
    },
});

export default models.Machine || mongoose.model<IMachine>("Machine", MachineSchema);
