import express from 'express';
import path from 'path';

import Entity from "../models/entity.model.js";
import Otp from "../models/otp.model.js";

import generateTokenAndSetCookie from "../middleware/generateToken.js";
import protectAuthRoute from "../middleware/protectAuthRoute.js";
import sendMailForOTP from "../middleware/nodemailer.js";
import jwt from 'jsonwebtoken';

const router = express.Router();
const __dirname = path.resolve();

router.get("/login", protectAuthRoute, sendLoginPage);
router.get("/signup", protectAuthRoute, sendSignupPage);

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);
router.post("/delete", deleteAccount);

router.post("/otp/generate", generateOTP);
router.post("/otp/verify", verifyOTP);

// Login Logic
function sendLoginPage(req, res) {
    // This Controller sends the login page
    res.sendFile(path.join(__dirname, "./frontend/entityLogin.html"));
}

async function login(req, res) {
    // This Controller performs the login operation 
    // Data is received from frontend in req.body via POST method
    try {
        const { email, password } = req.body;
        const entity = await Entity.findOne({ email });

        if (!entity) {
            return res.status(400).json({ error: "Invalid Email" });
        }

        const isPasswordCorrect = (password == entity.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid Password" });
        }

        generateTokenAndSetCookie(entity._id, res);
        res.status(200).json({ message: "Login Successfull!" });
    } catch (error) {
        console.log("Error in login:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// LogOut Logic
function logout(req, res) {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged Out Successfully!" });
    } catch (error) {
        console.log("Error in logout:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// Account Delete Logic
async function deleteAccount(req, res) {
    try {
        let token = req.cookies.jwt;
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        let data = await Entity.deleteOne({ _id: decoded.userId });
        if (data.error) {
            throw new Error(data.error);
        }
        res.cookie("jwt", "", { maxAge: 0 }).json({ message: "Account Deleted Successfully!" })

    } catch (error) {
        console.log("Error in deleteAccount: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

// Signup Logic

function sendSignupPage(req, res) {
    // This Controller sends the Signup page
    res.sendFile(path.join(__dirname, "./frontend/entitySignup.html"));
}

async function generateOTP(req, res) {
    // generateOTP function generates an otp corrresponding to an email
    // if there already exists an otp for an email ,it delets that and make a new one
    // but before that it checks if the email already exists or not
    try {
        let email = req.body.email;
        //checking if email already exist as registered user first
        const entity = await Entity.findOne({ email });
        if (entity) {
            return res.status(400).json({ error: "The email address you provided is unavailable. Please try another one." })
        }
        // generating otp
        const otpEntity = await Otp.findOne({ email });
        if (otpEntity) {
            //deleting old otp for the corresponding email
            await Otp.deleteOne({ email });
        }
        const otpValue = Math.floor(Math.random() * 1000000); // 6 digit otp
        const newOTP = new Otp({ email: email, otp: otpValue });
        if (!newOTP) {
            return res.status(500).json({ error: "OTP Can't be generated please try later!" });
        }
        // sending otp on mail
        let otpRes = await newOTP.save();
        if (otpRes.error) {
            throw new Error(otpRes.error);
        }
        let emailResponse = await sendMailForOTP(email, otpValue);
        // checking for error in sending a mail
        if (emailResponse.error) {
            throw new Error(emailResponse.error);
        } else {
            res.status(201).json({ message: "OTP generated successfully!" });
        }

    } catch (error) {
        // errors handling
        console.log("Error in generateOtp:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

async function verifyOTP(req, res) {
    try {
        const { email, otp } = req.body;
        const data = await Otp.findOne({ email: email });

        if (!data) {
            return res.status(400).json({ error: "Your OTP has expired. Please click the SignUp button on the form to generate a new OTP." });
        }
        if (otp != data.otp) {
            return res.status(400).json({ error: "Invalid OTP!" })
        }
        return res.status(201).json({ message: "OTP Verified!" })
    } catch (error) {
        console.log("Error in verifyOTP: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function signup(req, res) {

    try {
        const entityData = req.body;
        //we know that email dont exist as checked in generateOTP Phase
        const newEntity = new Entity(entityData);

        if (newEntity) {
            generateTokenAndSetCookie(newEntity._id, res);
            await newEntity.save();
            res.status(201).json({ message: "Registration Successfull!" })
        } else {
            // incase validation fails from mongoDB side
            res.status(400).json({ error: "Invalid user data" });
        }


    } catch (error) {
        console.log("Error in signup:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


export default router;