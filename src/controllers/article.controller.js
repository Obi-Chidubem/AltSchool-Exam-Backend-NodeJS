import blogArticle from "../database/schema/blogArticle.schema.js";
import dotenv from "dotenv";
import User from "../database/schema/user.schema.js";
import authService from "../services/auth.service.js";
dotenv.config();

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

export const deleteArticle = async (req, res) => {
  try {
    req.user = await authService(req, res);
    console.log(req.user);
    const { title } = req.body; //title will be a simple key:value pair, but update will be another object of it's own.
    const Article = await blogArticle.find({ title });
    console.log(Article);
    if (req.user._id !== Article[0].authorId) {
      res.status(401).json({ err: "Article Does Not Belong To User" });
      return;
    }
    const deletedArticle = await blogArticle.findOneAndDelete({ title });
    res.json({
      message: "Article Has Been Deleted",
      data: {
        "Deleted Article": deletedArticle,
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

export const viewUserArticles = async (req, res) => {
  try {
    req.user = await authService(req, res);
    console.log(req.user);
    const page = req.query.page || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const qskip = req.query.skip || skip;
    const qlimit = req.query.limit || limit;
    if (req.query.state) {
      const userArticles = await blogArticle
        .find({ userId: req.user.id, state: req.query.state })
        .skip(qskip)
        .limit(qlimit);
      res.json({
        "Your Articles": userArticles,
      });
      return;
    }

    const userArticles = await blogArticle
      .find({ userId: req.user.id })
      .skip(qskip)
      .limit(qlimit);
    res.json({
      "Your Articles": userArticles,
    });
  } catch (err) {
    res.status(err.status || 500);
    res.json({
      err: err.message,
    });
  }
};

//This one is so long, but dont be scared. No, really, it's gentler than it looks.
export const viewAllArticles = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 20;
    const skip = (page - 1) * limit;
    const qskip = req.query.skip || skip;
    const qlimit = req.query.limit || limit;
    var params = {};
    //Check what query the user is using to search. There can be one or more.
    //Put them all in an object called params nad pass that object into the DB find
    if (req.query.authorId) {
      params["authorId"] = req.query.authorId;
    }
    if (req.query.title) {
      params["title"] = req.query.title;
    }
    if (req.query.tags) {
      params["tags"] = req.query.tags;
    }
    params["state"] = "PUBLISHED";
    console.log(params);
    const allArticles = await blogArticle
      .find(params)
      .skip(qskip)
      .limit(qlimit);

    //If you only called on a single article using any of the queries, then we will update the read count of that one.
    if (allArticles.length == 1) {
      var readCount = allArticles[0].read_count;
      console.log(readCount);
      const updatedArticle = await blogArticle.findOneAndUpdate(
        {
          title: req.query.title,
        },
        { read_count: readCount + 1 },
        { new: true }
      );
      const userInfo = await User.findOne({ _id: updatedArticle.authorId });
      const displayAuthor = {
        Firstname: userInfo.firstname,
        Lastname: userInfo.lastname,
        Email: userInfo.email,
      };
      res.json({
        Article: updatedArticle,
        Author: displayAuthor,
      });
      return;
    }

    //If you called on more than one, then you will just get this response
    res.json({
      Articles: allArticles,
    });
  } catch (err) {
    res.status(err.status || 500);
    res.json({ err: err.message });
  }
};
