import { model, Schema, Types } from 'mongoose';
import { TeamInterface } from './interface';

function omitPrivate(doc, obj) {
    delete obj.__v;
    delete obj.id;
    return obj;
}

const TeamSchema = new Schema<TeamInterface>({
    name: {
        unique: true,
        required: true,
        type: String
    },

    createdBy: {
        required: true,
        type: Types.ObjectId
    }
}, { toJSON: { virtuals: true, transform: omitPrivate } })

TeamSchema.virtual('user', {
    foreignField: '_id',
    localField: 'createdBy',
    ref: 'users',
    justOne: true
})

export const Team = model("teams", TeamSchema);