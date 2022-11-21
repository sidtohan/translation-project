const mongoose = require("mongoose");
const textSchema = new mongoose.Schema({
  sourceLang: String,
  toLang: String,
  translatedText: String,
});

const textModel = mongoose.model("Text", textSchema);

module.exports = textModel;
