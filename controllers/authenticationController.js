import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import userSchema from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    //get data
    const { name, email, password, phone, address } = req.body;

    //check if all data are there or not
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
        error,
      });
    }
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
        error,
      });
    }
    if (!password) {
      return res.status(400).send({
        success: false,
        message: "Password is required",
        error,
      });
    }
    if (!phone) {
      return res.status(400).send({
        success: false,
        message: "Phone is required",
        error,
      });
    }
    if (!address) {
      return res.status(400).send({
        success: false,
        message: "Address is required",
        error,
      });
    }

    //check if user already exists
    const existinguser = await userSchema.findOne({ email });

    if (existinguser) {
      return res.status(400).send({
        success: true,
        message: "User already exists. Please Login",
      });
    }

    //registering user
    const hashedPassword = await hashPassword(password);

    const user = await new userSchema({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
    }).save();

    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
      return res.status(400).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    //check if user exists
    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Invalid password",
      });
    }

    //token
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

export const testController = async (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};
