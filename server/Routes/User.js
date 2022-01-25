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

userRouter.put("/follow", Login,(req, res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{new:true},(err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{new:true}).select("-password").then(result=>{
        res.json(result)
    }).catch(err=> res.status(422).json({error:err}))
    })
})

userRouter.put("/unfollow",Login,(req, res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{new:true},(err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=> res.status(422).json({error:err}))
    })
})






export default userRouter