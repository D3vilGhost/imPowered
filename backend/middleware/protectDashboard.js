import jwt from "jsonwebtoken";
import Entity from "../models/entity.model.js";

async function protectDashboard(req, res, next) {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            // user doesn't have any token thus proceed redirect to homeppage
            return res.redirect("/");
        }
        //if user have token then validate it 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            // if validation fails then delete that invalid cookie and redirect
            res.cookie("jwt", "", { maxAge: 0 });
            return res.redirect("/");
        }
        //user have the cookie and is a validated cookie thus fetch user details
        const user = await Entity.findById(decoded.userId).select("-password");
        if (!user) {
            // in this case the token was valid but user id was invalid
            // thus delete that invalid cookie and redirect
            res.cookie("jwt", "", { maxAge: 0 });
            return res.redirect("/");
        }
        //user have the cookie and is a validated cookie thus proceed
        next();
    } catch (error) {
        console.log("Error in protectDashboard: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default protectDashboard;