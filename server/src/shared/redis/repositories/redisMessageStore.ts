import { redisClient } from "../config/redisConfig"
import { Message, RedisUser } from "../dtos/redisDTOs"



class RedisMessageStore {

    saveMessage(message: Message) {

        const value = JSON.stringify(message)

        redisClient
        .multi()
        .rPush(`messages:${message.from}`, value)
        .rPush(`messages:${message.to}`, value)
        .exec()
    }

    async findMessageForUser(user: Pick<RedisUser, "id">){
    
        const messages = await redisClient
        .lRange(`messages:${user.id}`, 0, -1)

        return messages.map((message) => JSON.parse(message)) as Message[]

    }

}

export {RedisMessageStore}