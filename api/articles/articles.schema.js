const { Schema, model } = require("mongoose");

const articleSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },

  // Ajout de draft et published
  status: {
    type: String,
    enum: ["draft", "published"],
    default: "draft",
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = model("Article", articleSchema);
