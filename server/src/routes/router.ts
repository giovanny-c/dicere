import { Router } from "express"
import { loginRoutes } from "./login.routes"
import { userRoutes } from "./user.routes"
import { ensureAuthenticated } from "../shared/middlewares/ensureAuthenticated"
const router = Router()

// router.use(limitSessions)


router.get("/", /*ensureAuthenticated,*/ (req, res) => {

    const user = req.user

    return res.render("index", {user: user?.name || "anonymous"})
})

router.use(loginRoutes)

router.use(userRoutes)

export default router