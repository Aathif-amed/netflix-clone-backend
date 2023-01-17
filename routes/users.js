const router = require("express").Router();
const User = require("../models/User");
const authenticate = require("../utils/verifyToken");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//UPDATE

router.put("/:id", authenticate, async (req, res) => {
  if (req.user.id == req.params.id || req.params.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.CRYPTO_SECRET_KEY
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      return res
        .status(200)
        .json({ ...updatedUser, message: "Updated successfully..!" });
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(403).json({ message: "Unauthorized..!" });
  }
});
//DELETE
router.delete("/:id", authenticate, async (req, res) => {
  if (req.user.id == req.params.id || req.params.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id, function (err) {
        if (err) {
          return res.status(500).json({ message: "Internal Error..!" });
        }
      });
      return res.status(200).json({ message: "User deleted successfully..!" });
    } catch (err) {
      return res.status(500).json({ message: "Something Went Wrong..!" });
    }
  } else {
    return res.status(403).json({ message: "Unauthorized..!" });
  }
});
//GET
router.get("/find/:id", authenticate, async (req, res) => {
  try {
    const user = User.findById(req.params.id);
    if (!user) {
      return await res.status(401).json({ message: "Username  Incorrect..!" });
    }
    const { password, ...info } = user._doc;
    return res.status(200).json(...info);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

//GET ALL BY ADMIN
router.get("/", authenticate, async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query
        ? await User.find().sort({ _id: -1 }).limit(10)
        : await User.find();
      return res.status(200).json(users);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json({ message: "Unauthorized..!" });
  }
});
//GET USER STATS
router.get("/stats", authenticate, async (req, res) => {
  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Something Went Wrong..!" });
  }
});

module.exports = router;
