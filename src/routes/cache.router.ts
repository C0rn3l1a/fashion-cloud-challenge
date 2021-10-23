import { Router, Request, Response } from "express";
import { CacheController } from "../controllers/cache.controller";

export const router = Router();

router.get('/', getAll);
router.get('/:key', getOne);
router.post('/', upsertOne);
router.delete('/', removeAll);
router.delete('/:key', removeOne);


function getOne(req: Request, res: Response) {
    if(!req.params.key) throw new Error('no key') // this should never happen
    const cached_key = CacheController.GetByKey(req.params.key);
    res.json(cached_key);
}

function getAll(req: Request, res: Response) {
    res.send({some: 'json'});
}

function upsertOne(req: Request, res: Response) {
    res.send({some: 'json'});
}

function removeAll(req: Request, res: Response) {
    res.send({some: 'json'});
}

function removeOne(req: Request, res: Response) {
    res.send({some: 'json'});
}