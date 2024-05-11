import  express  from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from 'morgan';
import cors from 'cors'
import router from "./Routes/routes.js";
import cookieParser from "cookie-parser";




const app = express()

app.use(express.json())
app.use(cookieParser())
dotenv.config()
app.use(morgan('dev'))
app.use(cors({credentials: true, origin: 'https://foodo-food-buddy.vercel.app'}))

app.use("/api",router)
console.log("hello")





// app.get("/",function (req,res){
//     res.send("welcome to apple backend server")
// })

// app.get("/hello",hello)

app.listen(8000,()=>console.log("app is running on server"))
mongoose.connect(process.env.MONGOURL).then(() => console.log("database connect"))