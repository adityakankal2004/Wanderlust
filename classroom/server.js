const express = require("express");
const app = express();
const users = require("./routes/users.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine","ejs");
app.set("views" , path.join(__dirname, "views"));

//Middlewares
app.use(session({ secret: "mysupersecret",resave:false,saveUninitialized:true}));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.errorMsg = req.flash("error");
    res.locals.Successmessage = req.flash("success");
    next();
})

app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;
    req.session.name = name;

    if (name === "anonymous"){
        req.flash("error","some error occurred");
    } else {
        req.flash("success","user registered succesfully");
    }
    res.redirect("/name");
});

app.get("/name",(req,res)=>{
    res.render("error.ejs",{name:req.session.name});
});

// app.get("/getCount",(req,res)=>{
//     if(req.session.count){
//         req.session.count ++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`Your number count is ${req.session.count}`);
// });

// app.get("/test",(req,res)=>{
//     res.send("succesfull");
// });

// app.get("/waste",(req,res)=>{
//     res.send("succesfully wasted");
// });

app.listen(3000,()=>{
    console.log("server is listening");
});
