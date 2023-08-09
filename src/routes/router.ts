import { Router } from "express"
const router = Router()

// router.use(limitSessions)

router.get("/", (req, res) => {
    
    

    return res.send("hello world")
})

export default router