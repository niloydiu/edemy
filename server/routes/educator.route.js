import express from "express";
import upload from "../configs/multer.config.js";
import {
  addCourse,
  getEducatorCourses,
  getEducatorDashboardData,
  getEnrolledStudentData,
  updateRoleEducator,
} from "../controllers/educator.controller.js";
import { protectEducator } from "../middlewares/auth.middleware.js";

const educatorRouter = express.Router();

// Add educator role
educatorRouter.get("/update-role", updateRoleEducator);
educatorRouter.post(
  "/add-course",
  upload.single("image"),
  protectEducator,
  addCourse
);
educatorRouter.get("/courses", protectEducator, getEducatorCourses);

educatorRouter.get("/dashboard", protectEducator, getEducatorDashboardData);

educatorRouter.get(
  "/enrolled-students",
  protectEducator,
  getEnrolledStudentData
);

export default educatorRouter;
