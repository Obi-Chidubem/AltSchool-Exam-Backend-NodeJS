const mongoose = require("mongoose");

const publishedAarticleSchema = mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },
    description: {
      type: String,
    },
    authorId: {
      type: String,
      unique: true,
    },
    state: {
      type: String,
      default: "PUBLISH",
    },
    read_count: {
      type: number,
    },
    reading_time: {
      type: number,
    },
    tags: {
      type: String,
    },
  },
  { timestamp: true }
);

const publishedArticle = mongoose.model("publishedArticle", publishedAarticleSchema);
module.exports = publishedArticle;
