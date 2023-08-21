import * as redis from "redis"

import "dotenv/config"

const redisClient = redis.createClient({
    
    socket: {
        host: process.env.REDIS_HOST as string,
        port: +(process.env.REDIS_PORT)
    },
    password: process.env.REDIS_PASSWORD as string
})

export {redisClient}