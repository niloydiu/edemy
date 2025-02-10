import cors from "cors";
import "dotenv/config";
import express from "express";
import connectDB from "./configs/mongodb.config.js";
import { clerkWebHooks } from "./controllers/webhooks.controller.js";

// Initializing app
const app = express();

await connectDB();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Base URL is working fine");
});
app.post("/clerk", express.json(), clerkWebHooks);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
