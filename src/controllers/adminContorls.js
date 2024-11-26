import Admin from "../models/Admin.js";
import Creator from "../models/creator.model.js";
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken";
import deals from "../models/deals.model.js";



export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    console.log("admin", admin);
    if (admin && bcrypt.compareSync(password, admin.password)) {
      const token = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.SECRET_KEY,
        { expiresIn: "24h" }
      );
      const options = {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        sameSite: "none", // Required for cross-origin requests
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      };
      console.log("token",token)
      res.status(200).cookie("adminToken", token, options).json({
        success: true,
        message: "Admin login successfull",
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
export const adminSignup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res
      .status(403)
      .json({ message: "Incomplete fields", success: false });
  // const existingAdmin = await Admin.find({ email });

  // if (existingAdmin.length > 0) {
  //   return res.status(403).json({
  //     success: false,
  //     message: "User with same E-mail already exists",
  //   });
  // }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await Admin.create({
    name: name,
    email: email,
    password: hashedPassword,
  });
  // const data = {
  //   name,
  //   email,
  //   brand: isChecked,
  // };
  console.log(newUser);
  if (!newUser) {
    return res
      .status(500)
      .json({ message: "Error occured while creating user", success: false });
  }

  return res.status(200).json({
    success: true,
    message: "signup successfull wait for approval",
  });
};
export const getPendingCreators = async (req, res) => {
  try {
    const creators = await Creator.find({ approved: "pending" }).sort({
      createdAt: -1,
    });
    res.status(200).json(creators);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching pending creators",
        error: error.message,
      });
  }
};


export const getApprovedCreators = async (req, res) => {
  try {
    const creators = await Creator.find({ approved: "true" }).sort({
      createdAt: -1,
    });
    res.status(200).json(creators);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching approved creators', error: error.message });
  }
};

export const toggleApprovalStatus = async (req, res) => {
  const { id } = req.params; 

  try {
    // Find the creator by ID
    const creator = await Creator.findById(id);

    if (!creator) {
      return res.status(404).json({ 
        success:false, 
        message: "Creator not found" });
    }

    // Toggle the `approved` field
    creator.approved = creator.approved === "pending" ? "true" : "pending";

    // Save the updated document
    await creator.save();

    res.status(200).json({
        success:true,
         message: "Approval status updated", creator });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating approval status",
        error: error.message,
      });
  }
};
export const deleteCreator = async (req, res) => {
  try {
    const creatorId = req.params.id;
    console.log("creatorId", creatorId);
    // Find the creator by ID and delete
    const creator = await Creator.findByIdAndDelete(creatorId);

    if (!creator) {
      return res.status(404).json({ message: "Creator not found" });
    }

    return res.status(200).json({ message: "Creator deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getPendingDeals = async (req, res) => {
  try {
    const Deals = await deals
      .find({ approved: "pending" })
      .sort({ createdAt: -1 });
    res.status(200).json(Deals);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching pending creators",
      error: error.message,
    });
  }
};
export const getApprovedDeals = async (req, res) => {
  try {
    const Deals = await deals
      .find({ approved: "true" })
      .sort({ createdAt: -1 });
    res.status(200).json(Deals);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error fetching approved creators",
        error: error.message,
      });
  }
};
export const toggleApprovalStatusDeals = async (req, res) => {
  const { id } = req.params;
console.log("id",id)
  try {
    // Find the creator by ID
    const Deals = await deals.findById(id);
    console.log("deal",Deals)
    if (!Deals) {
      return res.status(404).json({
        success: false,
        message: "Creator not found",
      });
    }

    // Toggle the `approved` field
    Deals.approved = Deals.approved === "pending" ? "true" : "pending";
    console.log("approvel",Deals.approved);
    // Save the updated document
    try {
      await Deals.save();
      console.log("deal saved", Deals);

      return res.status(200).json({
        success: true,
        message: "Approval status updated",
        Deals,
      });
    } catch (saveError) {
      console.error("Error saving deal:", saveError.message);
      return res.status(500).json({
        success: false,
        message: "Failed to save the deal",
        error: saveError.message,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error updating approval status",
      error: error.message,
    });
  }
};
export const deleteDeal = async (req, res) => {
  try {
    const DealsId = req.params.id;
    console.log("creatorId", DealsId);
    // Find the creator by ID and delete
    const Deals = await deals.findByIdAndDelete(DealsId);

    if (!Deals) {
      return res.status(404).json({ message: "Creator not found" });
    }

    return res.status(200).json({ message: "Creator deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};