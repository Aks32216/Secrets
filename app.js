const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const saltRounds=10;

const app=express();    

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});

const User=new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
})

app.route("/login")
.get((req,res)=>{
    res.render("login");
})
.post((req,res)=>{
    const emailAuth=req.body.username;
    const passwordAuth=req.body.password;
    
    User.findOne({email:emailAuth},(err,foundUser)=>{
        if(err)
            console.log(err);
        else{
            if(foundUser)
            {
                bcrypt.compare(passwordAuth, foundUser.password, function(err, result) {
                    if(result===true)
                        res.render("secrets");
                });        
            }
        }
    })
});

app.route("/register")
.get((req,res)=>{
    res.render("register");
})
.post((req,res)=>{
    const newEmail=req.body.username;
    const newPassword=req.body.password;
    bcrypt.hash(newPassword, saltRounds, function(err, hash) {
        const newUser=new User({
            email:newEmail,
            password:hash
        })
        newUser.save((err)=>{
            if(err)
                console.log(err);
            else
                res.render("secrets");
        });         
    });
});

app.listen(3000,()=>{
    console.log("server started sucessfully");
})
