import Stripe from "stripe";
import { Webhook } from "svix";
import Course from "../models/Course.model.js";
import Purchase from "../models/Purchase.model.js";
import User from "../models/User.model.js";

// API COntroller to manage CLerk User with DB
export const clerkWebHooks = async (req, res) => {
  try {
    const wHook = new Webhook(process.env.CLERK_WEB_HOOKS);
    await wHook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;
    switch (type) {
      case "user.created": {
        const useData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.create(useData);
        res.json({});
        break;
      }

      case "user.updated": {
        const useData = {
          email: data.email_address[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, useData);
        res.json({});
        break;
      }

      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }

      default:
        break;
    }
  } catch (error) {
    res.json({ success: true, message: error.message });
  }
};

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
export const stripeWebhooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];
  let event;
  try {
    event = Stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    response.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      if (session.data.length === 0) {
        response.status(400).send("No session data found");
        return;
      }
      const { purchaseId } = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      if (!purchaseData) {
        response.status(404).send("Purchase not found");
        return;
      }

      const userData = await User.findById(purchaseData.userId);
      if (!userData) {
        response.status(404).send("User not found");
        return;
      }

      const courseData = await Course.findById(
        purchaseData.courseId.toString()
      );
      if (!courseData) {
        response.status(404).send("Course not found");
        return;
      }

      courseData.enrolledStudents.push(userData);
      courseData.enrolledStudents.push(userData._id);
      await courseData.save();

      userData.enrolledCourses.push(courseData._id);
      await userData.save();

      purchaseData.status = "completed";
      await purchaseData.save();
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });
      const { purchaseId } = session.data[0].metadata;
      const purchaseData = await Purchase.findById(purchaseId);
      purchaseData.status = "failed";
      await purchaseData.save();
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
      break;
  }
  response.json({ received: true });
};
