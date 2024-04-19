import express from "express";
import dotenv from "dotenv";
import authRouter from "../src/routes/auth.route.js";
import articleRouter from "./routes/article.route.js";
const app = express();

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/blog", articleRouter);

//Something to show you've successfully gottn into the app
app.get("/", (req, res) => {
  res.send("Welcome to the Blog");
});

//send app to server
export default app;
