import JWT from "jsonwebtoken";
import userSchema from "../models/userModel.js";

//protected Routes token based
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "session expired",
      success: false,
      error,
    });
  }
};

//admin middleware
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        message: "Unauthorized",
        success: false,
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "session expired",
      success: false,
      error,
    });
  }
};
