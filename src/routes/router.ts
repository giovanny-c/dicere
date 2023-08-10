import { Router } from "express"
import { loginRoutes } from "./login.routes"
const router = Router()

// router.use(limitSessions)


router.get("/", (req, res) => {
    
    return res.send("hello world")
})

router.use(loginRoutes)

export default router