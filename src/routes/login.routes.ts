import { Router } from "express"


const loginRoutes = Router()

import {AuthenticateUserController} from "../modules/users/useCases/AuthenticateUserController"


const authenticateUserController = new AuthenticateUserController()

// loginRoutes.get("/entrar", handleMessage, loadLoginPageController.handle)

//multer?
loginRoutes.post("/sessao", authenticateUserController.handle)

// loginRoutes.get("/sair", ensureAuthenticated, handleMessage, logOutController.handle) //fazer

// loginRoutes.get("/esqueci-a-senha", handleMessage, loadForgotFormController.handle)

// loginRoutes.post("/enviar-email-de-recuperacao", upload.none(), sendForgotPasswordController.handle )

// loginRoutes.get("/recuperar-senha", handleMessage, loadResetPasswordController.handle)
// loginRoutes.post("/recuperar-senha", upload.none(), resetPasswordController.handle)
// //""

export {loginRoutes}