import express from "express";
import * as authRouter from "../controllers/auth.controller.js";

const authRoute = express.Router();

authRoute.get("/login", (req, res) => {
  res.send("loginPage");
});

authRoute.get("/signup", (req, res) => {
  res.send("signupPage");
});

authRoute.post("/signup", authRouter.signup);

authRoute.post("/login", authRouter.login);

export default authRoute;
