import connection from "./database/connection.js";
import cors from 'cors'
import express from "express";
import userRouter from "./routers/userRouter.js";
import followRouter from "./routers/followRouter.js";

import publiRouter from "./routers/publiRouter.js";
import commRouter from "./routers/commentRouter.js";
// import User from "./models/user.js" 
// import faker from 'faker';
// Conexion BD
console.log("Arrancada la API NODE ")
connection();
//Servidor Node
const app = express()
const puerto = 3900
//Configurar cors
app.use(cors())
//Conversión de datos
app.use(express.json())
app.use(express.urlencoded({extended:true}))
//Cargar conf rutas
app.use("/user",userRouter)
app.use("/follow",followRouter)

app.use("/publication",publiRouter)
app.use("/comm",commRouter)


app.get('/', (req, res) => {
    res.status(200).send('Bienvenido a Chachará')
})

//Poner server a la escucha

app.listen(puerto, () => {
    console.log("Servidor arrancado en el puerto: ", puerto)
})


// Importa tu modelo de usuario de Mongoose

// const createUsers = async () => {
//   const usersToCreate = 100;

//   for (let i = 1; i <= usersToCreate; i++) {
//     const newUser = new User({
//       _id: faker.random.uuid(),
//       name: faker.name.firstName(),
//       surname: faker.name.lastName(),
//       nick: faker.internet.userName(),
//       email: faker.internet.email(),
//       rol: 'user',
//       image: 'default.png',
//       my_circle: []
//     });

//     try {
//       await newUser.save();
//       console.log(`Usuario ${i} creado correctamente.`);
//     } catch (error) {
//       console.error(`Error al crear el usuario ${i}: ${error}`);
//     }
//   }
// };

// // Llama a la función para crear los usuarios
// createUsers();


// async function main(){
//     mongoose.set("strictQuery",true)
//     await mongoose.connect(process.env.URL_DB)
//     await app.listen(process.env.PORT)
//     console.log("Servidor y BBDD encendidos")
// }

// main().catch(error => console.log("Fallo al arrancar al servidor" + error))