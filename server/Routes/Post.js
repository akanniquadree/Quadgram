import express from "express"
import { Login } from "../Middlewares/userMidd.js"
import Post from "../Models/Post.js"



const postRouter = express.Router()

//get all post
postRouter.get("/posts", Login,async(req, res)=>{
    await Post.find().populate("postedBy", "_id name").then(savedPost=>{
        res.json(savedPost)
    }).catch(err=>{
        console.log(err)
    })
})

//get loggin user post
postRouter.get("/mypost", Login,async(req, res)=>{
    await Post.find({postedBy:req.user._id}).populate("postedBy","_id name").then(myPost=>{
        res.json({myPost})
    }).catch(err=>{
        console.log(err)
    })
})

//upload a post
postRouter.post("/createpost", Login, async(req, res)=>{
    const {title, body, pic} = req.body
    if(!title || !body ||!pic) {
        return res.status(422).json({error:"Please fill all fields"})
    }
    req.user.password = undefined
   const post =  new Post({
        title,
        body,
        image:pic,
        postedBy: req.user
    })
    await post.save().then(savedPost=>{
        res.json({post:savedPost})
    }).catch(err=>{
        console.log(err)
    })
})
postRouter.put("/like", Login, async(req, res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{new:true}).exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})
postRouter.put("/unlike", Login, async(req, res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{new:true}).exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

postRouter.put("/comment", Login, async(req, res)=>{
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.commentId,{
        $push:{comments:comment}
    },{new:true}).populate("comments.postedBy", "_id name" ).populate("postedBy", "_id name" ).exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

export default postRouter