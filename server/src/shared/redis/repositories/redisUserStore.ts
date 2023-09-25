import { redisClient } from "../config/redisConfig"
import { RedisUser, UserNotification } from "../dtos/redisDTOs"



class RedisUserStore {

    async saveUser(user: RedisUser){

        const value = JSON.stringify(user)

        await redisClient.set(`user:${user.id}`, value)

        return user
        
    }

    async findUser(user: Pick<RedisUser, "id">){
    
        return JSON.parse(await redisClient.get(`user:${user.id}`))

        

    }

    async addUserNotification(user: Pick<RedisUser, "id">, notification: UserNotification){

        const value = JSON.stringify(notification)

        await redisClient.rPush(`notifications:${user.id}`, value)

    }

    async removeUserNotification(user: Pick<RedisUser, "id">, notification: UserNotification){

        const value = JSON.stringify(notification)

        redisClient.lRem(`notifications:${user.id}`, 0, value)
    }

    async findNotificationsForUser(user: Pick<RedisUser, "id">){
    
        const notifications = await redisClient
        .lRange(`notifications:${user.id}`, 0, -1)

        return notifications.map((notification) => JSON.parse(notification)) as UserNotification[]

    }

    




}

export {RedisUserStore}