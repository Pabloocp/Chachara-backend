import jwt from 'jwt-simple'
import moment from 'moment'
import 'dotenv/config'

const clave = process.env.TOKEN;

const createToken = (user) =>{
    const playload =  {
        id:user._id,
        name:user.name,
        surname:user.surname,
        nick:user.nick,
        email:user.email,
        role:user.role,
        image:user.image,
        iat: moment().unix(),
        //expiracion de un mes
        exp: moment().add(30,"days").unix()
    }

    return jwt.encode(playload,clave)
}

export {createToken}