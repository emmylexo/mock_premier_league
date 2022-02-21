import { Request, Response, NextFunction } from 'express';
import * as services from './services';

export const create = async (
    req,
    res: Response,
    next: NextFunction
) => {
    try {
        res.status(201).json(await services.create(req.user._id, req.body));
    } catch (error) {
        next(error);
    }
}

export const list = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.status(200).json(await services.list({ limit: Number(req.query.limit), page: Number(req.query.page) }));
    } catch (error) {
        next(error);
    }
}

export const view = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.status(200).json(await services.view(req.params.teamId));
    } catch (error) {
        next(error);
    }
}

export const update = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.status(200).json(await services.update(req.params.teamId, req.body));
    } catch (error) {
        next(error);
    }
}

export const remove = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.status(200).json(await services.remove(req.params.teamId));
    } catch (error) {
        next(error);
    }
}

export const search = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.status(200).json(await services.search({
            limit: Number(req.query.limit),
            page: Number(req.query.page),
            phrase: req.query.phrase as string,
            status: req.query.status as string
        }));
    } catch (error) {
        next(error);
    }
}