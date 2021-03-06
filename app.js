if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// console.log(process.env.secret);

const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const path = require("path");
const methodOverride = require("method-override");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
// const { read } = require('fs');

const connectionURL = process.env.URL || "mongodb://localhost:27017/yelp-camp";

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static("public"));
// app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: "thisshouldbeabettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.use((req, res, next) => {
//     console.log(req.session);
//     console.log(req.originalUrl);
//     res.locals.currentUser = req.user;
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// });

// Bug solve
app.use((req, res, next) => {
  // console.log(req.originalUrl);
  if (!["/login", "/", "/register"].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  // console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//  USERS ROUTES
app.use("/", userRoutes);

// CAMPGROUND ROUTES USE
app.use("/campgrounds", campgroundRoutes);

// REVIEWS ROUTES USE
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  // if (!err.statusCode) err.statusCode = 500;
  if (!err.message) err.message = "OH BOY, SOMETHING went wrong!";
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("SERVING ON PORT 3000!");
});
