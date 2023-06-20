import * as userService from "../services/userService.js"
import * as followService from "../services/followService.js"
import * as jwt from '../services/jwtService.js'
import bcrypt from "bcrypt";
import * as fs from 'fs';
import * as path from 'path';
import { Follow } from "../models/follow.js";
import { Publication } from "../models/publication.js";

const pruebaUser = (req,res) => {
    return res.status(200).send({
        message: "Mensaje de Usuario",
        usuario:req.user
    })
}

// Registro Usuarios
const signIn = async(req,res) => {
    try {
        const data = req.body
        const userSave = await userService.signIn(data)
        return res.status(200).json({ status: "success", message: "El usuario se ha registrado correctamente " ,user:userSave})
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ status: "error", message: "El usuario ya existe" });
          } else {
            return res.status(400).json({ status: "error", message: "Error en el registro: " + error.message });
          }
    }

}

const logIn = async(req,res) => {
    const {email,password} = req.body
    const userLogged = await userService.findByemail(email)
    if(!userLogged){
        return res.status(400).json({ status: "error", message: "El usuario no existe, registrate primero" })
    }
   
    const validPassword = await userLogged.comparePassword(password)
   
   if(!validPassword){
    return res.status(400).json({ status: "error", message: "Contraseña incorrecta" })
   }
   return res.status(200).json({ status: "success", message: "Log in" , user:{id:userLogged._id,name:userLogged.name,nick:userLogged.nick},token:jwt.createToken(userLogged)})

}

const profile = async (req,res) =>{
    const id = req.params.id;
    const userProfile = await userService.findByIdProfile(id);
    if(!userProfile){
        return res.status(404).send({ status: "error", message: "Usuario no encontrado" })
    }
    //devuelve el objeto follow si nos sigue o le seguimos
    const followInfo = await followService.followThisUser(req.user.id,id)
    return res.status(200).json({ status: "success", user:userProfile, following: followInfo.following,follower: followInfo.follower})

}

const profileNums = async (req,res) =>{
    let id = req.user.id;
    if(req.params.id){
        id= req.params.id
    }

    try {
        const following = await Follow.count({ "user": id})
        const followed = await Follow.count({ "followed": id})
        const publications = await Publication.count({ "user":id })
        return res.status(200).json({ status: "success", following:following,followed:followed,publications:publications})
    } catch (error) {
        return res.status(404).send({ status: "error", message: "Usuario sin datos" })
    }
   
   

}

const list = async (req,res) =>{
    let page = 1
    if(req.params.page){
        page=parseInt(req.params.page)
    }
    let itemsPerpage = 5
   
    const totalUsers = await userService.countUsers();
    const totalPages = Math.ceil(totalUsers / itemsPerpage);
    const userList = await userService.findPage(page,itemsPerpage);
    if(!userList){
        return res.status(404).send({ status: "error", message: "Fallo en el listado de usuarios" })
    }
    const followInfo = await followService.followUserIds(req.user.id)
    res.status(200).send({ status: "success", users:userList,page,itemsPerpage,pages:false,totalUsers,totalPages,  user_following: followInfo.followingClean,
    user_follow_me: followInfo.followersClean})

}

// actualiza el usuario logueado
const update = async (req,res) =>{
    let usertoIdentity = req.user
    let usertoUpdate = req.body
    delete usertoUpdate.iat;
    delete usertoUpdate.exp;
    delete usertoUpdate.role;
    delete usertoUpdate.image;
    const nickExists = await userService.findBynick(usertoUpdate.nick)
    const emailExists = await userService.findByemail(usertoUpdate.email)
    console.log(usertoUpdate.nick)
    console.log(usertoIdentity.nick)
    if(usertoUpdate.nick!=usertoIdentity.nick || usertoUpdate.email!=usertoIdentity.email){
        if(nickExists) return res.status(404).send({ status: "error", message: "Nick no disponible" })
    }
    
    if(usertoUpdate.password){
        let pwd = await bcrypt.hash(usertoUpdate.password,10)
        usertoUpdate.password= pwd
    }else{
        delete usertoUpdate.password
    }
    const update = await userService.update(usertoIdentity.id,usertoUpdate);
    console.log(update)
    if(update){
        return res.status(200).send({ status: "success", user:update ,message:"usuario actualizado"})
    }else{
        return res.status(400).send({ status: "error",message:"error al actualizar usuario"})
    }

}

const upload = async (req,res) =>{

    if(!req.file){
       return res.status(400).send({ status: "error",message:"la petición no incluye una imagen"})
    }
    const avatarname = req.file.originalname
    const extension = avatarname.split("\.")[1]
    
    if(extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif" ){
        const filepath = req.file.path
        fs.unlinkSync(filepath)
        res.status(400).send({ status: "error",message:"Extensión del fichero no válida"})
    }

    const updateUser = await userService.update({_id :req.user.id},  {image: req.file.filename});
    
    if(updateUser){
        //buscamos el usuario actualizado en la base de datos
        const updatedUser = await userService.findById(req.user.id);
        return res.status(200).send({ status: "success",message:"Imagen subida",user:updatedUser})
    }else{
        return res.status(500).send({ status: "error",message:"Error al subir la imagen"})
    }

  
}


const avatar = async (req,res) =>{
    const file = req.params.file

    const filePath = "./uploads/avatars/"+file
    //comprobar que existe
    fs.stat(filePath , (error,exists) =>{
        if(!exists)  return res.status(404).send({ status: "error",message:"No existe la imagen"})
        
        return res.sendFile(path.resolve(filePath))
    })
    
}

export {pruebaUser,signIn,logIn,profile,list,update,upload,avatar,profileNums}