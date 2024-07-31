import express from "express";
import path from "path";
import Entity from "../models/entity.model.js";

const __dirname = path.resolve();
const router = express.Router();

router.get("/", sendSearchPage);

router.post("/results", sendSearchResult)
router.post("/info", sendInfo);

function sendSearchPage(req, res) {
    res.sendFile(path.join(__dirname, "./frontend/searchPage.html"));
};

//controller for search results
async function sendSearchResult(req, res) {
    try {
        let { location, destinationType } = req.body;
        //find all matching the data type
        let searchResults = {};
        if (destinationType == 'All') {
            // getting all types of place
            searchResults = await Entity.find({}, 'email name address');
        } else {
            // get results based on only destinationType
            searchResults = await Entity.find({ destinationType }, 'email name address');
        }
        let filteredSearchResults = searchResults.filter((entity) => {
            // convert address to lower case and then check for a sustring matching location type
            return entity.address.toLowerCase().includes(location.toLowerCase());
        });
        res.status(201).send(filteredSearchResults);

    } catch (error) {
        console.log("Error in sendSearchResult: ", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }

};

// controller for sending information of the choosen one search result
async function sendInfo(req, res) {
    try {
        let { email } = req.body;
        let info = await Entity.findOne({ email }).select("-password");
        res.status(201).send(info);
    } catch (error) {
        console.log("Error in sendInfoPage: ", error.message);
        res.status(500).json({ error: "Internal Server Error !" });
    }

};

export default router;