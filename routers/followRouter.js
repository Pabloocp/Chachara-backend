import { Router } from "express";
import * as followController from "../controllers/FollowController.js"
import * as check from "../middleware/auth.js"
const followRouter = Router()

followRouter.get("/prueba-follow",followController.pruebaFollow)
followRouter.post("/save",check.auth, followController.save)
followRouter.delete("/unfollow/:id",check.auth, followController.unfollow)
followRouter.get("/following/:id?/:page?",check.auth,followController.following)
followRouter.get("/followers/:id?/:page?",check.auth,followController.followers)

export default followRouter