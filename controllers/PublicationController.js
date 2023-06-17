import { Publication } from "../models/publication.js"
import { User } from "../models/user.js"
import * as publicatioService from "../services/publicationService.js"
import * as followService from "../services/followService.js"
import * as fs from 'fs';
import * as path from 'path';

const pruebaPubli = (req,res) => {
    return res.status(200).send({
        message: "Mensaje de Publicación"
    })
}

// subir publi
const save = async(req,res) => {
    const params = req.body;
    if(!params.text) return res.status(400).send({status:"error",messsage:"Debes publicar algo"})
    let newPublication = new Publication(params)
    newPublication.user = req.user.id
    try {
        const savedPubli = await publicatioService.save(newPublication);
        return res.status(200).json({ status: "success", message: "Nuevo post subido", savedPubli})
        
      } catch (error) {
        return res.status(400).json({ status: "error", message: "Error al subir la publicación" })
    }  
}

// sacar una publi
const detail = async(req,res) => {
    const id = req.params.id
    try {
        const publication = await publicatioService.findById(id)
        return res.status(200).json({ status: "success", message: "Mostrando publicación", publication})
        
      } catch (error) {
        return res.status(400).json({ status: "error", message: "Error al mostrar la publicación" })
    }  

}

// borrar publi
const remove = async(req,res) => {
    const id = req.params.id
    try {
        //solo podemos eliminar nuestras propias publicaciones
        const publication = await publicatioService.deletePubli(id,req.user.id)
        return res.status(200).json({ status: "success", message:  "Publicación borrada", publication})
        
      } catch (error) {
        return res.status(400).json({ status: "error", message: "Error al borrar la publicación" })
    }  
}

// listar publis de un usuario
const listUserPubli = async(req,res) => {
    const id = req.params.id
    let page = 1
    if(req.params.page){
        page=parseInt(req.params.page)
    }
    let itemsPerpage = 5
    try {
        // vemos si el ID del usuario se corresponde
        const user = await User.findById(id); 
        if (!user) {
          return res.status(404).json({ status: "error", message: "Usuario no encontrado" });
        }
        //solo podemos eliminar nuestras propias publicaciones
        const publication = await publicatioService.findByUserId(id,page,itemsPerpage)
        if(publication.length <= 0){
            return res.status(200).json({ status: "success",user:user ,message:  "No hay publicaciones subidas"})
        }
        const tamaño =  await publicatioService.countUserPubli(id);
        const totalPages = Math.ceil(tamaño / itemsPerpage);
        return res.status(200).json({ status: "success", message:  "Listado de publicaciones de un usuario", publication,user: user,page:page ,totalPub:tamaño,totalPgs:totalPages})
        
      } catch (error) {
        return res.status(400).json({ status: "error", message: "Error al listar las publicaciones del usuario" })
    }  
}

const upload = async (req,res) =>{
    const publID = req.params.id

    if(!req.file){
       return res.status(400).send({ status: "error",message:"la publicación no incluye una imagen"})
    }
    const avatarname = req.file.originalname
    const extension = avatarname.split("\.")[1]
    
    if(extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif" ){
        const filepath = req.file.path
        fs.unlinkSync(filepath)
        res.status(400).send({ status: "error",message:"Extensión del fichero no válida"})
    }

    //pasamos la condicion busqueda y que actualizar
   const updatePubli = await publicatioService.update({"user":req.user.id,"_id":publID},  {file: req.file.filename});
    
    if(updatePubli){
        //buscamos el usuario actualizado en la base de datos
        const updatedPubli = await publicatioService.findById(publID);
        return res.status(200).send({ status: "sucess",message:"Imagen subida",publi:updatedPubli,file:req.file})
    }else{
        return res.status(500).send({ status: "error",message:"Error al subir la imagen"})
    }

  
}

const media = async (req,res) =>{
    const file = req.params.file

    const filePath = "./uploads/publications/"+file
    //comprobar que existe
    fs.stat(filePath , (error,exists) =>{
        if(!exists)  return res.status(404).send({ status: "error",message:"No existe la imagen publicada"})
        
        return res.sendFile(path.resolve(filePath))
    })
    
}

const feed = async (req,res) =>{
    let page = 1
    if(req.params.page){
        page=parseInt(req.params.page)
    }
    let itemsPerpage = 20
    try {
        const myFollows = await followService.followUserIds(req.user.id)
        const publicaciones = await publicatioService.findByUserId(myFollows.followingClean,page,itemsPerpage)
        const tamaño =  await publicatioService.countUserPubli(myFollows.followingClean);
        const totalPages = Math.ceil(tamaño / itemsPerpage);
        return res.status(200).send({ status: "success",message:"Feed de publicaciones",myFollows:myFollows.followingClean,publicaciones:publicaciones,tamaño,totalPages})
        
    } catch (error) {
        return res.status(500).send({ status: "error",message:"No se han listado bien tu feed"})
    }
    

}



export {pruebaPubli,save,detail,remove,listUserPubli,upload,media,feed}