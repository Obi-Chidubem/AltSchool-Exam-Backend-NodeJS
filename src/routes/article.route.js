import express from "express";
import * as articleController from "../controllers/article.controller.js";
const articleRoute = express.Router();

articleRoute.get("/createArticle", articleController.createArticle);
articleRoute.post("/changeArticleState", articleController.changeArticleState);
articleRoute.post("/updateArticle", articleController.updateArticle);

export default articleRoute;
