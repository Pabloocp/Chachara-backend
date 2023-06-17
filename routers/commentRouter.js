import { Router } from "express";
import * as comController from "../controllers/CommentController.js"

const commRouter = Router()

commRouter.get("/prueba-comm",comController.pruebaComment)

export default commRouter