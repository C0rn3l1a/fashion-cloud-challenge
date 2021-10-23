import { createRandomString } from "../utils/string";
import { CacheModel } from "../models/cache.model";
import moment from "moment";
import { logger } from "../utils/log";

const TTL = process.env.TTL ?? 60000;
export class CacheController {
    public static async getByKey(key: string): Promise<string> {
        try {
            const cache = await CacheModel.getByKey(key);
            if(cache) {
                const is_expired = moment(cache.ttl).isBefore(moment());
                if(is_expired) {
                    const updated = await CacheModel.update(key, createRandomString(20));
                    return updated.value;
                } else {
                    await CacheModel.updateTTL(key);
                    return cache.value;
                }
            } else {
                logger.info('Cache miss', { key });
                const value = createRandomString(20);
                const cache = await CacheModel.create(key, value);
                return cache.value;
            }
        } catch (error) {
            logger.error('Failed to get by key', { key, error });
            throw new Error('Failed to get by key');
        }
    }
    
    public static async getKeys(): Promise<string[]> {
        try {
            const keys = await CacheModel.getKeys();
            return keys;
        } catch (error) {
            logger.error('Failed to get all keys', { error });
            throw new Error('Failed to get all keys');
        }
    }
    
    public static async upsert(key: string, value: string): Promise<any> {
        try {
            const updated = await CacheModel.update(key, value);
            return updated;
        } catch (error) {
            logger.error('Failed to update or create', { key, value, error });
            throw new Error('Failed to update or create');
        }
    }
    
    public static async removeByKey(key: string): Promise<number> {
        try {
            const updated = await CacheModel.remove(key);
            return updated;
        } catch (error) {
            logger.error('Failed to remove the key', { key, error });
            throw new Error('Failed to remove the key');
        }
    }
    
    public static async removeAllKeys(): Promise<number> {
        try {
            const updated = await CacheModel.remove({ all: true });
            return updated;
        } catch (error) {
            logger.error('Failed to remove all keys', { error });
            throw new Error('Failed to remove all keys');
        }
    }
}