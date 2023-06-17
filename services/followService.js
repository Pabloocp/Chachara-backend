import { Follow } from "../models/follow.js"
import { User } from "../models/user.js"
import paginate from 'mongoose-pagination';

const save = async (data) => {
    return await data.save()
}
const find = async(id,page,ipagen) => await Follow.find({user:id}).populate("user followed", "name nick bio").paginate(page,ipagen)

const findFollowed = async(id,page,ipagen) => await Follow.find({followed:id}).populate("user followed", "name nick bio").paginate(page,ipagen)

const deletefollow = async(userid,myid) =>await Follow.deleteMany({ user: myid, followed: userid })

const followUserIds = async(userID) => {
    //queremos los que seguimos
    let following = await Follow.find({"user":userID}).select({"followed":1,"_id":0});
    
    let followers = await Follow.find({"followed":userID}).select({"user":1,"_id":0});

    //solo queremos array de ids
    let followingClean = []
    following.forEach(follow => {
        if(follow.followed != null) followingClean.push(follow.followed)
    })
    let followersClean = []
    followers.forEach(follow => {
        if(follow.user != null) followersClean.push(follow.user)
        
    })
    return {
        followingClean,
        followersClean
    }
}

const followThisUser = async(userID,profileID) => {
    //sigo a un usuario en concreto
    let following = await Follow.findOne({"user":userID, "followed":profileID})
    
    //si un usuario en concreto me sigue
    let follower = await Follow.findOne({"user":profileID, "followed":userID})

    return{
        following,
        follower
    }
}
export {save,find,deletefollow,followThisUser,followUserIds,findFollowed}