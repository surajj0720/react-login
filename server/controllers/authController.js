const User = require("../models/user");
const { hashPassword, comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");

const test = (req, res, next) => {
  res.json("HELLO JII");
};

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // check for name
    if (!name) {
      return res.json({
        error: "Name is required",
      });
    }

    // check for password
    if (!password || password < 6) {
      return res.json({
        error: "Password is required and should be greater than 6",
      });
    }

    if (!email) {
      return res.json({
        error: "email is Required",
      });
    }

    // check email
    const exist = await User.findOne({ email });

    if (exist) {
      return res.json({
        error: "User Already Exist",
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.json(user);
  } catch (error) {
    return res.json(`Error - ${error}`);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.json({
        error: "email is Required",
      });
    }

    if (!password) {
      return res.json({
        error: "Password is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        error: "No User Found",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.json({
        error: "Wrong Credentials",
      });
    }

    jwt.sign(
      { email: user.email, id: user._id, name: user.name },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json(user);
      }
    );
  } catch (error) {
    console.log(`Error - ${error}`);
  }
};

const getProfile = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.json(null);
  }
  jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
    if (err) throw err;
    return res.json(user);
  });
};

module.exports = {
  test,
  registerUser,
  loginUser,
  getProfile,
};
