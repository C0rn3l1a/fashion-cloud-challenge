import moment from 'moment';
import monk, { IMonkManager } from 'monk';

const TTL = process.env.TTL ? parseInt(process.env.TTL) : 60000;
const MAX_ENTRIES = process.env.MAX_ENTRIES ? parseInt(process.env.MAX_ENTRIES) : 4;

export interface Cache {
    _id?: number;
    key: string;
    value: string;
    ttl: Date;
}

export class CacheModel {
    private static db: IMonkManager;

    private static async connect() {
        this.db = monk('localhost/mydb');

        const cache_collection = this.db.get('cache_collection');
        
        // creates index if not exists
        await cache_collection.createIndex('key');
        await cache_collection.createIndex('ttl');

        return cache_collection;
    }

    private static async close() {
        await this.db.close();
    }

    public static async getByKey(key: string): Promise<Cache> {
        try {
            const cache_collection = await this.connect();

            const cache = await cache_collection.findOne({ key })
            await this.close();
            return cache;
        } catch (error) {
            await this.close();
            throw error;
        }
    }
    
    public static async create(key: string, value: string): Promise<Cache> {
        try {
            const cache_collection = await this.connect();

            const count = await cache_collection.count();
            
            if(count >= MAX_ENTRIES) {
                const earliest: Cache = await cache_collection.findOne({},{ sort: { ttl: 1 } });
                await cache_collection.remove({ key: earliest.key });
            }

            const ttl = moment().add(TTL,'milliseconds').toDate();
            const cache = await cache_collection.insert({ key, value, ttl })
            await this.close();
            return cache;
        } catch (error) {
            await this.close();
            throw error;
        }
    }

    public static async update(key: string, value: string): Promise<Cache> {
        try {
            const cache_collection = await this.connect();
            const ttl = moment().add(TTL,'milliseconds').toDate();
            const result = await cache_collection.update({ key }, { $set: { key, value, ttl } });
            await this.close();
            if(result.nModified === 0) {
                const created = await this.create(key, value);
                return { key: created.key, value: created.value, ttl: created.ttl };
            } else {
                return { key, value, ttl };
            }
        } catch (error) {
            await this.close();
            throw error;
        }
    }
    
    public static async getKeys(): Promise<string[]> {
        try {
            const cache_collection = await this.connect();
            const keys = await cache_collection.distinct('key');
            await this.close();
            return keys;
        } catch (error) {
            await this.close();
            throw error;
        }
    }
    
    public static async remove(key: string|{all:boolean}): Promise<number> {
        try {
            const cache_collection = await this.connect();
            let result;
            if(typeof key === 'string') {
                result = await cache_collection.remove({ key });
            } else if(key.all) {
                result = await cache_collection.remove({});
            } else result = { deletedCount: 0 };
            await this.close();
            return result.deletedCount;
        } catch (error) {
            await this.close();
            throw error;
        }
    }
    
    public static async updateTTL(key: string): Promise<void> {
        try {
            const cache_collection = await this.connect();
            await cache_collection.update({ key }, { $set: { ttl: moment().add(TTL,'milliseconds').toDate() } });
            await this.close();
            return;
        } catch (error) {
            await this.close();
            throw error;
        }
    }


}