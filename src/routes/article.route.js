import express from "express";
import * as articleController from "../controllers/article.controller.js";
const articleRoute = express.Router();

articleRoute.get("/createArticle", articleController.createArticle);
articleRoute.post("/changeArticleState", articleController.changeArticleState);
articleRoute.post("/updateArticle", articleController.updateArticle);
articleRoute.post("/deleteArticle", articleController.deleteArticle);
articleRoute.post("/viewAllArticles", articleController.viewAllArticles);
articleRoute.post("/viewUserArticles", articleController.viewUserArticles);

export default articleRoute;
