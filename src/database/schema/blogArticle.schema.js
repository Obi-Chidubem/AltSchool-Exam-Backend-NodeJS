import mongoose from "mongoose";

const blogAarticleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    body: {
      type: String,
    },
    authorId: {
      type: String,
    },
    tags: {
      type: String,
    },
    state: {
      type: String,
      default: "DRAFT",
    },
  },
  { timestamp: true }
);

const blogArticle = mongoose.model("blogArticles", blogAarticleSchema);

export default blogArticle;
