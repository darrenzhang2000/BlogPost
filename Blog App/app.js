var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));
//creates a connection to blog_app database 
mongoose.connect("mongodb://localhost/blog_app", {useNewUrlParser: true}); 

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    created: { type: Date, default: Date.now}, 
    description: String
});

//responsible for creating and reading documents from Blog database
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Silhouette photo",
//     image: "https://images.unsplash.com/photo-1476611338391-6f395a0ebc7b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     created: {type: Date, default: Date.now},
//     description: "3 people near tall trees."

// });

app.get("/", (req, res)=>{
    res.redirect("/blogs");
});

app.get("/blogs", (req, res)=>{
    Blog.find({}, (err, blogs)=>{
        if(err){
            res.render("index");
        }
        else{
            //first blogs -> ejs, second blogs -> result of Blog.find() 
            res.render("index", {blogs: blogs});
        }
    })
});

app.get("/blogs/new", (req, res)=>{
    res.render("new");
});

app.post("/blogs", (req, res)=>{
    Blog.create(req.body.blog, (err, newblog)=>{
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

//show route
app.get("/blogs/:id", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show", {blog: foundBlog});
        }
    });
});

//edit route
app.get("/blogs/:id/edit", (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

//update route
app.put("/blogs/:id", (req, res)=>{
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//delete route
app.delete("/blogs/:id", (req, res)=>{
    Blog.findByIdAndRemove(req.params.id, (err)=>{
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.listen(3000, ()=>{
    console.log("listening at port 3000");
});