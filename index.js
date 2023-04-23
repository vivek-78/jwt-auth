import express from "express";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import cookies from "cookie-parser";
import userModel from "./userModel.js";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookies());
const key = "samplejwt"

const port = 3000;
const authenticated = (req,res,next) =>{
    const {token} = req.cookies;
    if(token){
        const tokenUser = jwt.verify(token,key);
        const user  = userModel.findOne({userId:tokenUser.userId});
        if(!user){ res.send("invalid cookie") }
        req.user = user
        next();       
    }else{
        res.send("not authenticated")
    }
}
app.post("/",authenticated,(req,res)=>{
    res.send("Hi "+req.body.userId);
});

app.get("/home",authenticated,async(req,res)=>{
   res.send("Hi "+req.body.userId+" this is home page");
});
app.get("/logout",authenticated,(req,res)=>{
     res.cookie("token",null,{
        httpOnly: true,
        expires: new Date(Date.now()),
     });
     res.send("successfully logged out please login to continue");
})
app.get("/login",async(req,res)=>{
    const {userId,password} = req.body;
    const user = await userModel.findOne({userId,password});
    if(user){
        const jwtToken = jwt.sign({userId},key);
        res.cookie("token",jwtToken,{
            httpOnly:true,
            expires: new Date(Date.now() + 60 * 1000),
        });
        res.send("Hello "+userId);
    }else{
        res.send("please register")
    }
})
app.post("/register",async (req,res)=>{
    const {userId, } = req.body;
    const fetchedUser = await userModel.findOne({ userId }) 
     if(fetchedUser){
        return res.send("acc already exist please login"); 
    }    
   const user = await userModel.create({
    userId,
    password
   });
   const jwtToken = jwt.sign({ userId: user.userId },key);
   res.cookie("token", jwtToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/")
})
app.listen(port,()=>{
    console.log("server running on port "+port)
});