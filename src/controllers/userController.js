import User from "../models/user.model.js";
import Creator from '../models/creator.model.js'


import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config();

export const createUser = async (req, res) => {

  const { name, email, password ,isChecked} = req.body;

  if (!name || !email || !password) return res.status(403).json({ error: "Incomplete fields", success: false });
  const existingUser = await User.find({ email });

  if (existingUser.length > 0) {
    return res.status(403).json({ success: false, error: "User with same E-mail already exists" });
  }

  const newUser = await User.create({
    name: name,
    email: email,
    password: password,
    brand: isChecked,
  });
  const data = {
    name,
    email,
    brand:isChecked
  }
  console.log(newUser);
  if (!newUser) return res.status(500).json({ error: "Error occured while creating user", success: false });
  const token = jwt.sign(data, process.env.SECRET_KEY);
  const options = {
    httpOnly: true,
    secure: true,
path:'/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'Lax'

  }

  return res.status(201).cookie("accessToken", token,options).json({
    newUser,
    success: true,
    iscreator:"false",
    email
  }
  );

}

export const userLogin = async (req, res) => {
  try {

    const { email, password } = req.body;
    if (!email || !password) return res.status(403).json({ success: false, error: "Complete all the fields" });

    const user = await User.findOne({ email, password });
    if (!user) return res.status(404).json({ success: false, error: "User not found! Go to Signup " });
    const data = {
      name: user.name,
      email: email,
      brand: user.brand
    }
    const token = jwt.sign(data, process.env.SECRET_KEY);
    const creator = await Creator.findOne({ email: email });
    let iscreator;

    if (creator == null) {
      iscreator = 'false';
    }
    else{
      iscreator=creator.approved;
    }
    

    const options = {
      httpOnly: true,
      secure: true,
path:'/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'Lax'

    }
    console.log(iscreator);
    return res
      .status(200)
      .cookie("accessToken", token, options)
      .json({
        success: true,
        user,
        iscreator,
        email
      });

  } catch (error) {

    return res.status(500).json("Internal server error");
  }
}




export const getalldata = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const data = await Creator.aggregate([
      {
        $match: { approved: "true" },
      },
      {
        $addFields: {
          totalCount: {
            $add: [
              { $ifNull: ["$socialMedia.insta.count", 0] },
              { $ifNull: ["$socialMedia.twitter.count", 0] },
              { $ifNull: ["$socialMedia.linkedin.count", 0] },
              { $ifNull: ["$socialMedia.youtube.count", 0] },
              { $ifNull: ["$socialMedia.facebook.count", 0] },
            ],
          },
        },
      },
      {
        $sort: { totalCount: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);

    // Optionally, get total count of documents for pagination metadata
    const totalDocuments = await Creator.countDocuments({ approved: true });
    const totalPages = Math.ceil(totalDocuments / limit);

    return res.status(200).json({
      data,
      currentPage: page,
      totalPages,
      totalDocuments,
      
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};


export const logout = (req, res) => {
  if (req.cookies && req.cookies["accessToken"]) {
    console.log(req.cookies["accessToken"]);
    return res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: 'None' }).json({ message: "You are logged out" });

  }
  return res.json({ message: "you are already logged out" });
}

export const handlesearch = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 1;
  console.log("limit",limit) 
  const { search } = req.body; 

  if (!search) {
    return res.status(200).json({ success: true, data: [] });
  }

  // Fetch all creators
  const allCreators = await Creator.find({});

  // Filter creators based on the search term
  const reqcreators = allCreators.filter((creator) =>
    creator.userName.toLowerCase().includes(search.toLowerCase())
  );

  // Sort the filtered creators based on social media counts
  const finalcreators = reqcreators.sort((a, b) => {
    const { insta, twitter, facebook, linkedin, youtube } = a.socialMedia;
    const totala =
      insta.count +
      twitter.count +
      facebook.count +
      linkedin.count +
      youtube.count;
    const totalb =
      b.socialMedia.insta.count +
      b.socialMedia.twitter.count +
      b.socialMedia.linkedin.count +
      b.socialMedia.facebook.count +
      b.socialMedia.youtube.count;

    return -1 * (totala - totalb);
  });

  // Implement pagination
  const totalCreators = finalcreators.length;
  const totalPages = Math.ceil(totalCreators / limit);
  const offset = (page - 1) * limit;

  // Get the paginated creators
  const paginatedCreators = finalcreators.slice(offset, offset + limit);

  return res.status(200).json({
    success: true,
    data: paginatedCreators,
    totalCreators,
    totalPages,
    currentPage: page,
    pageSize: limit,
  });
};





// export const handleContact = async (req, res) => {
//   const token = req.cookies["accessToken"];
//   const user = jwt.verify(token, process.env.SECRET_KEY);
//   const email = user.email;
//   const creator = await Creator.findOne({ email: email });
//   if(creator.approved!=="true"){
//     return res.status(500).json({ success: false, error: error.toString() });
//   }
//   const creatorEmail = req.body.creatormail;
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'thedrag.website@gmail.com',
//       pass: 'mnbsroulfuvwcfrb',
//     },
//   });

//   const mailOptions = {
//     from: 'Drag <thedrag.website@gmail.com>',
//     to: creatorEmail,

//     attachments: (req.file)?[{ filename: req.file.filename, path: req.file.path }]:null,
//     cc: email,
//     subject: req.body.subject,
//     text: req.body.body,

//   };
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(error);
//       return res.status(500).json({ success: false, error: error.toString() });
//     }
//     return res.status(200).json({ success: true, message: "E-mail Sent Successfully" });
//   });




// }
export const handleContact = async (req, res) => {
  try {
    const token = req.cookies["accessToken"];
    const user = jwt.verify(token, process.env.SECRET_KEY);

    const creator = await Creator.findOne({ email: user.email });
    if (!creator || creator.approved !== "true") {
      return res
        .status(403)
        .json({
          success: false,
          error: "User not authorized or not approved",
          message: "User not authorized or not approved",
        });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "thedrag.website@gmail.com",
        pass: process.env.EMAIL_PASSWORD, 
      },
    });

    const mailOptions = {
      from: "Drag <thedrag.website@gmail.com>",
      to: req.body.creatormail,
      cc: user.email,
      subject: req.body.subject,
      text: req.body.body,
      attachments: req.file
        ? [{ filename: req.file.filename, path: req.file.path }]
        : undefined,
    };

    const info = await transporter.sendMail(mailOptions);
    return res
      .status(200)
      .json({ success: true, message: "E-mail sent successfully", info });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.toString() });
  }
};