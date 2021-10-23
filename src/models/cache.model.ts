import monk, { IMonkManager } from 'monk';

export interface Cache {
    _id: number;
    key: string;
    value: string;
}

export class CacheModel {
    private static db: IMonkManager;

    private static async connect() {
        this.db = monk('localhost/mydb');

        const cache_collection = this.db.get('cache_collection');
        
        // creates index if not exists
        await cache_collection.createIndex('key');

        return cache_collection;
    }

    private static async close() {
        await this.db.close();
    }

    public static async getByKey(key: string): Promise<Cache> {
        const cache_collection = await this.connect();

        try {
            const cache = await cache_collection.findOne({ key })
            await this.close();
            return cache;
        } catch (error) {
            console.log({ error });
            await this.close();
            return null;
        }
    }
    
    public static async create(key: string, value: string): Promise<Cache> {
        const cache_collection = await this.connect();

        try {
            const cache = await cache_collection.insert({ key, value })
            await this.close();
            return cache;
        } catch (error) {
            await this.close();
            console.log({ error });
            return error;
        }
    }

    public static async update(key: string, value: string): Promise<any> {
        const cache_collection = await this.connect();

        try {
            const result = await cache_collection.update({ key }, { $set: { key, value } });
            await this.close();
            if(result.nModified === 0) {
                const created = await this.create(key, value);
                return { key: created.key, value: created.value };
            } else {
                return { key, value };
            }
        } catch (error) {
            await this.close();
            console.log({ error });
            return error;
        }
    }
    
    public static async getKeys(): Promise<string[]> {
        const cache_collection = await this.connect();

        try {
            const keys = await cache_collection.distinct('key');
            await this.close();
            return keys;
        } catch (error) {
            console.log({ error });
            return error;
        }
    }
    
    public static async remove(key: string|{all:boolean}): Promise<number> {
        const cache_collection = await this.connect();

        try {
            let result;
            if(typeof key === 'string') {
                result = await cache_collection.remove({ key });
            } else if(key.all) {
                result = await cache_collection.remove({});
            } else return 0;
            return result.deletedCount;
        } catch (error) {
            console.log({ error });
            return error;
        }
    }
}