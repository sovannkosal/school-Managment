const e = require('express');
const {  User } = require('../models');
const logError = require('../utils/logger');
const bcrypt = require('bcrypt');
const { IsValid } = require('../utils/prevent');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
const nodemailer = require('nodemailer');


const otpStore = new Map();
const OTP_EXPIRE_MS = 5 * 60 * 1000;
const VERIFIED_EXPIRE_MS = 10 * 60 * 1000;

const GetUser = async (req, res) => {
    try {
        
        // Get all users
        const data = await User.findAll();
        res.json({
            success: true,
            data: data
        });
    }
    catch (error) {
        logError("UserController - get", error, res);
    }
};



const Create = async (req, res) => {
    try {
        
       const {username,email,password,status}= req.body;
       if (email === undefined || email === null || email.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });

        }
         const existingUser = await User.findOne({ where: { email:email } });
         if (existingUser) {
        return res.status(400).json({
             success: false,
              message: 'Email already exists' 
            });
            
            }
      
    const newUser = await User.create({
       
        username,
        email,
        password: await bcrypt.hash(password, 10),
        status
       });
       res.json({
            success: true,
            message: 'User created successfully',
            data: newUser
        });
    }
    catch (error) {
        logError("UserController - create", error, res);
    }
};

const GetOne = async (req, res) => {
    try {
        const { id } = req.params;
        if (id === undefined || id === null || id.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.json({
            success: true,
            data: user
        });
    }
    catch (error) {
        logError("UserController - get one", error, res);
    }
};
//login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!IsValid(email) || !IsValid(password)) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid password'
            });
        }
        const token = jwt.sign({  email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.json({
            success: true,
            message: 'Login successful',
           token: token
        });
    } 
    catch (error) {
        logError("UserController - login", error, res);
    }
};
//update user
const Update = async (req, res) => {
    try {
        const { user_id, username, email, password, status } = req.body;
        if (!IsValid(user_id)) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        const updatedUser = await user.update({
            username,
            email,
            password: await bcrypt.hash(password, 10),
            status
        });
        res.json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    }
    catch (error) {
        logError("UserController - update", error, res);
    }
};
//delete user
const Delete = async (req, res) => {
    try {
        const {id } = req.params;
        if (!IsValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        await user.destroy();
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        logError("UserController - delete", error, res);
    }
};
// send OTP
const sendOTP = async (req, res) => {
    try{
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is missing. Make sure to send JSON data with Content-Type: application/json'
            });
        }
        const { email } = req.body;
        if(!IsValid(email)){
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        // Save OTP to user or send it via email
        // Example: await sendEmail(user.email, otp);
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || "nhamsreyka384@gmail.com",
                pass: process.env.EMAIL_PASSWORD || "fpiz uifl imml yjbe"
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER || "nhamsreyka384@gmail.com",
            to: user.email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`
        };

        await transporter.sendMail(mailOptions);

        otpStore.set(email, {
            otp: otp.toString(),
            otpExpireAt: Date.now() + OTP_EXPIRE_MS,
            verified: false,
            verifiedExpireAt: null
        });

        res.json({
            success: true,
            message: 'OTP sent successfully'
        });
    }
    catch(error){
        logError("UserController", error, res);
    }
}
const verifyOtp = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is missing. Make sure to send JSON data with Content-Type: application/json'
            });
        }
        const { email, otp } = req.body;

        if (!IsValid(email) || !IsValid(otp)) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const otpData = otpStore.get(email);
        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: 'OTP not found. Please request a new OTP'
            });
        }

        if (Date.now() > otpData.otpExpireAt) {
            otpStore.delete(email);
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new OTP'
            });
        }

        if (otpData.otp !== otp.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        otpStore.set(email, {
            ...otpData,
            verified: true,
            verifiedExpireAt: Date.now() + VERIFIED_EXPIRE_MS
        });

        res.json({
            success: true,
            message: 'OTP verified successfully'
        });
    }
    catch (error) {
        logError("UserController", error, res);
    }
}

const resetPassword = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                success: false,
                message: 'Request body is missing. Make sure to send JSON data with Content-Type: application/json'
            });
        }
        const { email, newPassword } = req.body;

        if (!IsValid(email) || !IsValid(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'Email and newPassword are required'
            });
        }

        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const otpData = otpStore.get(email);
        if (!otpData || !otpData.verified) {
            return res.status(400).json({
                success: false,
                message: 'OTP is not verified'
            });
        }

        if (!otpData.verifiedExpireAt || Date.now() > otpData.verifiedExpireAt) {
            otpStore.delete(email);
            return res.status(400).json({
                success: false,
                message: 'OTP verification has expired. Please verify OTP again'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword });
        otpStore.delete(email);

        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    }
    catch (error) {
        logError("UserController", error, res);
    }
}

module.exports = {
    GetUser,
    Create,
    GetOne,
    login,
    Update,
    Delete,
    sendOTP,
    verifyOtp,
    resetPassword
}
   
    
   

    
