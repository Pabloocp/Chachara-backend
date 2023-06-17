import mongoose from "mongoose";

const connection = async() => {
    try {
        await mongoose.connect("mongodb://localhost:27017/chachara")
        console.log("Conectado a chachara")
    } catch (error) {
        console.log(error)
        throw new Error("No se ha podido conectar con la base de datos")
    }
}

export default connection