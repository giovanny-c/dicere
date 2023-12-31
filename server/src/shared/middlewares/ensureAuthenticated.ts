

import { Request, Response, NextFunction } from "express";

export async function ensureAuthenticated(req: Request, res: Response, next: NextFunction){

    if(!req.session || !req.session.user){

        req.session.error = {
            message: "Sessão expirada!",
            status: 401
        }

        return res.status(401).redirect("/entrar")

    }


    //SESSION TIMEOUT - PARA SESSÃO NAO SE ESTENDER INDEFINIDAMENTE
    // const dateProvider = container.resolve(DayjsDateProvider)
    // // 
    // let [amount, time_unit] = String(process.env.ABSOLUTE_SESSION_TIME_OUT).split(" ")
    
    // //data maxima que a sessao pode existir = data de criação + tempo absoluto
    // const absoluteSessionTimeOut = dateProvider.addOrSubtractTime("add", time_unit, Number(amount), req.session.created_at)
    
    // //para nao permitir que e sessao seja prolongada indefinidamente
    // if(!dateProvider.compareIfBefore(dateProvider.dateNow(), absoluteSessionTimeOut)){
    //     req.session.error = {
    //         message: "Sessão expirada, por favor entre de novo.",
    //         status: 401
    //     }
    //     return res.redirect("/entrar")

    // }


    req.user = {
        id: req.session.user.id,
        name: req.session.user.name,
        admin: req.session.user.admin,

    }

    next()
}