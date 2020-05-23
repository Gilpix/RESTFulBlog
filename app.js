var express     =require("express"),
    methodOverride=require("method-override"),
    app         =express(),
    bodyParser  =require("body-parser"),
    expressSanitizer=require("express-sanitizer"),
    mongoose    =require("mongoose");
    
    
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost:27017/rest_blog", {useNewUrlParser: true });
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set("view engine","ejs");
app.use(methodOverride("_method"))
app.use(expressSanitizer());
    

//SCHEMS : 
var blogSchema = new mongoose.Schema({
    title :String,
    image:String,
    body:String,
    created:{type:Date,default: Date.now}
});

var Blog = mongoose.model("Blog",blogSchema);

// Blog.create({
//     title:"Test Blog",
//     image:"https://cb-production.sfo2.cdn.digitaloceanspaces.com/property/5e335664bd9eb700268e40e5/Course%20pic_600_thumb.webp",
//     body:"This is just testing"
// });

app.get("/",function(req, res) {
    res.redirect("/blogs")
});

//INDEX ROUTE
app.get("/blogs",function(req,res){
    Blog.find({},function(err,allBlogs){
        if(err)
            console.log("error");
        else
            res.render("index",{blogs:allBlogs});
    })
})

//New-Route
app.get("/blogs/new",function(req, res) {
    res.render("new")
})
//CREATE-Route
app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,blog){
        if(err)
            console.log("Error")
        else
            res.redirect("/blogs")
    });
})

//SHOW - Route
app.get("/blogs/:id",function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
            console.log("error : "+err)
        else
            res.render("show",{blog:foundBlog});
    })
})

//EDIT - Route
app.get("/blogs/:id/edit",function(req, res) {
    Blog.findById(req.params.id,function(err,updateBlog){
        if(err)
            console.log("error : "+err)
        else 
            res.render("edit",{blog:updateBlog});
    })
})

//Update - Route
app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err)
             console.log("error")
        else
            res.redirect("/blogs/"+req.params.id);
    })
})


//DELETE - Route
app.delete("/blogs/:id",function(req,res){
   
    Blog.findByIdAndDelete(req.params.id,function(err,deletedBlog){
          if(err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs");
    });
})


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server stated....")
});





