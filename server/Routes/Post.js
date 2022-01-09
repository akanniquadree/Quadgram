import express from "express"
import { Login } from "../Middlewares/userMidd"
import Post from "../Models/Post"



const postRouter = express.Router()

//get all post
postRouter.get("/posts", async(req, res)=>{
    await Post.find().populate("postedBy", "_id name").then(savedPost=>{
        res.json({savedPost})
    }).catch(err=>{
        console.log(err)
    })
})

//get loggin user post
postRouter.get("/mypost", async(req, res)=>{
    await Post.find(postedBy = req.user._id).populate("postedBy","_id name").then(myPost=>{
        res.json({myPost})
    }).catch(err=>{
        console.log(err)
    })
})

//upload a post
postRouter.post("/createpost", Login, async(req, res)=>{
    const {title, body} = req.body
    if(!title || !body) {
        return res.sendStatus(422).json({error:"Please fill all fields"})
    }
    req.user.password = undefined
   const post =  new Post({
        title,
        body,
        postedBy: req.user
    })
    await post.save().then(savedPost=>{
        res.json({post:savedPost})
    }).catch(err=>{
        console.log(err)
    })
})