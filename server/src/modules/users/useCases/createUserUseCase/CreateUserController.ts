
import { Request, Response } from "express"
import {container} from "tsyringe"
import { CreateUserUseCase } from "./CreateUserUseCase"


class CreateUserController {

    async handle(req: Request, res: Response){


        const {name, password, email, admin} = req.body

        const createUser = container.resolve(CreateUserUseCase)

        const response = await createUser.execute({name, email, admin: admin === "true" ? true : false , password})

        

        return res.status(201).redirect("/entrar")
    }
}

export {CreateUserController}