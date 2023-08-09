

import { Request, Response, NextFunction } from "express";

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction){

    if(!req.session || !req.session.user){

        req.session.error = {
            message: "Sessão expirada!",
            status: 401
        }

        return res.redirect("/")

    }


    req.user = {
        id: req.session.user.id,
        name: req.session.user.name,
        admin: req.session.user.admin,

    }

    next()
}