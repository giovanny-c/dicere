import { redisClient } from "./redisConfig";

redisClient.on("error", (err) => {
    console.log(`Could not establish a connection with redis: ${err}`)
})

redisClient.on("connect", () => {
    console.log("Connected to Redis!")
})

redisClient.connect()