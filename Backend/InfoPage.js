const express=require("express");
const mongoose=require("mongoose");
const app=express();
const path=require('path');
// app.listen(3000);
app.use(express.json());

const InfoPageRoute=express.Router();
const {EntityDataBase}=require("./EntityRegistration");

InfoPageRoute.route("/:id/").get(sendInfoPage).post(sendEntityData);

function sendInfoPage(req,res){
    res.sendFile(path.join(__dirname,"../Frontend/infoPage.html"));
};

async function sendEntityData(req,res){
    let DataBase=await EntityDataBase.find();
    res.send(DataBase);
}
module.exports=InfoPageRoute;