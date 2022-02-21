import { Request, Response, NextFunction } from 'express';
import * as services from './service';

export const create = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.status(201).json(await services.create(req.body));
    } catch (error) {
        next(error);
    }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.status(200).json(await services.login(req.body));
    } catch (error) {
        next(error);
    }
}