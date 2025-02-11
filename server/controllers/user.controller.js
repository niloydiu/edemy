import Stripe from "stripe";
import Course from "../models/Course.model.js";
import Purchase from "../models/Purchase.model.js";
import User from "../models/User.model.js";
import { CourseProgress } from "../models/courseProgress.model.js";

// Get user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// User enrolled courses with lecture link
export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const useData = await User.findById(userId).populate("enrolledCourses");
    res.json({ success: true, enrolledCourses: useData.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Purchase Course
export const purchasedCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);
    if (!userData || !courseData) {
      return res.json({ success: false, message: "Data not found" });
    }
    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
      ).toFixed(2),
    };
    const newPurchase = await Purchase.create(purchaseData);

    // Stripe gateway initializing
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    // Creating line Items fro STRIPE
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update User Course Progress
// export const updateUserCourseProgress = async (req, res) => {
//   try {
//     const userId = req.auth.userId;
//     const { courseId, lectureId } = req.body;
//     let progressData = await CourseProgress.findOne({ userId, courseId });

//     if (!progressData) {
//       progressData = await CourseProgress.create({
//         userId,
//         courseId,
//         lectureCompleted: [lectureId],
//       });
//     }
//     if (progressData) {
//       if (progressData.lectureCompleted.includes(lectureId)) {
//         return res.json({ success: true, message: "Already completed" });
//       }
//       progressData.lectureCompleted.push(lectureId);
//       await progressData.save();
//     } else {
//       await CourseProgress.create({
//         userId,
//         courseId,
//         lectureCompleted: [lectureId],
//       });
//       res.json({ success: true, message: "Progress updated" });
//     }
//     // Check overall course progress
//     const courseData = await Course.findById(courseId);
//     if (courseData) {
//       // Calculate total lectures available in the course
//       const totalLectures = courseData.courseContent.reduce(
//         (total, chapter) => total + chapter.chapterContent.length,
//         0
//       );

//       if (progressData.lectureCompleted.length === totalLectures) {
//         progressData.completed = true; // Ensure your model supports this field
//       }
//     }

//     await progressData.save();
//     res.json({ success: true, message: "Progress updated", progressData });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;
    let progressData = await CourseProgress.findOne({ userId, courseId });

    if (!progressData) {
      progressData = await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    } else {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({ success: true, message: "Already completed" });
      }
      progressData.lectureCompleted.push(lectureId);
    }

    // Check overall course progress
    const courseData = await Course.findById(courseId);
    if (courseData) {
      // Calculate total lectures available in the course
      const totalLectures = courseData.courseContent.reduce(
        (total, chapter) => total + chapter.chapterContent.length,
        0
      );
      if (progressData.lectureCompleted.length === totalLectures) {
        progressData.completed = true; // Ensure your model supports this field
      }
    }

    await progressData.save();
    res.json({ success: true, message: "Progress updated", progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get user course progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;
    const progressData = await CourseProgress.findOne({ userId, courseId });
    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add user rating to course
export const addUserRating = async (req, res) => {
  const userId = req.auth.userId;
  const { courseId, rating } = req.body;
  if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
    return res.json({
      success: false,
      message: "Course Id or Rating is invalid.",
    });
  }
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.json({ success: false, message: "Course not found." });
    }
    const user = await User.findById(userId);
    if (
      !user ||
      !user.enrolledCourses.some((id) => id.toString() === courseId)
    ) {
      return res.json({
        success: false,
        message: "User is not authorized to rate this course",
      });
    }
    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId === userId
    );
    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }
    await course.save();
    return res.json({ success: true, message: "Rating added successfully." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
