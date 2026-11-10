import mongoose from "mongoose";
import bcrypt from "bcrypt"; //for password hashing
import jwt from "jsonwebtoken"; //for jwttokens(refresh/access)
import { USER_ROLE } from "../constants/roles.js";

const userSchema = new mongoose.Schema({
username:{
    type:String,
    required:true,
    trim:true,
    unique:true,
},
email:{
    type:String,
    required:true,
    trim:true,
    unique:true,
    lowercase:true,
},
password:{
    type:String,
    required:true,
},
role:{
    type:String,
    enum:Object.values(USER_ROLE),
    default:USER_ROLE.CUSTOMER
},
phone:{
   type:String,
   required:true,
   trim:true,
   default:null
},
avatar:{
   type:String,
   default:""
},
refreshToken:{
   type:String,
   default:""
},
isVerified:{
   type:Boolean,
   default:false
}
},
{
    timestamps:true
});

//password hashing
userSchema.pre("save",async function(){
if(!this.isModified("password")){
    return;
}
this.password = await bcrypt.hash(this.password,10);
});

//comparing the passwords
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

//Generate Access Token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        role:this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
);
};

//Generate Refresh Token
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this.id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
);
};

const User = mongoose.model("User",userSchema);
export default User;