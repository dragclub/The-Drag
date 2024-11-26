import { resetPasswordEmail } from "../emailTemplate/resetLinkTemplate.js";
import User from "../models/user.model.js";
import {mailSender} from "../utils/mailSender.js";
import bcrypt from "bcrypt";
import crypto from "crypto";


export const resetPasswordToken = async (req, res) => {
  try {
    // fetch email
    const email = req.body.email;

    // check user // email validation
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "user do not exitst please register your self",
      });
    }

    //generate token
    const token = crypto.randomUUID();

    //update user adding token and expiration time
    const updateDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    console.log("updateDetails", updateDetails);
    //create url
    const url = `https://thedrag.in/update-password/${token}`;
    //send email containing the url
    await mailSender(
      email,
      "Password Reset Link",
      resetPasswordEmail(url)
    );
    // return response
    return res.status(200).json({
      success: true,
      message: "reset link sent ",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error during sending email",
    });
  }
};

//reset password handler

export const resetPassword = async (req, res) => {
  try {
    //data fetch
    const { password, confirmPassword, token } = req.body;
    //validation

    if (confirmPassword !== password) {
      return res.status(400).json({
        success: false,
        message: " The password and confirm password do not match.",
      });
    }
    //get user details
    const userDetails = await User.findOne({ token: token });
    //if no entry - no token
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    //token expiry
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Token is expire",
      });
    }
    //hash password
   const hashedPassword = await bcrypt.hash(password, 10);
    //update password
    
    const updateUserDetails = await User.findOneAndUpdate(
      { token: token },
      {
        password: hashedPassword,
      },
      { new: true }
    );
    console.log("response of update",updateUserDetails)
    //response return
    return res.status(200).json({
      success: true,
      message: "password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error occur during changing password",
    });
  }
};
