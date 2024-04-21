//Import JSON Web Tokens
const JWT = require('jsonwebtoken');
require("dotenv").config();

exports.auth = (req, res, next) =>{
    try{

        //Extract Token from req.body
        //Total three way to extract the token from request body, from cookie, from header
        const token = req.body.token;

        //check if token is present or not
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token Is Missing",
            })
        }
        //If present
        try{
            //verify method return the decoded token in which present user data
            const payload = JWT.verify(token, process.env.JWT_SECRET);
            req.user = payload;

        }
        catch(err){
            return res.status(401).json({
                success: false,
                message: "Token is Invalid",
            })
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success: false,
            message:"Something went wrong, while verifying the Token",
        });
    }
}

//For Role Authorization
exports.isStudent = (req, res, next) =>{
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success: false,
                message:"This is the protected routes only for student"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:"User Role can not be Verified",
        })
    }
}

exports.isAdmin = (req, res, next) =>{
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success: false,
                message:"This is the protected routes only for admin"
            })
        }
        next();
    }
    catch(error){
        return res.status(500).json({
            success: false,
            message:"User Role can not be Verified",
        })
    }
}