import { AuthenticationError, encodeJwt, ExistsError, NotFoundError } from "iyasunday";
import { createUserFunc, UserInterface, userLoginFunc } from "./interface";
import { User } from "./model";
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { comparePassword } from "../../utils";
import { delRedis, getRedis, setRedis } from "../../utils/redis";

async function setUser(userId: any): Promise<UserInterface> {
    try {

        let user = await User.findById(userId);
        if (!user) throw new NotFoundError("User account not found");
        const tokenRef = uuidv4();
        const token = await encodeJwt({
            data: { tokenRef, createdAt: new Date() },
            secreteKey: process.env.APP_KEY,
            duration: process.env.JWT_TOKEN_VALIDITY
        });

        if (await getRedis(tokenRef)) delRedis(tokenRef);
        // SET REDIS HERE
        await setRedis(tokenRef, user);

        user = await User.findByIdAndUpdate(user._id, { $set: { tokenRef } }, { returnOriginal: false }).lean();

        delete user.password;
        user.token = token;

        return user;
    } catch (error) {
        throw error;
    }
}


export const create: createUserFunc = async (body) => {

    let user = await User.findOne({
        $or: [{ username: body.username }, { email: body.email }]
    });

    if (user) {
        if (user.username === body.username) throw new ExistsError(`Username already exist, Please try another username`);
        if (user.email === body.email) throw new ExistsError(`Email already exist, Please try another email`);
    }

    body.password = bcrypt.hashSync(body.password);

    user = await User.create({ ...body })

    return {
        success: true,
        message: `Account created successfully`,
        data: await setUser(user._id)
    }
}

export const login: userLoginFunc = async (body) => {
    try {
        const { password, username } = body;
        let user = await User.findOne({
            $or: [{ username: username }, { email: username }]
        })

        if (!user) throw new NotFoundError(`Account with credentials not found`);

        if (!(await comparePassword(user.password, password))) throw new AuthenticationError(`The password you entered is incorrect`);

        return {
            success: true,
            message: `Login successfull`,
            data: await setUser(user._id)
        }
    } catch (error) {
        throw error;
    }
}