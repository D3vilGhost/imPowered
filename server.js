import express from 'express';
import path from 'path';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectToMongoDB from "./backend/database/connectToMongoDB.js";

import homePageRoutes from "./backend/routes/homePage.routes.js";
import authRoutes from "./backend/routes/auth.routes.js";
import dashboardRoutes from "./backend/routes/dashboard.routes.js";
import searchRoutes from "./backend/routes/search.routes.js";

const __dirname = path.resolve();
const server = express();
dotenv.config();

server.use(cors());
server.use(express.json());
server.use(express.static(path.join(__dirname, "./public")));
server.use(cookieParser());

server.use("/", homePageRoutes);
server.use("/auth", authRoutes);
server.use("/dashboard", dashboardRoutes);
server.use("/search", searchRoutes);

server.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./frontend/404.html"));
})

server.listen(process.env.PORT, () => {
    connectToMongoDB();
    console.log("Server Running on port:", process.env.PORT);
});