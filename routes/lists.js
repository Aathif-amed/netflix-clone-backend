const router = require("express").Router();
const List = require("../models/List");
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

//GET ALL LIST

router.get("/", authenticate, async (req, res) => {
  const typeQuery = req.query.type;
  const genreQuery = req.query.genre;
  let list = [];
  try {
    if (typeQuery) {
      if (genreQuery) {
        list = await List.aggregate([
          { $sample: { size: 10 } },
          { $match: { type: typeQuery, genre: genreQuery } },
        ]);
      }
      else {
        list = await List.aggregate([
            { $sample: { size: 10 } },
            { $match: { type: typeQuery} },
          ]);
      }
    } else {
      list = await List.aggregate([{ $sample: { size: 10 } }]);
    }
    return res.status(201).json(list);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong..!" });
  }
});

//CREATE MOVIE BY ADMIN

router.post("/", authenticate, async (req, res) => {
  if (req.user.isAdmin) {
    const newList = new List(req.body);

    try {
      const savedList = await newList.save();
      return res.status(201).json(savedList);
    } catch (error) {
      console.log(error);
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
      await List.findByIdAndDelete(req.params.id);
      return res.status(201).json({ message: "Deleted Successfully..!" });
    } catch (error) {
      return res.status(500).json({ message: "Something Went Wrong..!" });
    }
  } else {
    return res.status(403).json({ message: "Unauthorized..!" });
  }
});

module.exports = router;
