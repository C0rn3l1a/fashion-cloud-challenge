import { createRandomString } from "../utils/string";
import { CacheModel } from "../models/cache.model";


export class CacheController {
    public static async GetByKey(key: string) {
        try {
            const cache = await CacheModel.getByKey(key);
            if(cache) {
                //TODO: update
                return cache;
            } else {
                return createRandomString(20);
            }
        } catch (error) {
            console.log('controller',{error});
        }
    }
}