// // Navigation: Going from  one webpage to another webpage
// import http from "http";
// import gfName from "./features.js";
// import {} from "./features.js";

// import fs from "fs";

// const home = fs.readFileSync("./index.html");

// import { generatePercent } from "./features.js";

// console.log(generatePercent());

// console.log(gfName);

// const server = http.createServer((req, res) => {
//   if (req.url === "/about") {
//     res.end("<h1>About Page</h1>");
//   } else if (req.url === "/") {
//     res.end(home);
//   } else if (req.url === "/contact") {
//     res.end("<h1>Contact Page</h1>");
//   } else {
//     res.end("<h1>Page Not Found</h1>");
//   }
// });

// server.listen(5000, () => {
//   console.log("Server is working");
// });

//ExpressJS

// import express from "express";

// const app = express();

// // setting up view engine
// app.set("view engine","ejs");

// app.get("/", (req, res)=>{
//     res.render("index", {name: "Rohan"});
// });

// app.listen(5000,()=> {
//     console.log("Server is working");
// })

import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbname: "backend",
  })
  .then(() => console.log("Database Connected"))
  .catch((e) => console.log(e));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

const app = express();

const users = [];

//express static
// Using middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Setting up View Engine
app.set("view engine", "ejs");

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const decoded = jwt.verify(token, "sdfafeaf");
    req.user = await User.findById(decoded._id)
    next();
  } else {
    res.redirect("/login");
  }
};

app.get("/", isAuthenticated, (req, res) => {
  res.render("logout", {name: req.user.name});
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/login", async(req,res) => {
  const {email, password} = req.body;
  
  let user = await User.findOne({email});
  
  if(!user) return res.redirect("/register");
  
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) return res.render("login", {email, message:"Incorrect Password"});

  const token = jwt.sign({ _id: user._id}, "sdfafeaf");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.post("/register", async (req, res) => {
  const{name,email, password} = req.body;

  let user = await User.findOne({email});
  if(user){
    return res.redirect("/login");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    name,
    email, 
    password: hashedPassword,
  });

  const token = jwt.sign({ _id: user._id}, "sdfafeaf");

  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.get("/logout", (req,res) => {
  res.cookie("token", null, {
    httpOnly: true, 
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.listen(5000, () => {
  console.log("Server is working");
});
