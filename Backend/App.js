const express=require("express");
const app=express();
const path=require('path');
app.listen(3000);
app.use(express.json());
app.use(express.static(path.join(__dirname,"../public")));

const {EntityRegistrationRoute}=require("./EntityRegistration");
const HomePageRoute=require("./HomePage");
const SearchBarRoute=require("./SearchBar");
const InformationRoute=require("./InfoPage");

app.get("/",(req,res)=>{
    res.redirect("/home");
})
app.use("/home",HomePageRoute);
app.use("/register",EntityRegistrationRoute);
app.use("/search",SearchBarRoute);
app.use("/info",InformationRoute);