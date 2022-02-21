import { FixtureInterface } from "./interface";
import { Schema, Types, model } from 'mongoose';

export enum STATUS {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED'
}

function omitPrivate(doc, obj) {
    delete obj.__v;
    delete obj.id;
    return obj;
}

const FixtureSchema = new Schema<FixtureInterface>({

    homeTeamId: {
        required: true,
        type: Types.ObjectId
    },

    awayTeamId: {
        required: true,
        type: Types.ObjectId
    },

    status: {
        type: String,
        enum: STATUS,
        default: STATUS.PENDING
    },

    matchDate: {
        required: true,
        type: String
    },

    slug: {
        required: true,
        type: String
    },

    createdBy: {
        unique: true,
        required: true,
        type: Types.ObjectId
    }
}, { toJSON: { virtuals: true, transform: omitPrivate } })

FixtureSchema.virtual('homeTeam', {
    foreignField: '_id',
    localField: 'homeTeamId',
    ref: 'teams',
    justOne: true
});

FixtureSchema.virtual('awayTeam', {
    foreignField: '_id',
    localField: 'awayTeamId',
    ref: 'teams',
    justOne: true
})

export const Fixture = model("fixtures", FixtureSchema);