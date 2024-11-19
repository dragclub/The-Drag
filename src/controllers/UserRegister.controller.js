import User from "../models/user.model.js"
import Creator from "../models/creator.model.js"
import jwt from 'jsonwebtoken'
import path from "path";
import sharp from "sharp";
import fs from "fs";

export const handleCreatorRegister = async (req, res) => {
  const {
    type,
    userName,
    location,
    phone,
    insta,
    linkedin,
    twitter,
    facebook,
    youtube,
    instacount,
    twittercount,
    linkedincount,
    youtubecount,
    facebookcount,
  } = req.body;
  console.log("req.body", req.body);
  console.log("file", req.file);

  try {
    if (!type || !userName || !location || !req.file) {
      return res.status(400).json({
        success: false,
        error: `Incomplete Fields. Profile Image, Location, Type and User Name are required`,
      });
    }

    const file = req.file;
    console.log("file", file);

    // Convert the uploaded image to WebP format
    const webpFilename = `${Date.now()}.webp`;
    const inputPath = path.join("src", "uploads", file.filename);
    const outputPath = path.join("src", "uploads", webpFilename);

    // Convert image to WebP format using sharp
    await sharp(inputPath)
      .webp({ quality: 80 }) // You can adjust the quality if needed
      .toFile(outputPath);

    // Remove the original file
    fs.unlink(inputPath, (err) => {
      if (err) {
        console.log("Error deleting the original file:", err);
      } else {
        console.log("Original file deleted successfully");
      }
    });

    // Construct the image URL
    const image_url = `https://thedrag.in/apis/uploads/${webpFilename}`;

    const token = req.cookies["accessToken"];
    const data = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ email: data.email });
    const existing = await Creator.findOne({ email: data.email });

    if (existing != null) {
      return res.json({ success: false, error: "User Already Registered!" });
    }

    let MainPlatform = [];
    let MaxCount = Math.max(
      Number(instacount),
      Number(linkedincount),
      Number(twittercount),
      Number(facebookcount),
      Number(youtubecount)
    );
    let totalfollowers =
      Number(instacount) +
      Number(linkedincount) +
      Number(twittercount) +
      Number(facebookcount) +
      Number(youtubecount);
    console.log(totalfollowers);

    if (Number(instacount) == MaxCount) MainPlatform.push("instagram");
    if (Number(linkedincount) == MaxCount) MainPlatform.push("linkedin");
    if (Number(twittercount) == MaxCount) MainPlatform.push("twitter");
    if (Number(facebookcount) == MaxCount) MainPlatform.push("facebook");
    if (Number(youtubecount) == MaxCount) MainPlatform.push("youtube");

    console.log(MainPlatform);
    console.log(totalfollowers);

    const toregister = {
      name: user.name,
      userName: userName,
      email: user.email,
      type: type,
      Mobile_No: phone,
      socialMedia: {
        insta: { url: insta, count: 0 },
        twitter: { url: twitter, count: 0 },
        linkedin: { url: linkedin, count: 0 },
        facebook: { url: facebook, count: 0 },
        youtube: { url: youtube, count: 0 },
      },
      location: location,
      image: image_url,
      mainPlatform: MainPlatform,
      count: totalfollowers >= 1 ? totalfollowers : 0,
    };

    // Update social media counts
    if (instacount.length > 0)
      toregister.socialMedia.insta.count = Number(instacount);
    if (twittercount.length > 0)
      toregister.socialMedia.twitter.count = Number(twittercount);
    if (linkedincount.length > 0)
      toregister.socialMedia.linkedin.count = Number(linkedincount);
    if (facebookcount.length > 0)
      toregister.socialMedia.facebook.count = Number(facebookcount);
    if (youtubecount.length > 0)
      toregister.socialMedia.youtube.count = Number(youtubecount);

    console.log(toregister);

    const creator = await Creator.create(toregister);

    return res.json({
      success: true,
      message:
        "Registration Request Sent for Approval. You will be Approved as Creator within 24 hours",
      creator,
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
};



export const handleCreatorEdit = async (req, res) => {
 
    const { type, location, userName, phone, insta, linkedin, twitter, facebook, youtube, instacount, twittercount, linkedincount, youtubecount, facebookcount } = req.body;

  
    let img;
    let image = null;
    if (req.file) {
      const file = req.file;
      console.log("file", file);

      // Convert the uploaded image to WebP format
      const webpFilename = `${Date.now()}.webp`;
      const inputPath = path.join("src", "uploads", file.filename);
      const outputPath = path.join("src", "uploads", webpFilename);

      // Convert image to WebP format using sharp
      await sharp(inputPath)
        .webp({ quality: 80 }) // You can adjust the quality if needed
        .toFile(outputPath);

      // Remove the original file
      fs.unlink(inputPath, (err) => {
        if (err) {
          console.log("Error deleting the original file:", err);
        } else {
          console.log("Original file deleted successfully");
        }
      });

      // Construct the image URL
      image = `https://thedrag.in/apis/uploads/${webpFilename}`;
    }

  
  
    try {
      const token = req.cookies["accessToken"];
      const data = jwt.verify(token, process.env.SECRET_KEY);
  
      const exist = await Creator.findOne({ email: data.email });
  
      const updated = {
        type: type.trim() !== "" ? type : exist.type,
        userName: userName.trim() !== "" ? userName : exist.userName,
        location: location.trim() !== "" ? location : exist.location,
        Mobile_No: phone !== "" ? phone : exist.Mobile_No,
        image: image === null ? exist.image : image,
        socialMedia: {
          insta: {
            url: insta.length === 0 ? exist.socialMedia.insta.url : insta,
            count:
              instacount.length > 0
                ? Number(instacount)
                : exist.socialMedia.insta.count,
          },
          twitter: {
            url: twitter.length === 0 ? exist.socialMedia.twitter.url : twitter,
            count:
              twittercount.length > 0
                ? Number(twittercount)
                : exist.socialMedia.twitter.count,
          },
          linkedin: {
            url:
              linkedin.length === 0 ? exist.socialMedia.linkedin.url : linkedin,
            count:
              linkedincount.length > 0
                ? Number(linkedincount)
                : exist.socialMedia.linkedin.count,
          },
          facebook: {
            url:
              facebook.length === 0 ? exist.socialMedia.facebook.url : facebook,
            count:
              facebookcount.length > 0
                ? Number(facebookcount)
                : exist.socialMedia.facebook.count,
          },
          youtube: {
            url: youtube.length === 0 ? exist.socialMedia.youtube.url : youtube,
            count:
              youtubecount.length > 0
                ? Number(youtubecount)
                : exist.socialMedia.youtube.count,
          },
        },
        mainPlatform: [],
        count: 0,
      };
      let MainPlatform=[];
    let MaxCount=Math.max(updated.socialMedia.insta.count,updated.socialMedia.linkedin.count,updated.socialMedia.twitter.count,updated.socialMedia.facebook.count,updated.socialMedia.youtube.count);
    let totalfollowers=updated.socialMedia.insta.count+updated.socialMedia.linkedin.count+updated.socialMedia.twitter.count+updated.socialMedia.facebook.count+updated.socialMedia.youtube.count;
    if(updated.socialMedia.insta.count==MaxCount)MainPlatform.push("instagram");
    if(updated.socialMedia.linkedin.count==MaxCount)MainPlatform.push("linkedin");
    if(updated.socialMedia.twitter.count==MaxCount)MainPlatform.push("twitter");
    if(updated.socialMedia.facebook.count==MaxCount)MainPlatform.push("facebook");
    if(updated.socialMedia.youtube.count==MaxCount)MainPlatform.push("youtube");
    console.log(MainPlatform);
    console.log(totalfollowers);
      console.log("updated",updated);
      updated.mainPlatform=MainPlatform;
      updated.count=totalfollowers;

       const new_creator = await Creator.findOneAndUpdate({ email: data.email },updated, { new: true });
      console.log("new_creator",new_creator);
      return res.status(200).json({ success: true, message: 'Creator Data updated Successfully' });
    }
    catch (error) {
        console.log(error);
      return res.json({ success: false, message: error });
    }
  
  }
  