import mongoose from "mongoose";
mongoose.connect("mongodb+srv://vivek1_4:vivek9912@cluster0.0ymfu.mongodb.net/?retryWrites=true&w=majority")
.then(()=>{
    console.log("DB connected successfully");
});

const userSchema = new mongoose.Schema({
    userId:String,
    password:String
});

const userModel = new mongoose.model("user-auth",userSchema);

export default userModel;