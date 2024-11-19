import mongoose from 'mongoose'
import { mailSender } from '../utils/mailSender.js';
import { otpEmail } from '../emailTemplate/otpTemplate.js';



const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300,
  },
});

// a fn to send email

async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "verification email from DRAG",
      otpEmail(otp)
    );

    console.log("email response ", mailResponse);
  } catch (error) {
    console.log("error  in sending email", error);
    throw error;
  }
}
// pre middleware
OTPSchema.pre("save", async function (next) {
  //+
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }

  next();
});


const OTP = mongoose.model("OTP", OTPSchema);

export default OTP;