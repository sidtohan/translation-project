const mongoose = require("mongoose");
const express = require("express");
const cors = require("express-cors");
const User = require("./mongoUser");
const Text = require("./mongoTexts");
const bodyParser = require("body-parser");
const langList = require("./langList");
const app = express();
const mongoDBURI =
  "mongodb://translation:1234@ac-wqlnnzt-shard-00-00.lo4whtw.mongodb.net:27017,ac-wqlnnzt-shard-00-01.lo4whtw.mongodb.net:27017,ac-wqlnnzt-shard-00-02.lo4whtw.mongodb.net:27017/translationapp?ssl=true&replicaSet=atlas-jhfbfy-shard-0&authSource=admin&retryWrites=true&w=majority";

const APIUrl = "https://api.mymemory.translated.net/get?";
const codeMapper = (lang) => {
  lang = lang.charAt(0).toUpperCase() + lang.slice(1);
  return langList[lang];
};
// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("frontend"));

// Test
app.get("/api/test", (req, res) => {
  res.status(200).json({ status: "working" });
});

// Authentication
app.post("/api/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ username, password })
    .then(async (result) => {
      if (result == null) res.status(401).json({ status: "fail" });
      else res.status(200).json({ status: "ok" });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ status: "error" });
    });
});

app.post("/api/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ username, password }).then((dat) => {
    if (dat) {
      res.status(400).json({ status: "user exists" });
    } else {
      const newUser = new User({ username, password });
      newUser.save().then((dat) => {
        if (dat) res.status(201).json({ status: "user created" });
        else res.status(500).json({ status: "error" }).end();
      });
    }
  });
});

// Translation
app.post("/api/translate", async (req, res) => {
  let toLang = req.body.toLang;
  let sourceLang = req.body.sourceLang;
  let text = req.body.text;
  let l1, l2;
  toLang = toLang.toLowerCase();
  sourceLang = sourceLang.toLowerCase();
  l1 = codeMapper(toLang);
  l2 = codeMapper(sourceLang);
  console.log(l1, l2);
  const finalUrl = APIUrl + `q=${text}&langpair=${l2}|${l1}`;
  fetch(finalUrl)
    .then((data) => data.json())
    .then((data) => {
      const finalText = data.responseData.translatedText;
      const newText = new Text({ toLang, sourceLang, text: finalText });
      newText
        .save()
        .then((dat) => {
          res.status(201).json({ text: finalText });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).end();
        });
    });
});

mongoose
  .connect(mongoDBURI)
  .then((res) => {
    console.log("connected to mongodb");
  })
  .catch((err) => console.log(err));
app.listen(3003, () => {
  console.log("server is running on PORT 3003");
});
