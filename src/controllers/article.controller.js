import jwt from "jsonwebtoken";
import blogArticle from "../database/schema/blogArticle.schema.js";
import { ErrorWithStatus } from "../exceptions/error_with_status.exception.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../database/schema/user.schema.js";
import authService from "../services/auth.service.js";
dotenv.config();
git add
export const createArticle = async (req, res) => {
  try {
    req.user = await authService(req, res);
    console.log(req.user);

    //Now to see if everything is correct
    const userDB = await User.find({ _id: req.user._id });
    console.log(userDB);
    //title
    //body
    //authorId
    //tags
    //state
    const { title, body, tags, state } = req.body;
    const authorId = userDB[0]._id;
    const newDraftArticle = new blogArticle({
      title,
      body,
      authorId,
      tags,
      state,
    });

    await newDraftArticle.save();
    res.json({
      message: "Article Created Successfully",
      data: {
        Article: newDraftArticle,
      },
    });
  } catch (err) {
    res.status(err.status || 500);
    res.json({ err: err.message });
  }
};

export const updateArticle = async (req, res) => {
  try {
    req.user = await authService(req, res);
    console.log(req.user);
    const { title, update } = req.body; //title will be a simple key:value pair, but update will be another object of it's own.
    const Article = await blogArticle.find({ title });
    console.log(Article);
    if (req.user._id !== Article[0].authorId) {
      res.status(401).json({ err: "Article Does Not Belong To User" });
      return;
    }
    const updatedArticle = await blogArticle.findOneAndUpdate(
      { title },
      update,
      { new: true }
    );
    res.json({
      message: "Article Has Been Updated",
      data: {
        Article: updatedArticle,
      },
    });
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message,
    });
  }
};

export const changeArticleState = async (req, res) => {
  try {
    req.user = await authService(req, res);

    //Get the user who is logged in
    const userDB = await User.find({ _id: req.user._id });
    // console.log(userDB);

    //Get the Article from the user with that title and find out if the supplied article is already published
    const { articleTitle } = req.body;
    const Article = await blogArticle.find({
      title: articleTitle,
    });
    console.log(Article);
    if (!Article[0]) {
      res.status(401).json({ err: "Article Does Not Exist." });
    }

    //If the article exists, then we can check to see if it is published

    // console.log(isArticleDrafted);
    if (Article[0].state == "PUBLISHED") {
      res.status(401).json({ err: "Article is Already Published." });
    }

    //if it passes all that, then we can change it from a draft to a published Article.

    const newState = await blogArticle.findOneAndUpdate(
      //always await database functions. This always skips your mind for some reason.
      { title: articleTitle },
      { state: "PUBLISHED" }
    );

    res.json({
      message: "Article has been published",
      data: {
        Article: newState,
      },
    });
  } catch (err) {
    res.status(err.status || 500).json({ err: err.message });
  }
};

export const viewAllArticles = (req, res) => {};
