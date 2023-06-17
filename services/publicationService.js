import { Publication } from "../models/publication.js"
import paginate from 'mongoose-pagination';

const save = async (data) => {
    return await data.save()
}
const findById = async(id) => await Publication.findById(id)

const findByUserId = async(id,page,itemsPerpage) => await Publication.find({"user":id}).sort("-createdAt").paginate(page,itemsPerpage).populate("user", "name nick image")


const countUserPubli = async(userId) => {
    try {
      const count = await Publication.countDocuments({ "user": userId });
      return count;
    } catch (error) {
      console.error('Error al obtener el número de publicaciones:', error);
      throw error;
    }
  }

const update = async(cond,file) => await Publication.findOneAndUpdate(cond,file)
const deletePubli = async(id,user) =>await Publication.deleteOne({"_id":id,"user":user})

export {save,findById,deletePubli,findByUserId,countUserPubli,update}