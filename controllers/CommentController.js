
const pruebaComment = (req,res) => {
    return res.status(200).send({
        message: "Mensaje de nuevo Comentario"
    })
}


export {pruebaComment}