import { Router } from "express";
import * as publiController from "../controllers/PublicationController.js"
import * as check from "../middleware/auth.js"
import multer from 'multer';

// conf subida de multer
const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null, "./uploads/publications/")
    }, filename : (req,file,cb) =>{
        cb(null, "pub-"+Date.now()+"-"+file.originalname)
    }

})

const uploads = multer({storage})

const publiRouter = Router()

publiRouter.get("/prueba-publi",publiController.pruebaPubli)
publiRouter.post("/save",check.auth,publiController.save)
publiRouter.get("/detail/:id",check.auth,publiController.detail)
publiRouter.delete("/remove/:id",check.auth,publiController.remove)
publiRouter.get("/user/:id/:page?",check.auth,publiController.listUserPubli)
publiRouter.post("/upload/:id",[check.auth,uploads.single("file")],publiController.upload)
publiRouter.get("/media/:file",publiController.media)
publiRouter.get("/feed/:page?",check.auth,publiController.feed)

export default publiRouter