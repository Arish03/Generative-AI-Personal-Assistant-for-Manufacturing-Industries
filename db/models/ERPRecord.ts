import mongoose, { Schema, Document, models } from "mongoose";

export interface IERPRecord extends Document {
    order_id: string;
    product: string;
    quantity: number;
    cost: number;
    status: "pending" | "in_progress" | "completed" | "cancelled";
}

const ERPRecordSchema = new Schema<IERPRecord>({
    order_id: { type: String, required: true, unique: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    cost: { type: Number, required: true },
    status: {
        type: String,
        enum: ["pending", "in_progress", "completed", "cancelled"],
        default: "pending",
    },
});

export default models.ERPRecord || mongoose.model<IERPRecord>("ERPRecord", ERPRecordSchema);
