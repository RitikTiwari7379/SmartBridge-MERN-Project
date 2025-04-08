const express = require("express");
const router = express.Router();
const passport = require("passport");
const Song = require("../model/Song");
const User = require("../model/User");

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // req.user getss the user because of passport.authenticate
    const { name, thumbnail, track } = req.body;
    if (!name || !thumbnail || !track) {
      return res
        .status(301)
        .json({ err: "Insufficient details to create song." });
    }
    const artist = req.user._id;
    const songDetails = { name, thumbnail, track, artist };
    const createdSong = await Song.create(songDetails);
    return res.status(200).json(createdSong);
  }
);

// Get route to get all songs I have published.
router.get(
  "/get/mysongs",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // We need to get all songs where artist id == currentUser._id

    const songs = await Song.find({ artist: req.user._id }).populate("artist");
    return res.status(200).json({ data: songs });
  }
);

// Get route to get all songs any artist has published
// I will send the artist id and I want to see all songs that artist has published.
router.get(
  "/get/artist/:artistId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { artistId } = req.params;
    // We can check if the artist does not exist
    const artist = await User.findOne({ _id: artistId });
    // ![] = false
    // !null = true
    // !undefined = true
    if (!artist) {
      return res.status(301).json({ err: "Artist does not exist" });
    }

    const songs = await Song.find({ artist: artistId });
    return res.status(200).json({ data: songs });
  }
);

router.get(
  "/get/songname/:songName",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { songName } = req.params;

    // name:songName --> exact name matching. Vanilla, Vanila
    // Pattern matching instead of direct name matching.
    const songs = await Song.find({ name: songName }).populate("artist");
    return res.status(200).json({ data: songs });
  }
);

// // Delete song by ID
// router.delete("/:id", async (req, res) => {
//   await Song.findByIdAndDelete(req.params.id);
//   res.status(200).send({ message: "Song deleted sucessfully" });
// });

// // Like song
// router.put("/like/:id", async (req, res) => {
//   let resMessage = "";
//   const song = await Song.findById(req.params.id);
//   if (!song) return res.status(400).send({ message: "song does not exist" });

//   const user = await User.findById(req.user._id);
//   const index = user.likedSongs.indexOf(song._id);
//   if (index === -1) {
//     user.likedSongs.push(song._id);
//     resMessage = "Added to your liked songs";
//   } else {
//     user.likedSongs.slice(index, 1);
//     resMessage = "Removed from your liked songs";
//   }

//   await user.save();
//   res.status(200).send({ message: resMessage });
// });

// // Get liked songs
// router.get("/like", async (req, res) => {
//   const user = await User.findById(req.user._id);
//   const songs = await Song.find({ _id: user.likedSongs });
//   res.status(200).send({ data: songs });
// });

module.exports = router;
