const {createClient} = require('redis');

module.exports = class RedisHelper {

    static get EXPIRE_TIME () {
        return 86400;
    }

    static async initialize () {
        this._redisClient =  createClient();
        await this._redisClient.connect();
    }

    static async get(key){
        const val =  await this._redisClient.hGetAll(key);
        return Object.keys(val).length===0 ? null : val;
    }

    static async set(key, val){
        const presentTTL = await this._redisClient.ttl(key);
        if(presentTTL>0){
            await this._redisClient.hSet(key, val);
            await this._redisClient.expire(key, presentTTL);
        }else{
            await this._redisClient.hSet(key, val);
            await this._redisClient.expire(key, this.EXPIRE_TIME);
        }
    }

    static async del(key){
        await this._redisClient.del(key);
    }
}