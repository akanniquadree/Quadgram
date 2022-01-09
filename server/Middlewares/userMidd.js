import jwt from "jsonwebtoken"
import keys from "../keys.js"
import User from "../Models/user.js"



export const Login = async(req, res, next) =>{
    const {authorization} = req.headers
    if(!authorization){
        return res.sendStatus(401).json({error:"You must be logged in"})
    }
    const token = authorization.replace("Bearer " , "")
    jwt.verify(token, keys.JWT_SECRET, (err, payload)=>{
        if(err){
            return res.sendStatus(401).json({error: "You must be logged in"})
        }
       const {_id} = payload
        await User.findById(id).then(userToken=>{
            req.user = userToken
            next()
        })
    })
}