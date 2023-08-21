


import { Request, Response } from "express"
import {container} from "tsyringe"
import { SendMessageUseCase } from "./SendMessageUseCase"


class SendMessageController {

    async handle(req: Request, res: Response){


        const {message, receiver_id, sender_id} = req.body

        const authenticateUser = container.resolve(SendMessageUseCase)

        const response = await authenticateUser.execute({message, receiver_id, sender_id})

        

        return res.status(201).json({user: response})
    }
}

export {SendMessageController}