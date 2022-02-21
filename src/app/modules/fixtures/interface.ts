import { ObjectId } from 'mongoose';

export interface FixtureInterface {
    _id: ObjectId | string;
    homeTeamId: ObjectId | string;
    awayTeamId: ObjectId | string;
    status: string;
    matchDate: string;
    slug: string;
    createdBy: ObjectId | string;
}

interface defaultResponseInterface {
    success: boolean,
    message: string,
    data: FixtureInterface | [FixtureInterface] | unknown
}

export type createFixtureFunction = (
    userId: string,
    body: {
        homeTeamId: string,
        awayTeamId: string,
        status: string,
        matchDate: string
    }
) => Promise<defaultResponseInterface>;

export type listFixtureFunction = (
    query: {
        status: string,
        limit: number,
        page: number
    }
) => Promise<defaultResponseInterface>;

export type viewFixtureFunction = (
    fixtureId: string
) => Promise<defaultResponseInterface>;

export type updateFixtureFunction = (
    fixtureId: string,
    body: {
        homeTeamId: string,
        awayTeamId: string,
        status: string,
        matchDate: string
    }
) => Promise<defaultResponseInterface>;

export type deleteFixtureFunction = (fixtureId: string) => Promise<defaultResponseInterface>