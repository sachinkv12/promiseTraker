const express=require('express');
const mongoose=require('mongoose');

const SigninSchema=new mongoose.Schema({
    email:{type:String, required:true},
    password:{type:String, required:true},
    

})
const Signin = mongoose.model('Signin',SigninSchema)
module.exports=Signin;