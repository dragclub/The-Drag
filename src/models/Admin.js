import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  role:{
    type:String,
    default:'pending'
  },
  token: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
