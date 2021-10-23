import { Router, Request, Response, NextFunction } from "express";
import { BadRequestError, InternalServerError } from "../utils/error";
import { CacheController } from "../controllers/cache.controller";

export const router = Router();

router.get('/', getAllKeys);
router.get('/:key', getOne);
router.post('/', upsertOne);
router.delete('/', removeAll);
router.delete('/:key', removeOne);


async function getOne(req: Request, res: Response, next: NextFunction) {
    if(!req.params.key) return next(new BadRequestError('no key provided')); // this should never happen
    
    try {
        const cached_key = await CacheController.getByKey(req.params.key);
        res.json(cached_key);
    } catch (error) {
        return next(new InternalServerError(error.message, error));
    }
}

async function getAllKeys(req: Request, res: Response, next: NextFunction) {
    try {
        const keys = await CacheController.getKeys();
        res.json(keys);
    } catch (error) {
        return next(new InternalServerError(error.message, error));
    }
}

async function upsertOne(req: Request, res: Response, next: NextFunction) {
    if(!req.body.key) return next(new BadRequestError('no key provided'));
    if(!req.body.value) return next(new BadRequestError('no value provided'));
    
    const key = req.body.key;
    const value = req.body.value;

    try {
        const updated = await CacheController.upsert(key, value);
        res.json(updated);
    } catch (error) {
        return next(new InternalServerError(error.message, error));
    }

}

async function removeAll(req: Request, res: Response, next: NextFunction) {
    try {
        const removed = await CacheController.removeAllKeys();
        if(removed) {
            res.json({ removed });
        } else {
            next(new InternalServerError('could not remove'));
        }
    } catch (error) {
        return next(new InternalServerError(error.message, error));
    }
}

async function removeOne(req: Request, res: Response, next: NextFunction) {
    if(!req.params.key) next(new BadRequestError('no key provided')); // this should never happen
    try {
        const removed = await CacheController.removeByKey(req.params.key);
        if(removed) {
            res.json();
        } else {
            next(new InternalServerError('could not remove'));
        }
    } catch (error) {
        return next(new InternalServerError(error.message, error));
    }
}