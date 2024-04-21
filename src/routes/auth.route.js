import express from "express";
import * as authController from "../controllers/auth.controller.js";

const authRoute = express.Router();

authRoute.get("/login", (req, res) => {
  res.send("loginPage");
});

authRoute.get("/signup", (req, res) => {
  res.send("signupPage");
});

authRoute.post("/signup", authController.signup);

authRoute.post("/login", authController.login);

export default authRoute;
