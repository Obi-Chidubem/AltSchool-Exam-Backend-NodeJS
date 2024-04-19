const mongoose = require("mongoose");

const draftedAarticleSchema = mongoose.Schema(
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
      default: "DRAFT",
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

const draftedArticle = mongoose.model("draftedArticle", draftedAarticleSchema);
module.exports = draftedArticle;
