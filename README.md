# Edemy 🎓 - Learning Management System

Edemy is a full-stack Learning Management System (LMS) designed to facilitate online education. Educators can create and manage courses with multiple chapters and lectures, while students can enroll, track their progress, and rate courses.

## Features ✨

* **User Authentication:** Secure authentication with Clerk, supporting both student and educator roles.
* **Course Creation:** Educators can create courses with rich text descriptions (using Quill) and integrate YouTube videos.
* **Course Enrollment & Payment:** Students can enroll in courses and make payments via Stripe.
* **Progress Tracking:** Students can track their progress through enrolled courses.
* **Course Rating System:** Students can rate and review courses.
* **Educator Dashboard:** Educators have access to a dashboard displaying earnings and student analytics.
* **Rich Text Editing:** Quill integration for rich text course content.
* **Image Storage:** Cloudinary integration for image uploads.

## Screenshots/Demo 🖼️

* **Homepage:** (Placeholder for screenshot)
* **Course Creation:** (Placeholder for screenshot)
* **Student Dashboard:** (Placeholder for screenshot)
* **Educator Dashboard:** (Placeholder for screenshot)

[Link to Demo Video (if available)]

## Tech Stack 💻

* **Frontend:**
    * React [![React Badge](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
    * Vite [![Vite Badge](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
    * Tailwind CSS [![Tailwind CSS Badge](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
    * React Router DOM [![React Router Badge](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
    * Clerk [![Clerk Badge](https://img.shields.io/badge/clerk-6D758D?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com/)
    * Quill [![Quill Badge](https://img.shields.io/badge/Quill-00BFA5?style=for-the-badge&logo=quill&logoColor=white)](https://quilljs.com/)
* **Backend:**
    * Node.js [![NodeJS Badge](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
    * Express.js [![Express Badge](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
    * MongoDB [![MongoDB Badge](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
    * Mongoose [![Mongoose Badge](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)
    * Cloudinary [![Cloudinary Badge](https://img.shields.io/badge/Cloudinary-2E8B57?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
    * Stripe [![Stripe Badge](https://img.shields.io/badge/stripe-6772E5?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)

## Installation and Setup 🛠️

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/niloydiu/edemy.git](https://github.com/niloydiu/edemy.git)
    cd edemy
    ```

2.  **Install dependencies:**

    * **Frontend:**

        ```bash
        cd client
        npm install
        ```

    * **Backend:**

        ```bash
        cd server
        npm install
        ```

3.  **Set up environment variables:**

    * Create `.env` files in both the `client` and `server` directories.
    * Add the required environment variables (see below).

4.  **Start the development servers:**

    * **Frontend:**

        ```bash
        cd client
        npm run dev
        ```

    * **Backend:**

        ```bash
        cd server
        npm run dev
        ```

## Environment Variables ⚙️

* **Client (.env):**

    ```
    VITE_API_BASE_URL=http://localhost:5000/api
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
    VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
    ```

* **Server (.env):**

    ```
    PORT=5000
    MONGODB_URI=your_mongodb_uri
    CLERK_SECRET_KEY=your_clerk_secret_key
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    STRIPE_SECRET_KEY=your_stripe_secret_key
    ```

## Usage Instructions 🚀

* **Students:**
    * Register or log in using Clerk.
    * Browse available courses.
    * Enroll in courses and make payments.
    * Track your progress and rate courses.
* **Educators:**
    * Register or log in using Clerk.
    * Create new courses with chapters and lectures.
    * Manage course content and track student progress.
    * View earnings and student analytics on the dashboard.

## API Endpoints 📄

* **Users:**
    * `POST /api/users`: Create a new user.
    * `GET /api/users/:userId`: Get user details.
* **Courses:**
    * `POST /api/courses`: Create a new course.
    * `GET /api/courses`: Get all courses.
    * `GET /api/courses/:courseId`: Get a specific course.
    * `PUT /api/courses/:courseId`: Update a course.
    * `DELETE /api/courses/:courseId`: Delete a course.
* **Purchases:**
    * `POST /api/purchases`: Create a new purchase.
    * `GET /api/purchases/:userId`: Get purchases for a user.
* **Course Progress:**
    * `POST /api/course-progress`: Create course progress.
    * `GET /api/course-progress/:userId/:courseId`: Get course progress.
* **Stripe:**
    * `POST /api/create-payment-intent`: Create payment intent.

## Deployment Instructions 🚀

1.  **Frontend:**
    * Build the React application: `npm run build` in the `client` directory.
    * Deploy the `dist` folder to a hosting service like Vercel, Netlify, or AWS S3.

2.  **Backend:**
    * Deploy the Node.js application to a hosting service like Heroku, AWS EC2, or Google Cloud App Engine.
    * Set the environment variables on the hosting platform.
    * Ensure MongoDB is accessible from the deployed backend.

## Credits/Acknowledgments 🙏

* Built with React, Express.js, MongoDB, Clerk, Cloudinary, and Stripe.
* Thanks to the open-source community for the libraries and tools used in this project.
* Special thanks to [Add specific names or resources].

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
