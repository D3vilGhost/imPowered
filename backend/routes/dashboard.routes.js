import express from 'express';
import path from 'path';
import Entity from "../models/entity.model.js";
import protectDashboard from "../middleware/protectDashboard.js";
import jwt from 'jsonwebtoken';

const router = express.Router();
const __dirname = path.resolve();

router.get("/", protectDashboard, sendDashboardPage);

router.post("/data", sendDashboardData);
router.post("/update/personal", updatePersonalDetails)
router.post("/update/features", updateFeatureDetails)

function sendDashboardPage(req, res) {
    res.sendFile(path.join(__dirname, "./frontend/dashboard.html"));
}
// send data for placeholders on dashboard
async function sendDashboardData(req, res) {
    try {
        // we know that token is valid
        const token = req.cookies.jwt;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Entity.findById(decoded.userId).select("-password");
        res.status(201).json(user);
    } catch (error) {
        console.log("Error in sendDashboardData: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function updatePersonalDetails(req, res) {
    try {
        const updatedData = req.body;
        let decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const entity = await Entity.findOneAndUpdate({ _id: decoded.userId }, updatedData);
        if (!entity) {
            return res.staus(500).json({ error: "Couldn't Update Details. Please Try Later!" });
        }
        return res.status(201).json({ message: "Data Updated successfully!" });

    } catch (error) {
        console.log("Error in updateDetails:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

async function updateFeatureDetails(req, res) {
    try {
        let features = [
            'destinationType',
            'wheelchair',
            'lift',
            'ramps',
            'restrooms',
            'helpers',
            'announcementSystem',
            'automaticDoors',
            'accessibleToilets'
        ]
        let decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
        const data = req.body;
        const entity = await Entity.findById(decoded.userId);
        if (!entity) {
            return res.staus(500).json({ error: "Couldn't Update Details. Please Try Later!" });
        }
        let updatedData = {};
        for (let key of features) {
            if (!data[key]) {
                data[key] = '';
            }
            if (entity[key] != data[key]) {
                updatedData[key] = data[key];
            }
        }
        if (JSON.stringify(updatedData) == '{}') {
            return res.status(500).json({ error: "Change Something Before raising a request!" })
        }
        let result = await Entity.findOneAndUpdate({ _id: decoded.userId }, updatedData);
        if (!result) {
            return res.status(500).json({ error: "Couldn't Update Details. Please Try Later!" });
        }
        return res.status(201).json({ message: "Data Updated successfully!" });

    } catch (error) {
        console.log("Error in updateDetails:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
}

export default router;