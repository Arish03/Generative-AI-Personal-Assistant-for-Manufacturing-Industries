import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    title: string;
    projectId?: {
        name: string;
    };
    status: 'done' | 'in_progress' | 'todo';
    priority: 'critical' | 'high' | 'medium' | 'low';
    estimatedHours?: number;
    actualHours?: number;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        projectId: {
            name: { type: String, trim: true }
        },
        status: {
            type: String,
            enum: ['done', 'in_progress', 'todo'],
            default: 'todo',
        },
        priority: {
            type: String,
            enum: ['critical', 'high', 'medium', 'low'],
            default: 'medium',
        },
        estimatedHours: {
            type: Number,
            min: 0,
        },
        actualHours: {
            type: Number,
            min: 0,
        },
        completedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
