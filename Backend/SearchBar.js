const express=require("express");
const mongoose=require("mongoose");
const app=express();
const path=require('path');
// app.listen(3000);
app.use(express.json());

const SearchBarRoute=express.Router();
const {EntityDataBase}=require("./EntityRegistration");

app.use("/search",SearchBarRoute);

SearchBarRoute.route("/").get(sendSearchPage).post(sendSearchResult);

function sendSearchPage(req,res){
    res.sendFile(path.join(__dirname,"../Frontend/searchPage.html"));
};

async function sendSearchResult(res,res){
    let DataBase=await EntityDataBase.find();
    res.send(DataBase);
};


module.exports=SearchBarRoute;