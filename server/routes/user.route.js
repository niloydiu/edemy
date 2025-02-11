import express from "express";
import {
  getUserData,
  purchasedCourse,
  userEnrolledCourses,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

userRouter.get("/data", getUserData);
userRouter.get("/enrolled-courses", userEnrolledCourses);
userRouter.post("/purchase", purchasedCourse);

export default userRouter;
