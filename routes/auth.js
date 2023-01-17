const router = require("express").Router();
const User = require("../models/User");
const Token = require("../models/Token");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register

router.post("/register", async (req, res) => {
  try {
    encryptedPassword = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.CRYPTO_SECRET_KEY
    ).toString();
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: encryptedPassword,
    });
    const user = await newUser.save();
    return await res.status(201).json(user);
  } catch (err) {
    return await res.status(500).json({ message: "Something Went Wrong..!" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) { 
      return await res.status(401).json({ message: "Username or Password Incorrect..!" });
    }
    const bytes = CryptoJS.AES.decrypt(
      user.password,
      process.env.CRYPTO_SECRET_KEY
    );
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "24h" }
    );
    if (originalPassword !== req.body.password) {
      return await res
        .status(401)
        .json({ message: "Username or Password Incorrect..!" });
    }
    const { password, ...info } = user._doc;
    return await res.status(201).json({...info,accessToken});
  } catch (err) {
    return await res.status(401).json({ message: "Something Went Wrong..!" });
  }
});
// router.post("/forgotPassword", async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) { 
//       return await res.status(401).json({ message: "User not found..!" });
//     }
//     const accessToken = jwt.sign(
//       { id: user._id, isAdmin: user.isAdmin },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "30m" }
//     );

//     let token = await Token.findOne({ userId: User._id });
//     if (!token) {
//       token = await new Token({
//         userId: user._id,
//         token: accessToken,
//       }).save();
//     }
//     const link = `${process.env.BASE_URL}/api/auth/password-reset/${user._id}/${token.token}`;
//     await sendEmail(user.email, "Password-reset-Link", link);

//     return res.status(200).send("reset link sent");
//   } catch (error) {
//     console.log(error);
//     return res.status(401).send(error);
//   }
// });

// router.post("/password-reset/:userId/:token", async (req, res) => {
//     try {
 
//       const user = await User.findById(req.params.userId);
//       if (!user) {
//         console.log("User not Found");
//         return res.status(401).send("Invalid Link");
//       }
  
//       const token = await Token.findOne({
//         userId: user._id,
//         token: req.params.token,
//       });
//       if (!token) {
//         return res.status(401).send("Invalid Link or token expired");
//       }
  
//       User.password = req.body.password;
//       await User.save();
//       await token.delete();
//       return res.status(200).send("password reset successfull");
//     } catch (error) {
//       console.log(error);
//       return res.status(401).send(error, "reset error -b");
//     }
//   });
    module.exports = router;