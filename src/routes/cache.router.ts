import { Router, Request, Response, NextFunction } from "express";
import { CacheController } from "../controllers/cache.controller";

export const router = Router();

router.get('/', getAllKeys);
router.get('/:key', getOne);
router.post('/', upsertOne);
router.delete('/', removeAll);
router.delete('/:key', removeOne);


async function getOne(req: Request, res: Response, next: NextFunction) {
    if(!req.params.key) return next(new Error('no key provided')); // this should never happen
    const cached_key = await CacheController.getByKey(req.params.key);
    res.json(cached_key);
}

async function getAllKeys(req: Request, res: Response) {
    const keys = await CacheController.getKeys();
    res.json(keys);
}

async function upsertOne(req: Request, res: Response, next: NextFunction) {
    if(!req.body.key) return next(new Error('no key provided'));
    if(!req.body.value) return next(new Error('no value provided'));
    
    const key = req.body.key;
    const value = req.body.value;

    const updated = await CacheController.upsert(key, value);

    res.json(updated);
}

async function removeAll(req: Request, res: Response, next: NextFunction) {
    const removed = await CacheController.removeAllKeys();
    if(removed) {
        res.json({ removed });
    } else {
        next(new Error('could not remove'));
    }
}

async function removeOne(req: Request, res: Response, next: NextFunction) {
    if(!req.params.key) next(new Error('no key provided')); // this should never happen
    const removed = await CacheController.removeByKey(req.params.key);
    if(removed) {
        res.json();
    } else {
        next(new Error('could not remove'));
    }
}