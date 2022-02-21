import bcrypt from 'bcryptjs';
import { AuthenticationError, AuthorizationError, decodeJwt, InvalidTokenError, slugify } from 'iyasunday';
import { UserInterface } from '../modules/users/interface';
import { ROLE } from '../modules/users/model';
import { getRedis } from './redis';
import moment from 'moment';

export const comparePassword = async (hash: string, password: string): Promise<boolean> => {
    try {
        return await bcrypt.compare(password, hash);
    } catch (err) {
        throw err;
    }
}

export const Authentication = {
    getUser: async (token: string) => {
        if (!token) throw new AuthenticationError("Kindly login to continue");
        token = token.split(" ").pop();

        const { tokenRef = undefined } = await decodeJwt(token, process.env.APP_KEY);
        if (!tokenRef) throw new InvalidTokenError("Supplied token not valid");
        const user = await getRedis(tokenRef, true);
        if (!user) throw new AuthenticationError("Session expired, Please login");
        if (!user.token) user.token = token;
        return user;
    },

    isAdmin: async (user: UserInterface) => {
        if (user.role !== ROLE.ADMIN) throw new AuthorizationError(`This action is restricted to only admins`);
        return true;
    }
}

export const generateString = async (homeTeamName: string, awayTeamName: string, matchDate: string): Promise<string> => {
    try {
        const stringDate = moment(matchDate).format('YYYY-MM-DD').toString();
        const string = `${homeTeamName}-vs-${awayTeamName}-${stringDate}`;
        return slugify(string, true);
    } catch (err) {
        throw err;
    }
}