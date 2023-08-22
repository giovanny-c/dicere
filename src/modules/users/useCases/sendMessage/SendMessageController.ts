


import { Request, Response } from "express"
import {container} from "tsyringe"
import { SendMessageUseCase } from "./SendMessageUseCase"


class SendMessageController {

    async handle(req: Request, res: Response){


        const {message, receiver_id, sender_id} = req.body

        const sendMessage = container.resolve(SendMessageUseCase)

        await sendMessage.execute({message, receiver_id, sender_id})

        

        return res.status(200).send()
    }
}

export {SendMessageController}