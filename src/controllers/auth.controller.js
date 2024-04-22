import jwt from "jsonwebtoken";
import User from "../database/schema/user.schema.js";
import { ErrorWithStatus } from "../exceptions/error_with_status.exception.js";
import bcrypt from "bcrypt";

//The Login Endpoint
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(user);
    //Check for user
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    //Check if password is correct
    console.log(password);
    console.log(user.password);
    const passwordCheck = await bcrypt
      .compare(password, user.password)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(passwordCheck);
    if (!passwordCheck) {
      throw new ErrorWithStatus("Password not correct", 401);
    }
    //Now that everything passes, let's grant them access token
    const JWT_SECRET = process.env.JWT_SECRET || "SomeLongassBlockOfText";
    const token = jwt.sign(
      {
        role: user.role || "USER",
        email: user.email,
        _id: user._id,
        sub: user._id,
      },
      JWT_SECRET,
      {
        expiresIn: "60m",
      }
    );
    res.json({
      message: "Login Successful",
      data: {
        accessToken: token,
      },
    });
  } catch (err) {
    res.status(err.status || 500);
    res.json({ message: err.message });
  }
};

//Registration Endpoint
export const signup = async (req, res) => {
  try {
    console.log(req.body);
    var { firstname, lastname, email, password, role } = req.body;
    const user = await User.findOne({ email });
    //check if user exists and stop if it does
    if (user) {
      throw new ErrorWithStatus("User already exists.", 404);
    }
    const saltRounds = 10;
    //If user doesn't exist, continue
    password = await bcrypt //For some reason, simply using the hash function does not work. Wierd, i know, but what can you do?
      .hash(password, saltRounds)
      .then((hash) => {
        return hash;
      })
      .catch((err) => console.error(err.message));

    console.log(password);
    const newUser = new User({
      firstname,
      lastname,
      email,
      password,
      role,
    });
    await newUser.save();
    delete newUser.password;
    res.json({
      message: "User created successfully",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(err.status || 500);
    res.json({ message: err.message });
  }
};
