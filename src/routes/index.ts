import { Router } from "express";
import { router as cache_router } from "./cache.router";

export const router = Router();

// Register different routes
router.use('/cache',cache_router);