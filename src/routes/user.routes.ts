import { Router } from "express"

import { CreateUserController } from "../modules/users/useCases/createUserUseCase/CreateUserController"
import multer from "multer"

const userRoutes = Router()

const upload = multer()

const createUserController = new CreateUserController()


// loginRoutes.get("/entrar", handleMessage, loadLoginPageController.handle)

//multer?
userRoutes.post("/criar", upload.none(), createUserController.handle)

// loginRoutes.get("/sair", ensureAuthenticated, handleMessage, logOutController.handle) //fazer

// loginRoutes.get("/esqueci-a-senha", handleMessage, loadForgotFormController.handle)

// loginRoutes.post("/enviar-email-de-recuperacao", upload.none(), sendForgotPasswordController.handle )

// loginRoutes.get("/recuperar-senha", handleMessage, loadResetPasswordController.handle)
// loginRoutes.post("/recuperar-senha", upload.none(), resetPasswordController.handle)
// //""

export {userRoutes}