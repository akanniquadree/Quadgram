import express from "express"
import { Login } from "../Middlewares/userMidd.js"
import Post from "../Models/Post.js"
import User from "../Models/user.js"



const userRouter = express.Router()

userRouter.get("/user/:id", Login,(req, res)=>{
    User.findOne({_id:req.params.id}).select("-password").then((user)=>{
            Post.find({postedBy:req.params.id}).populate("postedBy", "_id name").exec((err, posts)=>{
                if(err){
                  return  res.status(422).json({err:err})
                }
                res.json({user, posts})
            })
    }).catch(err=>{
        res.status(404).json({error:"User not found"})
    })
})








export default userRouter