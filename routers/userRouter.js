import { Router } from "express";
import * as userController from "../controllers/UserController.js"
import * as check from "../middleware/auth.js"
import multer from 'multer';

const userRouter = Router()

// conf subida de multer
const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null, "./uploads/avatars/")
    }, filename : (req,file,cb) =>{
        cb(null, "avatar-"+Date.now()+"-"+file.originalname)
    }

})

const uploads = multer({storage})

userRouter.get("/prueba-user",check.auth,userController.pruebaUser)
userRouter.post("/signIn",userController.signIn)
userRouter.post("/logIn",userController.logIn)
userRouter.get("/profile/:id",check.auth,userController.profile)
userRouter.get("/list/:page?",check.auth,userController.list)
userRouter.put("/update",check.auth,userController.update)
userRouter.post("/upload",[check.auth, uploads.single("file")],userController.upload)
userRouter.get("/avatar/:file",userController.avatar)
userRouter.get("/profileNums/:id",check.auth,userController.profileNums)

export default userRouter