import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        
    },
    avatar:{
        type:String,
        default:"https://pbs.twimg.com/profile_images/1693352060131897344/dgubG-Rr_200x200.jpg"
    },
}, {timestamps:true}

);

const User = mongoose.model("User", userSchema);

export default User;

