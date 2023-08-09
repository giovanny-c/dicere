import { Request, Response } from "express"
import container from "tsyringe"

class AuthenticateUserController{

    async handle(req: Request, res: Response){


        const {name, password} = req.body

        const authenticateUser = container.resolve()

        const response = await authenticateUser.execute({name, password})

        req.session.user = response.user
        req.session.created_at = response.created_at

        if(!response.user.admin){
            req.session.cookie.originalMaxAge = 1000 * 60 * 60
        }

        return res.redirect("/")
    }
}