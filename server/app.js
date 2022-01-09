import express from "express"
import mongoose from "mongoose"
import keys from "./keys.js"
import router from "./Routes/auth.js"



const app = express()
const PORT = 5000


mongoose.connect("mongodb+srv://quadree:quadree@cluster0.wwkit.mongodb.net/Quadchat?retryWrites=true&w=majority", {
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on('connected', ()=>{
    console.log("Connected to the Database Successfully")
})
mongoose.connection.on('error', ()=>{
    console.log("Error in connecting to the database")
})

app.use(express.json())
app.use("/api", router)









app.listen(PORT, ()=>{
    console.log("Server is running on", PORT)
})