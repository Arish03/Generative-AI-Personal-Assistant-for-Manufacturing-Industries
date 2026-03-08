import mongoose, { Schema, Document, models } from "mongoose";

export interface IProduction extends Document {
    production_id: string;
    machine_id: string;
    production_count: number;
    shift: "morning" | "afternoon" | "night";
    timestamp: Date;
}

const ProductionSchema = new Schema<IProduction>({
    production_id: { type: String, required: true, unique: true },
    machine_id: { type: String, required: true },
    production_count: { type: Number, required: true },
    shift: {
        type: String,
        enum: ["morning", "afternoon", "night"],
        required: true,
    },
    timestamp: { type: Date, default: Date.now },
});

export default models.Production || mongoose.model<IProduction>("Production", ProductionSchema);
