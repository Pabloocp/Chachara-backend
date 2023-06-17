import { User } from "../models/user.js"
import paginate from 'mongoose-pagination';
//desacomplamos las funciones de bbdd del index

const findAll = async() => await User.find()

const findPage = async(page,itemsPerpage) => await User.find().sort('_id').paginate(page,itemsPerpage).select("name surname nick image createdAt")

const countUsers = async () => {
  try {
    const count = await User.countDocuments();
    return count;
  } catch (error) {
    throw new Error('Error al contar los usuarios');
  }
};
const findById = async(id) => await User.findById(id)

const findByIdProfile = async (id) => {
    return await User.findById(id).select("-rol -email");
  };

const findByemail = async(e) => await User.findOne({email:e}).select('+password')

const findBynick = async(e) => await User.findOne({nick:e})

const signIn = async (data) => {
    const newUser= new User(data)
    return await newUser.save()
}

const update = async(id,user) => await User.findByIdAndUpdate(id,user)


export {findAll,signIn,findById,findBynick,findByemail,findByIdProfile,findPage,countUsers,update}