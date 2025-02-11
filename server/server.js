import { clerkMiddleware } from "@clerk/express";
import cors from "cors";
import "dotenv/config";
import express, { application } from "express";
import connectCloudinary from "./configs/cloudinary.config.js";
import connectDB from "./configs/mongodb.config.js";
import {
  clerkWebHooks,
  stripeWebhooks,
} from "./controllers/webhooks.controller.js";
import courseRouter from "./routes/course.route.js";
import educatorRouter from "./routes/educator.route.js";
import userRouter from "./routes/user.route.js";

// Initializing app
const app = express();

await connectDB();
await connectCloudinary();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(clerkMiddleware());

// Routes
app.get("/", (req, res) => {
  res.send("Base URL is working fine");
});
app.post("/clerk", express.json(), clerkWebHooks);
app.use("/api/educator", express.json(), educatorRouter);

app.use("/api/course", express.json(), courseRouter);

app.use("/api/user", express.json(), userRouter);

app.post("/stripe", express.raw({ type: application / json }), stripeWebhooks);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
