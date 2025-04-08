const express = require("express");
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("./model/User");
const authRoutes = require("./routes/authRoute");
const songRoutes = require("./routes/songRoute");
const PlaylistRoutes = require("./routes/playlistRoute");
const app = express();
const cors = require("cors");
const port = 80;
app.use(express.json());
app.use(cors());

// connect mongodb to our node app.
// mongoose.connect() takes 2 arguments : 1. Which db to connect to (db url), 2. 2. Connection options
mongoose
  .connect(
    "mongodb+srv://ritikamethi:thor@cluster0.jlprj1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
    }
  )
  .then((x) => {
    console.log("Connected to Mongo!");
  })
  .catch((err) => {
    console.log(err, "Error while connecting to Mongo");
  });

// setup passport-jwt

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "thisKeyIsSupposedToBeSecret";
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({ _id: jwt_payload.identifier }, function (err, user) {
      // done(error, doesTheUserExist)
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);

// API : GET type : / : return text "Hello world"

app.use("/auth", authRoutes);
app.use("/song", songRoutes);
app.use("/playlist", PlaylistRoutes);

// app.get("/logout", authRoutes, async (req, res) => {
//   try {
//     console.log("logout succ");
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// Now we want to tell express that our server will run on localhost:8000
app.listen(port, () => {
  console.log("App is running on port " + port);
});
