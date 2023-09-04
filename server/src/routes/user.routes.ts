import { Router } from "express"

import { CreateUserController } from "../modules/users/useCases/createUserUseCase/CreateUserController"
import multer from "multer"
import { SendMessageController } from "../modules/users/useCases/sendMessage/SendMessageController"

const userRoutes = Router()

const upload = multer()

const createUserController = new CreateUserController()
const sendMessageController = new SendMessageController()

userRoutes.get("/cadastrar", (req, res) => {

    return res.render("signin")
})

//multer?
userRoutes.post("/criar", upload.none(), createUserController.handle)

// userRoutes.post("/enviar", upload.none(), sendMessageController.handle)

// loginRoutes.get("/sair", ensureAuthenticated, handleMessage, logOutController.handle) //fazer

// loginRoutes.get("/esqueci-a-senha", handleMessage, loadForgotFormController.handle)

// loginRoutes.post("/enviar-email-de-recuperacao", upload.none(), sendForgotPasswordController.handle )

// loginRoutes.get("/recuperar-senha", handleMessage, loadResetPasswordController.handle)
// loginRoutes.post("/recuperar-senha", upload.none(), resetPasswordController.handle)
// //""

export {userRoutes}