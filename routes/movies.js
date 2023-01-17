const router = require("express").Router();
const Movie = require("../models/Movie");
const authenticate = require("../utils/verifyToken");

//GET MOVIE BY ID

router.get("/find/:id", authenticate, async (req, res) => {
  try {
    const movies = await Movie.findById(req.params.id);
    return res.status(201).json(movies);
  } catch (error) {
    return res.status(500).json({ message: "Something Went Wrong..!" });
  }
});

//GET RANDOM MOVIE

router.get("/random", authenticate, async (req, res) => {
  const type = req.query.type;
  let data;
  try {
    if (type === "series") {
      data = await Movie.aggregate([
        {
          $match: { isSeries: true },
        },
        { $sample: { size: 1 } },
      ]);
    } else {
      data = await Movie.aggregate([
        {
          $match: { isSeries: false },
        },
        { $sample: { size: 1 } },
      ]);
    }
    return res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Something Went Wrong..!" });
  }
});

//GET ALL MOVIE BY ADMIN

router.get("/", authenticate, async (req, res) => {
  console.log(req.user.isAdmin);
  if (req.user.isAdmin) {
    try {
      const movies=await Movie.find();
      return res.status(201).json(movies.reverse());
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something Went Wrong..!" });
    }
  } else {
    return res.status(403).json({ message: "Unauthorized..!" });
  }
});

//CREATE MOVIE BY ADMIN

router.post("/", authenticate, async (req, res) => {
  console.log(req.user.isAdmin);
  if (req.user.isAdmin) {
    const newMovie = new Movie(req.body);

    try {
      const savedMovie = await newMovie.save();
      return res.status(201).json(savedMovie);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Something Went Wrong..!" });
    }
  } else {
    return res.status(403).json({ message: "Unauthorized..!" });
  }
});

//UPDATE MOVIE BY ADMIN

router.put("/:id", authenticate, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      return res.status(201).json(...updatedMovie);
    } catch (error) {
      return res.status(500).json({ message: "Something Went Wrong..!" });
    }
  } else {
    return res.status(403).json({ message: "Unauthorized..!" });
  }
});

//DELETE MOVIE BY ADMIN

router.delete("/:id", authenticate, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const updatedMovie = await Movie.findByIdAndDelete(req.params.id);
      return res.status(201).json({ message: "Deleted Successfully..!" });
    } catch (error) {
      return res.status(500).json({ message: "Something Went Wrong..!" });
    }
  } else {
    return res.status(403).json({ message: "Unauthorized..!" });
  }
});

module.exports = router;
