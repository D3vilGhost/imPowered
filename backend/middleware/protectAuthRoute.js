import jwt from "jsonwebtoken";
import Entity from "../models/entity.model.js";

async function protectAuthRoute(req, res, next) {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            // user doesn't have any token thus proceed to auth page
            return next();
        }
        //if user have token then validate it 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            // if validation fails then delete that invalid cookie and make him proceed
            res.cookie("jwt", "", { maxAge: 0 });
            return next();
        }
        //user have the cookie and is a validated cookie thus fetch user details
        const user = await Entity.findById(decoded.userId).select("-password");
        if (!user) {
            // in this case the token was valid but user id was invalid
            // thus delete that invalid cookie and process to auth page
            res.cookie("jwt", "", { maxAge: 0 });
            return next();
        }
        //user have the cookie and is a validated cookie thus redirect to dashboard
        res.redirect("/dashboard");

    } catch (error) {
        console.log("Error in protectAuthRoute: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export default protectAuthRoute;