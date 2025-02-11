import { clerkClient } from "@clerk/express";

// Protect educator route
export const protectEducator = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const response = await clerkClient.users.getUser(userId);
    if (response.publicMetadata.role !== "educator") {
      return res.json({
        success: false,
        message: "Only educators can access this route, you are not educator.",
      });
    }
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
