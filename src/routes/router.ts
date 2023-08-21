import { Router } from "express"
import { loginRoutes } from "./login.routes"
import { userRoutes } from "./user.routes"
const router = Router()

// router.use(limitSessions)


router.get("/", (req, res) => {
    
    return res.send("hello world")
})

router.use(loginRoutes)

router.use(userRoutes)

export default router