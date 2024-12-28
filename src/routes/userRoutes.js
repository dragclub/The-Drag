import express from 'express';
import { createUser, userLogin,getalldata,logout, handleContact, sendOTP} from '../controllers/userController.js';
import {filters,handlesearch, handleSearchAndFilter} from '../controllers/searchFilter.controller.js'
import { handleCreatorRegister,handleCreatorEdit } from '../controllers/UserRegister.controller.js';
import { senderdata } from '../controllers/senderdata.controller.js';
import multer from 'multer';
import path from 'path'
import { createDeal, deleteDeal ,getDealById,getDeals} from '../controllers/deals.controller.js';
import { auth } from '../controllers/auth.controller.js';
import fs from "fs"
import { resetPassword, resetPasswordToken } from '../controllers/resetPassword.js';
const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("src", "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});

//File filter to allow only image files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".pdf") {
    cb(new Error("File type is not supported"), false);
    return;
  }
  cb(null, true);
};

// Initialize multer

const upload = multer({ storage, fileFilter });



router.route('/login').post(userLogin);

router.route('/signup').post(createUser);
router.route('/register').post(auth,upload.single('profileImage'),handleCreatorRegister);
router.route('/').get(getalldata);
router.route('/logout').post(logout);
router.route('/search').post(handlesearch);
router.route('/filter').post(filters);
router.route('/edit').post(auth,upload.single('profileImage'),handleCreatorEdit);
router.route('/contact').post(auth,upload.single('attachment'),handleContact);
router.route('/deals').post(auth,createDeal).delete(auth,deleteDeal).get(getDeals);
router.route("/deals/:id").get(getDealById);
router.route("/searchandfilter").post(handleSearchAndFilter);
router.route("/sendotp").post(sendOTP);
router.route("/reset-password-token").post(resetPasswordToken);
router.route("/reset-password").post(resetPassword);
export default router;