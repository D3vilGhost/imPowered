const express=require("express");
const app=express();
const path=require('path');
// app.listen(3000);
app.use(express.json());

const HomePageRoute=express.Router();

app.use("/home",HomePageRoute);

HomePageRoute.route("/").get((req,res)=>{
    res.sendFile(path.join(__dirname,"../Frontend/homePage.html"));
});

module.exports=HomePageRoute;