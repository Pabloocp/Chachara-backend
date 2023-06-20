import { Follow } from "../models/follow.js"
import * as followService from "../services/followService.js"
import paginate from 'mongoose-pagination';
const pruebaFollow = (req,res) => {
    return res.status(200).send({
        message: "Mensaje de Follow"
    })
}

const save = async(req,res) => {
    const params = req.body
    const identity = req.user

    if(!params.followed){
        return res.status(400).json({ status: "error", message: "usuario no disponible" })
    }

    let usertoFollow = new Follow(
        {
            user: identity.id,
            followed: params.followed
        }
    )
    try {
        const savedFollow = await followService.save(usertoFollow);
        return res.status(200).json({ status: "success", message: "Seguido" ,identity,params,savedFollow})
        
      } catch (error) {
        return res.status(400).json({ status: "error", message: "Error al seguir a este usuario" })
      }  
 
}

const unfollow = async(req,res) => {
    const paramsid = req.params.id
    const identityID = req.user.id

    try {
        const finded = await followService.deletefollow(paramsid,identityID);
        return res.status(200).json({ status: "success", message: "Ya no sigues a este usaurio" ,finded, identity:req.user})
        
      } catch (error) {
        return res.status(400).json({ status: "error", message: "error" })
      }  
 
}

//usuarios que sigo
const following = async(req,res) => {
    let identityID = req.user.id
    if(req.params.id) identityID=req.params.id
    let page = 1
    if(req.params.page) page=req.params.page
    let itemsPerpage = 10
    try {
        const finded = await followService.find(identityID,page,itemsPerpage);
        const num = await followService.count(identityID);
      
        const followUserIds = await followService.followUserIds(req.user.id)
        return res.status(200).json({ status: "success", 
        message: "La gente que sigo" ,
        finded:finded,
        following:finded.length, 
        identity:req.user,
        num,pages:Math.ceil(num/itemsPerpage),
        user_following: followUserIds.followingClean,
        user_follow_me: followUserIds.followersClean
        })
        
      } catch (error) {
        return res.status(400).json({ status: "error", message: "error" })
    }  
 
    
    
 
}
//usuarios que me siguen
const followers = async(req,res) => {
    let identityID = req.user.id
    if(req.params.id) identityID=req.params.id
    let page = 1
    if(req.params.page) page=req.params.page
    let itemsPerpage = 10
    try {
        const finded = await followService.findFollowed(identityID,page,itemsPerpage);
        const num = await followService.countFollowed(identityID);

        const followUserIds = await followService.followUserIds(req.user.id)
        return res.status(200).json({ status: "success", 
        message: "La gente que me sigue" ,
        finded, 
        followers:finded.length,
        identity:req.user,
        num,pages:Math.ceil(num/itemsPerpage),
        user_following: followUserIds.followingClean,
        user_follow_me: followUserIds.followersClean
        })
        
      } catch (error) {
        return res.status(400).json({ status: "error", message: "error" })
    }  
 
 
}

export {pruebaFollow,save,unfollow,followers,following}