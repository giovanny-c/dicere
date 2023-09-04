import { Router } from "express"

import {AuthenticateUserController} from "../modules/users/useCases/AuthenticateUser/AuthenticateUserController"
import multer from "multer"

const loginRoutes = Router()

const upload = multer()



const authenticateUserController = new AuthenticateUserController()

loginRoutes.get("/entrar", /*handleMessage*/ (req, res) => {

    return res.render("login")
})

//multer?
loginRoutes.post("/sessao", upload.none(), authenticateUserController.handle)

// loginRoutes.get("/sair", ensureAuthenticated, handleMessage, logOutController.handle) //fazer

// loginRoutes.get("/esqueci-a-senha", handleMessage, loadForgotFormController.handle)

// loginRoutes.post("/enviar-email-de-recuperacao", upload.none(), sendForgotPasswordController.handle )

// loginRoutes.get("/recuperar-senha", handleMessage, loadResetPasswordController.handle)
// loginRoutes.post("/recuperar-senha", upload.none(), resetPasswordController.handle)
// //""

export {loginRoutes}