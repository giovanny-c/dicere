interface UserNotification {
    user: {
        id: string,
        name: string,
    }
    quantity: number
}

interface RedisUser {
    id: string,
    name: string,
    admin?: boolean
}


interface Message {
    from: string
    to: string
    message: string
}

export {RedisUser,UserNotification, Message}