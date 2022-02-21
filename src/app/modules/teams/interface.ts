import { ObjectId } from 'mongoose';

export interface TeamInterface {
    _id: ObjectId | string;
    name: string;
    createdBy: ObjectId | string;
}

interface defaultResponseInterface {
    success: boolean,
    message: string,
    data: TeamInterface | [TeamInterface] | unknown
}

export type createTeamFunction = (
    userId: string,
    body: {
        name: string
    }
) => Promise<defaultResponseInterface>;

export type listTeamFunction = (
    query: {
        limit: number,
        page: number
    }
) => Promise<defaultResponseInterface>;

export type viewTeamFunction = (
    teamId: string
) => Promise<defaultResponseInterface>;

export type updateTeamFunction = (
    teamId: string,
    body: {
        name: string
    }
) => Promise<defaultResponseInterface>;

export type deleteTeamFunction = (teamId: string) => Promise<defaultResponseInterface>;

export type searchFunction = (
    query: {
        phrase: string,
        status: string
        limit: number,
        page: number
    }
) => Promise<defaultResponseInterface>;