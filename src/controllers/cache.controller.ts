import { createRandomString } from "../utils/string";
import { Cache, CacheModel } from "../models/cache.model";


export class CacheController {
    public static async getByKey(key: string): Promise<string> {
        try {
            const cache = await CacheModel.getByKey(key);
            console.log({cache});
            if(cache) {
                // TODO: update TTL
                return cache.value;
            } else {
                const value = createRandomString(20);
                const cache = await CacheModel.create(key, value);
                console.log('created : ',{cache});
                return cache.value;
            }
        } catch (error) {
            console.log('controller',{error});
        }
    }
    
    public static async getKeys(): Promise<string[]> {
        try {
            const keys = await CacheModel.getKeys();
            return keys;
        } catch (error) {
            console.log('controller',{error});
        }
    }
    
    public static async upsert(key: string, value: string): Promise<any> {
        try {
            const updated = await CacheModel.update(key, value);
            return updated;
        } catch (error) {
            console.log('controller',{error});
        }
    }
    
    public static async removeByKey(key: string): Promise<number> {
        try {
            const updated = await CacheModel.remove(key);
            return updated;
        } catch (error) {
            console.log('controller',{error});
        }
    }
    
    public static async removeAllKeys(): Promise<number> {
        try {
            const updated = await CacheModel.remove({ all: true });
            return updated;
        } catch (error) {
            console.log('controller',{error});
        }
    }
}