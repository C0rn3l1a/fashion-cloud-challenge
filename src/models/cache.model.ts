import monk, { IMonkManager } from 'monk';



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

    public static async getByKey(key: string) {
        const cache_collection = await this.connect();

        try {
            const cache = await cache_collection.findOne({ key })
            return cache;
        } catch (error) {
            console.log({ error });
            return error;
        }
    }
}