import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
    companyName: string;
    contactName?: string;
    email?: string;
    phone?: string;
    billingStatus: 'active' | 'overdue' | 'inactive';
    billingDueDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
    {
        companyName: {
            type: String,
            required: true,
            trim: true,
        },
        contactName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        billingStatus: {
            type: String,
            enum: ['active', 'overdue', 'inactive'],
            default: 'active',
        },
        billingDueDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
