import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
    name: string;
    clientId?: {
        companyName: string;
    };
    status: 'planning' | 'active' | 'on_hold' | 'completed';
    priority: 'high' | 'medium' | 'low';
    completionPercent: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        clientId: {
            companyName: { type: String, trim: true }
        },
        status: {
            type: String,
            enum: ['planning', 'active', 'on_hold', 'completed'],
            default: 'planning',
        },
        priority: {
            type: String,
            enum: ['high', 'medium', 'low'],
            default: 'medium',
        },
        completionPercent: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        description: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent overwrite model error in watch/dev environments
export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
