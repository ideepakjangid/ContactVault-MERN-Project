const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        uniqued:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const UserModel = new mongoose.model("User",UserSchema);
module.exports = UserModel;