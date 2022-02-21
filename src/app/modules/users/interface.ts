import { ObjectId } from "mongoose";

export interface UserInterface {
    _id: ObjectId | string;
    email: string;
    username: string;
    password: string;
    role: string;
    tokenRef: string;
    token: string;
}

interface defaultResponseInterface {
    success: boolean,
    message: string,
    data: UserInterface | [UserInterface] | unknown
}

export type createUserFunc = (
    body: {
        email: string,
        username: string,
        password: string,
        role: string
    }
) => Promise<defaultResponseInterface>;

export type userLoginFunc = (
    body: {
        username: string,
        password: string
    }
) => Promise<defaultResponseInterface>;