import 'dotenv/config'
import jwt from 'jwt-simple'
import moment from 'moment'

const clave = process.env.TOKEN;

const auth = (req,res,next) =>{
    if(!req.headers.authorization){
        return res.status(403).send({ status: "error", message: "Fallo en la autentificación,vuelve a iniciar sesión" })
    }
    //eliminamos comillas y espacios
    let token = req.headers.authorization.replace(/["']+/g,'')

    try {
        let payload = jwt.decode(token,clave)
        //comprobamos fecha
        if(payload.exp <= moment().unix()){
            return res.status(401).send({ status: "error", message: "Token expirado" })
        } 
        req.user = payload
    } catch (error) {
        return res.status(404).send({ status: "error", message: "Token inválido" ,error})
    }
    //metemos a usuario en todas las reqs

    next()
}



export {auth}