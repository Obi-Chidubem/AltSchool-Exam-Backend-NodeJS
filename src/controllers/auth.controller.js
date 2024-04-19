import jwt from "jsonwebtoken";
import User from "../database/schema/user.schema.js";
import { ErrorWithStatus } from "../exceptions/error_with_status.exception.js";
import bcrypt from "bcrypt";

//The Login Endpoint
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    //Check for user
    if (!user) {
      throw new ErrorWithStatus("User not found", 404);
    }
    //Check if password is correct
    if (bcrypt.compareSync(password, user.password)) {
      throw new ErrorWithStatus("Password not correct", 404);
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
    re.json({ message: err.message });
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
      throw new ErrorWithStatus("User aready exists.", 404);
    }
    //If user doesn't exist, continue
    password = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstname,
      lastname,
      email,
      password,
      role,
    });
    await newUser.save();
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
