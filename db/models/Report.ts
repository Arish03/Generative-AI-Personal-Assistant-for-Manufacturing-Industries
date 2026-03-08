import mongoose, { Schema, Document, models } from "mongoose";

export interface IReport extends Document {
    report_id: string;
    report_type: "production" | "maintenance" | "efficiency" | "custom";
    generated_by: string;
    created_date: Date;
    report_data: string;
}

const ReportSchema = new Schema<IReport>({
    report_id: { type: String, required: true, unique: true },
    report_type: {
        type: String,
        enum: ["production", "maintenance", "efficiency", "custom"],
        required: true,
    },
    generated_by: { type: String, required: true },
    created_date: { type: Date, default: Date.now },
    report_data: { type: String, required: true },
});

export default models.Report || mongoose.model<IReport>("Report", ReportSchema);
