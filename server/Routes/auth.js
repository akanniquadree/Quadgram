import express from "express"
import User from "../Models/user.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import keys from "../keys.js"

const router = express.Router()

router.post("/signin", async(req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.sendStatus(422).json({error:"Please fill all fields"})
    }
    await User.findOne({email:email}).then((savedUser)=>{
        if(!savedUser){
            return res.sendStatus(422).json({error:"Wrong Credentials"})
        }
        bcrypt.compare(password, savedUser.password).then(docMatch=>{
            if(docMatch){
                const token = jwt.sign({_id:savedUser._id}, keys.JWT_SECRET)
                res.json({token})
            }
            return res.sendStatus(422).json({error:"Wrong Credentials"})
        }).catch(err=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
    })
})

router.post("/signup", async(req, res)=>{
    const {name, email, password} = req.body
    if(!email || !password || !name){
       return res.sendStatus(422).json({error:"Please fill all the require field"})
    }
    await User.findOne({email:email}).then((savedUser)=>{
        if(savedUser){
          return res.sendStatus(422).json({error:"User already exist with that Email"})  
        }
        const salt = bcrypt.genSalt(12)
        bcrypt.hash(password, salt).then(hashedPassword=>{
            const user = new User({
                email,
                password: hashedPassword,
                name
            })
            user.save().then((user)=>{
                res.json({message:"Saved successfully"})
            }).catch(err=>{
                console.log(err)
            })
        }).catch(err=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
    })  
})




export default router;