import User from "../Models/UserModels.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

// SIGNUP ROUTE
export const signup = async (req, res) => {
  const { email, password, name } = req.body

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ success: false, message: "Please Login" });
    }

    const securePassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: securePassword,
    });

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Signup Successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// LOGIN ROUTE
export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Please Signup" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ success: true, token });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


// LOGOUT ROUTE
export const logout = async (req, res) => {
  try {
    // Remove token from localStorage
    localStorage.removeItem("token");
    res.status(200).json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET USER ROUTE
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// RESET PASSWORD ROUTE
export const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const generateOtp = Math.floor(Math.random() * 10000);

    let user = User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Please Signup" });
    }

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "khanfaez2@gmail.com",
        pass: process.env.Gpassword,
      },
    });

    const info = await transporter.sendMail({
      from: "khanfaez2@gmail.com",
      to: email,
      subject: "New OTP has been generated",
      html: `<h3>Your Generated Otp is : <i>${generateOtp}</i></h3>`,
    });

    if (info.messageId) {
      await User.findOneAndUpdate(
        { email },
        {
          $set: {
            otp: generateOtp,
          },
        }
      );
      return res
        .status(200)
        .json({ success: true, message: "Otp has been sent to your email" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// VERIFY OTP ROUTE
export const verifyOtp = async (req, res) => {
  try {
    const {otp,newPassword } = req.body;
    const securePassword = await bcrypt.hash(newPassword, 10);

    let user = await User.findOneAndUpdate(
      { otp },
      {
        $set: {
          password: securePassword,
          otp: 0,
        },
      }
    );

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Otp" });
    }

    return res.status(200).json({ success: true, message: "Password Updated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
