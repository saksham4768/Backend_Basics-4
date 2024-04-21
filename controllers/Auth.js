const bcrypt = require("bcrypt");
const User = require('../models/userModel');
const JWT = require("jsonwebtoken");
require("dotenv").config();

//signup Route Handler
exports.signup = async (req, res) =>{
    try{
        //get data from request body
        const {name, email, password, role} = req.body;
        //check if user already exist
        const existinguser = await User.findOne({email});
        if(existinguser){
            return res.status(400).json({
                success: false,
                message: "User Already Exist",
            });
        }
        //secure password
        let hashedpassword;
        try{
            hashedpassword = await bcrypt.hash(password, 10);
        }
        catch(err){
            return res.status(500).json({
                success: false,
                message: 'Error in Hashing password',
            });
        }
        //create entry for user in Database;
        const user = await User.create({
            name, email, password:hashedpassword, role
        })
        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
        });
    }
    catch(err){
        console.error(err);
        res.status(500).json({
            success: false,
            message: "User can not be registered, Please Try Again Later"
        })
    }
}

//Login Route Handler
exports.login = async (req, res) =>{
    try{

        //Fetch Email and password from request body
        const{email, password} = req.body;
        
        //Validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:'Please Fill all the details carefully',
            });
        }

        //check the registered user
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not Registered",
            })
        }

        const payload = {
            email: user.email,
            id:user._id,
            role:user.role,
        }
        //If User is already registered then verify the password 
        //Generate the JWT Token
        if(await bcrypt.compare(password, user.password)){
            //Password Match
            //Create Token
            let token = JWT.sign(payload,
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:"2h",
                                });
            
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token , options).status(200).json({
                success: true,
                token,
                user,
                message: "User Logged in Successfully",
            });
        }
        else{
            //Password Do not Match
            return res.status(403).json({
                success: false,
                message:"Password Incorrect",
            })
        }
    }
    catch(err){
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Login Failure",
        })
    }
}