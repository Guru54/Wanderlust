if (process.env.ENV_V !== "production") {
    require("dotenv").config();
}


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const ExpressError = require('./utils/expressError.js');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user.js');

const listingRouter = require('./routes/listings.js');
const reviewRouter = require('./routes/reviews.js');
const userRouter = require('./routes/users.js');

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


const dbUrl = process.env.ATLASDB_URL || 'mongodb://localhost:27017/wanderlust';

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});
async function main() {
    await mongoose.connect(dbUrl);
}


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // time period in seconds
});
store.on("error", function (e) {
    console.log("Session store error", e);
});
const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24*7, // 7 day
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24*7), // 7 days
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    },
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
  //  console.log(res.locals.success);
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    
    next();
});


app.get('/', (req, res) => {
    res.render(index.ejs);
    
});

// app.get("/demouser", async (req,res)=>{
//     let fakeUser = new User({
//         username: "demoUser",
//         email: "hiii@gmail.com",
//     })
//     let registeredUser = await User.register(fakeUser, "124");
//     console.log(registeredUser);
//     res.send(registeredUser);
// })

app.use('/', userRouter);

app.use('/listings', listingRouter);

app.use('/listings/:id/reviews', reviewRouter);



app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});
app.use((err, req, res, next) => {
    let {statusCode =500, message="something went wrong"} = err;
// this is the default error handler for express the status code is 500 and the message is something went wrong 
  //  res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", {err});
});
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
// my name is not 
// atlas pas = K7a4ifOWroGJnIjY
//username = gurudasbhardwaj455
//mongodb+srv://gurudasbhardwaj455:K7a4ifOWroGJnIjY@cluster0.lku00eu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0