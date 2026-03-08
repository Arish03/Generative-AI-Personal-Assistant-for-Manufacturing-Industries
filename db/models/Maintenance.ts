import mongoose, { Schema, Document, models } from "mongoose";

export interface IMaintenance extends Document {
    maintenance_id: string;
    machine_id: string;
    issue: string;
    maintenance_date: Date;
    technician: string;
}

const MaintenanceSchema = new Schema<IMaintenance>({
    maintenance_id: { type: String, required: true, unique: true },
    machine_id: { type: String, required: true },
    issue: { type: String, required: true },
    maintenance_date: { type: Date, required: true },
    technician: { type: String, required: true },
});

export default models.Maintenance || mongoose.model<IMaintenance>("Maintenance", MaintenanceSchema);
