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
    read_count: {
      type: Number,
      default: 0,
    },
    reading_time: {
      type: String,
      default: "0 min",
    },
  },
  { timestamp: true }
);

const blogArticle = mongoose.model("blogArticles", blogAarticleSchema);

export default blogArticle;
