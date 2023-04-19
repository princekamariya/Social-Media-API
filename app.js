import express from "express";
import { connectDB } from "./data/database.js";
import { config } from "dotenv";
import router from "./routes/routes.js";
import cookieParser from "cookie-parser";

const app = express();

config({
    path: "./data/config.env",
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", router);

connectDB();

app.get("/", (req, res) => {
    res.send("Hello What's Up");
});

app.listen(4000, () => {
    console.log(`Server is running on port ${4000}`);
});
