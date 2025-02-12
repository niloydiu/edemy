import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";
import Course from "../models/Course.model.js";
import Purchase from "../models/Purchase.model.js";
import User from "../models/User.model.js";

export const updateRoleEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });
    res.json({ success: true, message: "You can publish a course now." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add new course
// export const addCourse = async (req, res) => {
//   try {
//     const { courseData } = req.body;
//     const imageFile = req.file;
//     const educatorId = req.auth.userId;

//     if (!imageFile) {
//       return res.json({
//         success: false,
//         message: "Thumbnail image not attached",
//       });
//     }
//     const parsedCourseData = JSON.parse(courseData);

//     parsedCourseData.educator = educatorId;

//     const newCourse = await Course.create(parsedCourseData);

//     const imageUpload = await cloudinary.uploader.upload(imageFile.path);

//     newCourse.courseThumbnail = imageUpload.secure_url;

//     await newCourse.save();

//     res.json({
//       success: true,
//       message: "Course added successfully",
//     });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.json({
        success: false,
        message: "Thumbnail image not attached",
      });
    }

    // Upload image to Cloudinary with folder organization
    const result = await cloudinary.uploader.upload(imageFile.path, {
      folder: "course_thumbnails",
    });

    // Parse course data and include the thumbnail URL
    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    parsedCourseData.courseThumbnail = result.secure_url;

    // Create the course with the complete data in one operation
    await Course.create(parsedCourseData);

    res.json({
      success: true,
      message: "Course added successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get educator courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    res.json({ success: true, courses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get educator dashboard data
export const getEducatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    const courseIds = courses.map((course) => course._id);

    // Calculate total earening
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });
    const totalearnings = purchases.reduce(
      (sum, purchase) => sum + purchase.amount,
      0
    );

    // Collect unique enrolled student IDs with their course titles
    const enrollledStudentsData = [];
    for (const course of courses) {
      const students = await User.find(
        {
          _id: { $in: course.enrolledStudents },
        },
        "name imageUrl"
      );
      students.forEach((student) => {
        enrollledStudentsData.push({
          courseTitle: course.title,
          student,
        });
      });
    }
    res.json({
      success: true,
      dashboardData: {
        totalearnings,
        enrollledStudentsData,
        totalCourses,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get Enrolled students data with purchase data
export const getEnrolledStudentData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map((course) => course._id);
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageurl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((purchase) => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
