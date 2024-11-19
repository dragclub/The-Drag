import express from "express";
import { adminLogin, adminSignup, deleteCreator, deleteDeal, getApprovedCreators, getApprovedDeals, getPendingCreators, getPendingDeals, toggleApprovalStatus, toggleApprovalStatusDeals } from "../controllers/adminContorls.js";
import { isAdmin } from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/login").post(adminLogin);
router.route("/signup").post(adminSignup);
router.route("/getcreatorspending").get(isAdmin, getPendingCreators);
router.route("/getcreatorsapproved").get(isAdmin, getApprovedCreators);
router.route("/toggle-approval/:id").patch(isAdmin, toggleApprovalStatus);
router.route("/creator/:id").delete(isAdmin, deleteCreator);

router.route("/getdealspending").get(isAdmin, getPendingDeals);
router.route("/getdealsapproved").get(isAdmin, getApprovedDeals);
router.route("/toggle-approval-deal/:id").patch(isAdmin, toggleApprovalStatusDeals);
router.route("/deal/:id").delete(isAdmin, deleteDeal);
export default router;

