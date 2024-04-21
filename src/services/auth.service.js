import jwt from "jsonwebtoken";
import { ErrorWithStatus } from "../exceptions/error_with_status.exception.js";

const authService = (req, res) => {
  const authHeader = req.headers.authorization;
  //check if the authorization header exists at all
  if (!authHeader) {
    throw new ErrorWithStatus("No AuthToken", 401);
  }

  const token = authHeader.split(" ");

  //check if the token is attatched to the bearer
  if (token.length !== 2) {
    throw new ErrorWithStatus("No AuthToken", 401);
  }

  //if it's all good, then continue
  // console.log("Token " + token[1]);
  jwt.verify(token[1], process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized || Expired Token" });
    }
    // console.log("User " + user);
    req.user = user;
  });
  return req.user;
};

export default authService
