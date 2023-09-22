import { redisClient } from "./redisConfig"


interface message {
    from: string
    to: string
    message: string
}

class RedisMessageSotore {

    saveMessage(message: message) {

        const value = JSON.stringify(message)

        redisClient
        .multi()
        .rPush(`messages:${message.from}`, value)
        .rPush(`messages:${message.to}`, value)
        .exec()
    }

    async findMessageForUser(user_id: string){
    
        const messages = await redisClient
        .lRange(`messages:${user_id}`, 0, -1)

        return messages.map((message) => JSON.parse(message)) as message[]

    }

}

export {RedisMessageSotore}