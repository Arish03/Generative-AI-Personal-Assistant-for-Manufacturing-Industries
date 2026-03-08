import mongoose, { Document, Schema } from 'mongoose';

export interface ITeam extends Document {
    name: string;
    description?: string;
    leadUserId?: {
        fullName: string;
    };
    memberIds?: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const TeamSchema = new Schema<ITeam>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        leadUserId: {
            fullName: { type: String, trim: true }
        },
        memberIds: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Team || mongoose.model<ITeam>('Team', TeamSchema);
