import { connect } from "mongoose";

export default async (): Promise<void> => {
    await connect(process.env.NODE_ENV === 'test' ? process.env.MONGO_DB_URL_TEST : process.env.MONGO_DB_URL, {
        autoIndex: false,
    });
};
