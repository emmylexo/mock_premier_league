import { model, Schema } from 'mongoose';
import { UserInterface } from './interface';

export enum ROLE {
    ADMIN = 'ADMIN',
    USER = 'USER'
}
const UserSchema = new Schema<UserInterface>({
    username: {
        unique: true,
        required: true,
        type: String
    },

    email: {
        unique: true,
        required: true,
        type: String
    },

    password: {
        unique: true,
        required: true,
        type: String
    },

    role: {
        type: String,
        required: true,
        enum: ROLE,
        default: ROLE.USER
    },

    tokenRef: {
        type: String,
    }
})

export const User = model("users", UserSchema);