import express from 'express';
import path from 'path';
import jwt from "jsonwebtoken";
import Entity from "../models/entity.model.js";

const router = express.Router();
const __dirname = path.resolve();

router.get("/", homePage);
router.post("/", sendUserData);

function homePage(req, res) {
    res.sendFile(path.join(__dirname, "./frontend/homePage.html"));
}

async function sendUserData(req, res) {
    // data for dashboard to be set or not
    try {
        let token = req.cookies.jwt;
        if (!token) {
            // there is no token thus no account logged in
            return res.status(201).json({ message: "No Token" });
        }
        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            // if validation fails then delete that invalid cookie
            res.cookie("jwt", "", { maxAge: 0 });
            return res.status(201).json({ message: "Invalid ID" });
        }
        //user have the cookie and is a validated cookie thus fetch user details
        const user = await Entity.findById(decoded.userId).select("-password");
        if (!user) {
            // in this case the token was valid but user id was invalid
            // thus delete that invalid cookie
            res.cookie("jwt", "", { maxAge: 0 });
            return res.status(201).json({ message: "No Account" });
        }
        // in this case cookie was there with valid userid
        return res.status(201).json({ name: user.name });

    } catch (error) {
        console.log("Error in homePage.routes/sendUserData: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }

}

export default router;