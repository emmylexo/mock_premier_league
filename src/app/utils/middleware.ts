import { Authentication } from ".";
import { rateLimit } from "express-rate-limit";

export async function guard(req, res, next) {
    try {
        req.user = await Authentication.getUser(req.headers.authorization);
        return next();
    } catch (err) {
        return next(err);
    }
}

export async function AdminGuard(req, res, next) {
    try {
        await Authentication.isAdmin(req.user);
        return next();
    } catch (err) {
        return next(err);
    }
}

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    handler: function (req, res, next) {
        return res.status(429).json({
            status: false,
            message: `Too many request sent, Please wait a while and try again`,
            service: process.env.APP_NAME,
        })
    }
})