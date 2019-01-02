var express = require("express"),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  app = express();

mongoose.connect("mongodb://localhost/techNews");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

var techSchema = new mongoose.Schema({
  author: String,
  title: String,
  content: String,
  source: String,
  image: String,
  created: { type: Date, default: Date.now },
  upvotes: Number
});

var Tech = mongoose.model("tech", techSchema);

/* Tech.create({
  author: "niko",
  title: "new 4K screens",
  content: "testing 4k screen",
  source: "Youtube.com",
  image:
    "https://images.unsplash.com/photo-1461151304267-38535e780c79?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=672765fc591fb6401d969b8c2e03517b&auto=format&fit=crop&w=1490&q=80",
  upvotes: 10
});
 */
app.get("/", function(req, res) {
  res.redirect("/news");
});

app.get("/news", function(req, res) {
  Tech.find({}, function(err, tech) {
    if (err) {
      console.log(err);
    } else res.render("index", { tech: tech });
  });
});

app.get("/news/create", function(req, res) {
  res.render("create");
});

app.get("/news/search", function(req, res) {
  res.render("search");
});
app.get("/news/:id", function(req, res) {
  Tech.findById(req.params.id, function(err, foundTech) {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { tech: foundTech });
    }
  });
});
app.post("/news/create", function(req, res) {
  Tech.create(req.body.tech, function(err, createdTech) {
    if (err) {
      console.log("error");
      res.redirect("/news");
    } else {
      console.log(createdTech);
      res.redirect("/news");
    }
  });
});

app.get("/news/:id/edit", function(req, res) {
  Tech.findById(req.params.id, function(err, foundTech) {
    if (err) {
      console.log(err);
    } else {
      res.render("edit", { tech: foundTech });
    }
  });
});

app.put("/news/:id", function(req, res) {
  Tech.findByIdAndUpdate(req.params.id, req.body.tech, function(
    err,
    updatedNews
  ) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/news");
    }
  });
});

app.delete("/news/:id", function(req, res) {
  Tech.findByIdAndRemove(req.params.id, function(err, removedNews) {
    if (err) {
      console.log(err);
      res.redirect("/news");
    } else {
      console.log(removedNews);
      res.redirect("/news");
    }
  });
});

app.listen(3000, function() {
  console.log("Server is working and ready to serve! =)");
});
