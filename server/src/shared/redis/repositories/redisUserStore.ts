import { redisClient } from "../config/redisConfig"
import { RedisUser, UserNotification } from "../dtos/redisDTOs"



class RedisUserStore {

    async saveUser(user: RedisUser){

        const value = JSON.stringify(user)

        await redisClient.set(`user:${user.id}`, value)

        return user
        
    }

    async findUser(user_id: Pick<RedisUser, "id">){
    
        const user: RedisUser = JSON.parse(await redisClient.get(`user:${user_id}`))

        return user

    }

    async saveUsersNotification(user_id: Pick<RedisUser, "id">, notification: UserNotification){

        const value = JSON.stringify(notification)

        await redisClient.rPush(`notifications:${user_id}`, value)

    }


    async findNotificationsForUser(user_id: Pick<RedisUser, "id">){
    
        const notifications = await redisClient
        .lRange(`notifications:${user_id}`, 0, -1)

        return notifications.map((notification) => JSON.parse(notification)) as UserNotification[]

    }




}

export {RedisUserStore}