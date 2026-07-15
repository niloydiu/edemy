import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Course, Lesson, Rating } from './entities/course.entity';
import { Progress } from './entities/progress.entity';

// ============================================================
// COURSE THUMBNAILS — High quality Unsplash education images
// ============================================================
const THUMBNAILS = [
  'https://images.unsplash.com/photo-1587620962725-abab19836100?w=800&h=450&fit=crop&auto=format', // Web/code
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&auto=format', // Data science
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=450&fit=crop&auto=format', // AI
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop&auto=format', // Mobile
  'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=450&fit=crop&auto=format', // Cloud
  'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=450&fit=crop&auto=format', // Security
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop&auto=format', // Design
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&auto=format', // Marketing
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=450&fit=crop&auto=format', // Photography
  'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=450&fit=crop&auto=format', // Music
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop&auto=format', // Business
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=450&fit=crop&auto=format', // Fitness
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=450&fit=crop&auto=format', // Language
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop&auto=format', // 3D
  'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=450&fit=crop&auto=format', // Study
  'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?w=800&h=450&fit=crop&auto=format', // DevOps
  'https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?w=800&h=450&fit=crop&auto=format', // Blockchain
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=450&fit=crop&auto=format', // Finance
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=450&fit=crop&auto=format', // E-commerce
  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=450&fit=crop&auto=format', // Personal dev
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop&auto=format', // Leadership
  'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=450&fit=crop&auto=format', // Laptop tech
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&h=450&fit=crop&auto=format', // Students
  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&h=450&fit=crop&auto=format', // Video
  'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=450&fit=crop&auto=format', // Social media
];

function getThumbnail(idx: number) {
  return THUMBNAILS[idx % THUMBNAILS.length];
}

// ============================================================
// COURSE DATA — 100+ courses across 10 categories
// ============================================================
const COURSES_DATA = [
  // ---- WEB DEVELOPMENT (12 courses) ----
  {
    courseTitle: 'The Complete React Developer Bootcamp 2024',
    courseDescription: 'Master React 18 from scratch. Build 5 production-ready apps using hooks, context, React Query, and modern tooling. Go from beginner to job-ready in 30 days.',
    coursePrice: 89.99, discount: 15, category: 'Web Development', level: 'Beginner', thumbIdx: 0,
    lessons: [
      { title: 'Introduction to React & JSX', type: 'pdf', duration: 20 },
      { title: 'Components, Props & State', type: 'online', duration: 60 },
      { title: 'React Hooks Deep Dive', type: 'online', duration: 90 },
      { title: 'Building a Todo App', type: 'offline', duration: 120 },
      { title: 'React Router & Navigation', type: 'link', duration: 45 },
      { title: 'Final Project Review', type: 'online', duration: 60 },
    ],
  },
  {
    courseTitle: 'Next.js 14 Full-Stack Masterclass',
    courseDescription: 'Build production-grade web apps with Next.js 14, App Router, Server Components, Prisma ORM, and Vercel deployment.',
    coursePrice: 94.99, discount: 10, category: 'Web Development', level: 'Intermediate', thumbIdx: 21,
    lessons: [
      { title: 'Next.js Fundamentals & App Router', type: 'pdf', duration: 30 },
      { title: 'Server vs Client Components', type: 'online', duration: 75 },
      { title: 'Data Fetching Patterns', type: 'online', duration: 60 },
      { title: 'Authentication with NextAuth.js', type: 'offline', duration: 90 },
      { title: 'Deploy on Vercel', type: 'online', duration: 45 },
    ],
  },
  {
    courseTitle: 'Node.js & Express — Build REST APIs from Scratch',
    courseDescription: 'Create scalable REST APIs using Node.js, Express, JWT authentication, PostgreSQL, and automated testing with Jest.',
    coursePrice: 74.99, discount: 20, category: 'Web Development', level: 'Intermediate', thumbIdx: 22,
    lessons: [
      { title: 'Node.js Core Concepts', type: 'pdf', duration: 25 },
      { title: 'Express Middleware & Routing', type: 'online', duration: 60 },
      { title: 'JWT Authentication', type: 'online', duration: 75 },
      { title: 'PostgreSQL with TypeORM', type: 'offline', duration: 90 },
    ],
  },
  {
    courseTitle: 'TypeScript for Professional Developers',
    courseDescription: 'Go beyond basic TypeScript. Master generics, decorators, utility types, and advanced patterns used in enterprise codebases.',
    coursePrice: 69.99, discount: 0, category: 'Web Development', level: 'Advanced', thumbIdx: 0,
    lessons: [
      { title: 'TypeScript Fundamentals Review', type: 'pdf', duration: 30 },
      { title: 'Generics & Conditional Types', type: 'online', duration: 90 },
      { title: 'Decorators & Metadata', type: 'online', duration: 60 },
      { title: 'Building a Type-Safe API', type: 'offline', duration: 120 },
    ],
  },
  {
    courseTitle: 'CSS Mastery: Tailwind, Grid & Flexbox',
    courseDescription: 'From CSS basics to advanced Tailwind workflows. Master responsive design, animations, and component libraries.',
    coursePrice: 49.99, discount: 25, category: 'Web Development', level: 'Beginner', thumbIdx: 6,
    lessons: [
      { title: 'CSS Fundamentals', type: 'pdf', duration: 20 },
      { title: 'Flexbox Complete Guide', type: 'online', duration: 60 },
      { title: 'CSS Grid Layouts', type: 'online', duration: 75 },
      { title: 'Tailwind CSS Workflow', type: 'offline', duration: 90 },
    ],
  },
  {
    courseTitle: 'Full-Stack MERN Development: Build 5 Real Projects',
    courseDescription: 'MongoDB, Express, React, Node.js — the complete full-stack stack. Build an e-commerce site, blog, social app, chat, and portfolio.',
    coursePrice: 129.99, discount: 5, category: 'Web Development', level: 'Intermediate', thumbIdx: 14,
    lessons: [
      { title: 'MERN Architecture Overview', type: 'pdf', duration: 20 },
      { title: 'Project 1: Blog Platform', type: 'online', duration: 180 },
      { title: 'Project 2: E-Commerce Store', type: 'online', duration: 240 },
      { title: 'Project 3: Real-Time Chat', type: 'offline', duration: 180 },
    ],
  },
  {
    courseTitle: 'Vue.js 3 Masterclass — Build Production Apps',
    courseDescription: 'Master Vue 3 Composition API, Pinia state management, and Vue Router. Deploy a full SaaS product from scratch.',
    coursePrice: 79.99, discount: 10, category: 'Web Development', level: 'Intermediate', thumbIdx: 21,
    lessons: [
      { title: 'Vue 3 Composition API', type: 'online', duration: 90 },
      { title: 'Pinia State Management', type: 'online', duration: 60 },
      { title: 'Vue Router Advanced', type: 'pdf', duration: 45 },
      { title: 'Deploy Vue App on Netlify', type: 'online', duration: 30 },
    ],
  },
  {
    courseTitle: 'GraphQL with Apollo Server & React',
    courseDescription: 'Replace REST with GraphQL. Build type-safe APIs using Apollo Server, subscriptions, and integrate with React frontend.',
    coursePrice: 84.99, discount: 15, category: 'Web Development', level: 'Advanced', thumbIdx: 22,
    lessons: [
      { title: 'GraphQL Fundamentals', type: 'pdf', duration: 30 },
      { title: 'Apollo Server Setup', type: 'online', duration: 60 },
      { title: 'Queries, Mutations & Subscriptions', type: 'online', duration: 90 },
      { title: 'React Apollo Client', type: 'offline', duration: 75 },
    ],
  },
  // ---- DATA SCIENCE (10 courses) ----
  {
    courseTitle: 'Python for Data Science & Machine Learning Bootcamp',
    courseDescription: 'Complete data science program: NumPy, Pandas, Matplotlib, Seaborn, Scikit-learn, and intro to TensorFlow. 80+ exercises.',
    coursePrice: 99.99, discount: 20, category: 'Data Science', level: 'Beginner', thumbIdx: 1,
    lessons: [
      { title: 'Python Crash Course for Data', type: 'pdf', duration: 30 },
      { title: 'NumPy Fundamentals', type: 'online', duration: 75 },
      { title: 'Pandas DataFrames', type: 'online', duration: 90 },
      { title: 'Matplotlib & Seaborn', type: 'offline', duration: 60 },
      { title: 'ML with Scikit-learn', type: 'online', duration: 120 },
    ],
  },
  {
    courseTitle: 'SQL for Data Science — Zero to Hero',
    courseDescription: 'Master SQL for analytics: complex joins, window functions, CTEs, performance tuning, and building dashboards with real datasets.',
    coursePrice: 59.99, discount: 0, category: 'Data Science', level: 'Beginner', thumbIdx: 14,
    lessons: [
      { title: 'SQL Fundamentals', type: 'pdf', duration: 30 },
      { title: 'Complex Joins & Subqueries', type: 'online', duration: 75 },
      { title: 'Window Functions', type: 'online', duration: 60 },
      { title: 'Building a Sales Dashboard', type: 'offline', duration: 90 },
    ],
  },
  {
    courseTitle: 'Data Visualization with Power BI',
    courseDescription: 'Transform raw data into stunning dashboards using Power BI. Master DAX, data models, and interactive reports.',
    coursePrice: 69.99, discount: 10, category: 'Data Science', level: 'Intermediate', thumbIdx: 1,
    lessons: [
      { title: 'Power BI Interface Tour', type: 'pdf', duration: 20 },
      { title: 'Data Modeling with Star Schema', type: 'online', duration: 90 },
      { title: 'DAX Formulas Masterclass', type: 'online', duration: 120 },
      { title: 'Publishing & Sharing Reports', type: 'offline', duration: 45 },
    ],
  },
  {
    courseTitle: 'Statistics for Data Scientists',
    courseDescription: 'Probability theory, hypothesis testing, Bayesian statistics, and A/B testing — explained through Python examples and real data.',
    coursePrice: 64.99, discount: 15, category: 'Data Science', level: 'Intermediate', thumbIdx: 14,
    lessons: [
      { title: 'Descriptive Statistics', type: 'pdf', duration: 30 },
      { title: 'Probability Distributions', type: 'online', duration: 75 },
      { title: 'Hypothesis Testing', type: 'online', duration: 90 },
      { title: 'A/B Testing in Practice', type: 'offline', duration: 60 },
    ],
  },
  {
    courseTitle: 'Apache Spark for Big Data Processing',
    courseDescription: 'Process terabytes of data using Apache Spark with Python (PySpark). Streaming, MLlib, and Databricks integration.',
    coursePrice: 109.99, discount: 5, category: 'Data Science', level: 'Advanced', thumbIdx: 1,
    lessons: [
      { title: 'Spark Architecture', type: 'pdf', duration: 25 },
      { title: 'PySpark DataFrames', type: 'online', duration: 90 },
      { title: 'Spark Streaming', type: 'online', duration: 75 },
      { title: 'MLlib Machine Learning', type: 'offline', duration: 120 },
    ],
  },
  // ---- ARTIFICIAL INTELLIGENCE (10 courses) ----
  {
    courseTitle: 'Machine Learning A–Z: AI, Python & R',
    courseDescription: 'From regression to neural networks. Comprehensive ML course covering 40+ algorithms with Python and R, applied to real-world datasets.',
    coursePrice: 119.99, discount: 15, category: 'Artificial Intelligence', level: 'Intermediate', thumbIdx: 2,
    lessons: [
      { title: 'ML Fundamentals', type: 'pdf', duration: 30 },
      { title: 'Supervised Learning Algorithms', type: 'online', duration: 120 },
      { title: 'Unsupervised Learning & Clustering', type: 'online', duration: 90 },
      { title: 'Neural Networks from Scratch', type: 'offline', duration: 150 },
      { title: 'Final Project: Prediction Model', type: 'online', duration: 60 },
    ],
  },
  {
    courseTitle: 'Deep Learning with TensorFlow & Keras',
    courseDescription: 'Build CNNs, RNNs, LSTMs, and Transformers. Train models on GPU, fine-tune pretrained networks, and deploy with TensorFlow Serving.',
    coursePrice: 129.99, discount: 10, category: 'Artificial Intelligence', level: 'Advanced', thumbIdx: 2,
    lessons: [
      { title: 'TensorFlow Basics', type: 'pdf', duration: 25 },
      { title: 'Convolutional Neural Networks', type: 'online', duration: 120 },
      { title: 'Recurrent Networks & LSTMs', type: 'online', duration: 90 },
      { title: 'Transfer Learning', type: 'offline', duration: 75 },
    ],
  },
  {
    courseTitle: 'Build AI-Powered Apps with LangChain & GPT-4',
    courseDescription: 'Create production LLM apps: RAG pipelines, AI agents, vector databases (Pinecone/Chroma), and multi-modal interactions.',
    coursePrice: 149.99, discount: 0, category: 'Artificial Intelligence', level: 'Advanced', thumbIdx: 2,
    lessons: [
      { title: 'LLM Fundamentals & Prompt Engineering', type: 'pdf', duration: 30 },
      { title: 'LangChain Chains & Agents', type: 'online', duration: 90 },
      { title: 'Vector Databases & RAG', type: 'online', duration: 75 },
      { title: 'Deploy AI App on AWS', type: 'offline', duration: 60 },
    ],
  },
  {
    courseTitle: 'Computer Vision with PyTorch',
    courseDescription: 'Object detection, image segmentation, facial recognition, and OCR using PyTorch, OpenCV, and YOLO v8.',
    coursePrice: 109.99, discount: 20, category: 'Artificial Intelligence', level: 'Advanced', thumbIdx: 2,
    lessons: [
      { title: 'PyTorch Introduction', type: 'pdf', duration: 25 },
      { title: 'Image Classification', type: 'online', duration: 90 },
      { title: 'Object Detection with YOLO', type: 'online', duration: 120 },
      { title: 'Deploying CV Models', type: 'offline', duration: 60 },
    ],
  },
  // ---- MOBILE DEVELOPMENT (8 courses) ----
  {
    courseTitle: 'React Native — Build iOS & Android Apps',
    courseDescription: 'Ship real mobile apps using React Native and Expo. Covers navigation, state management, native APIs, push notifications, and App Store deployment.',
    coursePrice: 89.99, discount: 10, category: 'Mobile Development', level: 'Intermediate', thumbIdx: 3,
    lessons: [
      { title: 'React Native Setup & Expo', type: 'pdf', duration: 20 },
      { title: 'Components & Styling', type: 'online', duration: 75 },
      { title: 'React Navigation', type: 'online', duration: 60 },
      { title: 'Native Device APIs', type: 'offline', duration: 90 },
      { title: 'App Store Submission', type: 'online', duration: 45 },
    ],
  },
  {
    courseTitle: 'Flutter & Dart: Complete Mobile Development',
    courseDescription: 'Build beautiful cross-platform apps with Flutter. Covers widgets, animations, BLoC, Firebase, and publishing to stores.',
    coursePrice: 94.99, discount: 15, category: 'Mobile Development', level: 'Beginner', thumbIdx: 3,
    lessons: [
      { title: 'Dart Fundamentals', type: 'pdf', duration: 30 },
      { title: 'Flutter Widget Tree', type: 'online', duration: 90 },
      { title: 'State Management with BLoC', type: 'online', duration: 75 },
      { title: 'Firebase Integration', type: 'offline', duration: 60 },
    ],
  },
  {
    courseTitle: 'iOS Development with Swift & SwiftUI',
    courseDescription: 'Build native iPhone and iPad apps from scratch. SwiftUI, Core Data, ARKit, and App Store publishing.',
    coursePrice: 109.99, discount: 5, category: 'Mobile Development', level: 'Intermediate', thumbIdx: 3,
    lessons: [
      { title: 'Swift Language Basics', type: 'pdf', duration: 30 },
      { title: 'SwiftUI Views & Layout', type: 'online', duration: 90 },
      { title: 'Core Data & Persistence', type: 'online', duration: 75 },
      { title: 'Submit to App Store', type: 'offline', duration: 45 },
    ],
  },
  {
    courseTitle: 'Android Development with Kotlin & Jetpack Compose',
    courseDescription: 'Build modern Android apps with Kotlin, Jetpack Compose, MVVM architecture, and Google Play deployment.',
    coursePrice: 99.99, discount: 10, category: 'Mobile Development', level: 'Intermediate', thumbIdx: 3,
    lessons: [
      { title: 'Kotlin Fundamentals', type: 'pdf', duration: 30 },
      { title: 'Jetpack Compose UI', type: 'online', duration: 90 },
      { title: 'MVVM & ViewModel', type: 'online', duration: 75 },
      { title: 'Publish to Google Play', type: 'offline', duration: 45 },
    ],
  },
  // ---- CLOUD & DEVOPS (10 courses) ----
  {
    courseTitle: 'AWS Solutions Architect — Associate Certification',
    courseDescription: 'Comprehensive AWS prep course covering EC2, S3, RDS, VPC, IAM, Lambda, and the full exam blueprint with practice tests.',
    coursePrice: 129.99, discount: 10, category: 'Cloud Computing', level: 'Intermediate', thumbIdx: 4,
    lessons: [
      { title: 'AWS Global Infrastructure', type: 'pdf', duration: 25 },
      { title: 'EC2, S3 & IAM', type: 'online', duration: 120 },
      { title: 'VPC Networking Deep Dive', type: 'online', duration: 90 },
      { title: 'Serverless & Lambda', type: 'offline', duration: 75 },
      { title: 'Practice Exam Review', type: 'online', duration: 60 },
    ],
  },
  {
    courseTitle: 'Docker & Kubernetes: Complete DevOps Bootcamp',
    courseDescription: 'Containerize applications with Docker, orchestrate with Kubernetes, and set up CI/CD pipelines. Hands-on labs with real clusters.',
    coursePrice: 109.99, discount: 15, category: 'Cloud Computing', level: 'Intermediate', thumbIdx: 15,
    lessons: [
      { title: 'Docker Fundamentals', type: 'pdf', duration: 30 },
      { title: 'Building Docker Images', type: 'online', duration: 75 },
      { title: 'Kubernetes Architecture', type: 'online', duration: 90 },
      { title: 'Deploying with Helm', type: 'offline', duration: 60 },
      { title: 'CI/CD with GitHub Actions', type: 'online', duration: 75 },
    ],
  },
  {
    courseTitle: 'Terraform: Infrastructure as Code Mastery',
    courseDescription: 'Provision and manage cloud infrastructure as code across AWS, Azure, and GCP using Terraform best practices.',
    coursePrice: 89.99, discount: 20, category: 'Cloud Computing', level: 'Advanced', thumbIdx: 4,
    lessons: [
      { title: 'Terraform Basics', type: 'pdf', duration: 25 },
      { title: 'Providers & Resources', type: 'online', duration: 75 },
      { title: 'Modules & State Management', type: 'online', duration: 90 },
      { title: 'Multi-Cloud Deployments', type: 'offline', duration: 60 },
    ],
  },
  {
    courseTitle: 'CI/CD with GitHub Actions & Jenkins',
    courseDescription: 'Build automated pipelines for testing, building, and deploying applications. Real-world workflows for Node.js, Python, and containerized apps.',
    coursePrice: 74.99, discount: 10, category: 'Cloud Computing', level: 'Intermediate', thumbIdx: 15,
    lessons: [
      { title: 'GitHub Actions Fundamentals', type: 'pdf', duration: 25 },
      { title: 'Build & Test Workflows', type: 'online', duration: 60 },
      { title: 'Docker in CI/CD', type: 'online', duration: 75 },
      { title: 'Jenkins Pipeline Setup', type: 'offline', duration: 90 },
    ],
  },
  {
    courseTitle: 'Linux Administration for DevOps Engineers',
    courseDescription: 'Essential Linux skills: shell scripting, system administration, networking, file systems, and security hardening for DevOps.',
    coursePrice: 69.99, discount: 0, category: 'Cloud Computing', level: 'Beginner', thumbIdx: 4,
    lessons: [
      { title: 'Linux Fundamentals', type: 'pdf', duration: 30 },
      { title: 'Shell Scripting Mastery', type: 'online', duration: 90 },
      { title: 'System Administration', type: 'online', duration: 75 },
      { title: 'Security & Networking', type: 'offline', duration: 60 },
    ],
  },
  // ---- CYBERSECURITY (8 courses) ----
  {
    courseTitle: 'Ethical Hacking from Zero to Hero',
    courseDescription: 'Complete penetration testing course: reconnaissance, exploitation, post-exploitation, web app hacking, and writing professional pentest reports.',
    coursePrice: 119.99, discount: 10, category: 'Cybersecurity', level: 'Beginner', thumbIdx: 5,
    lessons: [
      { title: 'Ethical Hacking Overview', type: 'pdf', duration: 20 },
      { title: 'Reconnaissance & OSINT', type: 'online', duration: 90 },
      { title: 'Exploitation with Metasploit', type: 'online', duration: 120 },
      { title: 'Web App Penetration Testing', type: 'offline', duration: 90 },
      { title: 'Writing Pentest Reports', type: 'online', duration: 45 },
    ],
  },
  {
    courseTitle: 'Web Application Security: OWASP Top 10',
    courseDescription: 'Learn to identify and exploit the OWASP Top 10 vulnerabilities: SQLi, XSS, CSRF, SSRF, XXE, and more. Build secure web apps.',
    coursePrice: 89.99, discount: 15, category: 'Cybersecurity', level: 'Intermediate', thumbIdx: 5,
    lessons: [
      { title: 'OWASP Top 10 Overview', type: 'pdf', duration: 25 },
      { title: 'SQL Injection & XSS', type: 'online', duration: 90 },
      { title: 'CSRF & SSRF Attacks', type: 'online', duration: 75 },
      { title: 'Secure Coding Practices', type: 'offline', duration: 60 },
    ],
  },
  {
    courseTitle: 'CompTIA Security+ Certification Prep 2024',
    courseDescription: 'Pass the SY0-701 exam with confidence. Covers threats, cryptography, identity management, risk management, and incident response.',
    coursePrice: 109.99, discount: 20, category: 'Cybersecurity', level: 'Beginner', thumbIdx: 5,
    lessons: [
      { title: 'Security+ Exam Overview', type: 'pdf', duration: 20 },
      { title: 'Threats & Attacks', type: 'online', duration: 90 },
      { title: 'Cryptography Essentials', type: 'online', duration: 75 },
      { title: 'Practice Exam Review', type: 'offline', duration: 60 },
    ],
  },
  // ---- UI/UX DESIGN (8 courses) ----
  {
    courseTitle: 'Figma — Complete UI/UX Design Bootcamp',
    courseDescription: 'From wireframes to polished prototypes. Master Figma\'s auto-layout, components, variables, and interactive prototyping.',
    coursePrice: 79.99, discount: 10, category: 'UI/UX Design', level: 'Beginner', thumbIdx: 6,
    lessons: [
      { title: 'Figma Interface Basics', type: 'pdf', duration: 20 },
      { title: 'Components & Auto-Layout', type: 'online', duration: 90 },
      { title: 'Prototyping & Flows', type: 'online', duration: 75 },
      { title: 'Design System Creation', type: 'offline', duration: 90 },
      { title: 'Client Presentation Skills', type: 'online', duration: 45 },
    ],
  },
  {
    courseTitle: 'User Research & Usability Testing Masterclass',
    courseDescription: 'Plan and execute user interviews, usability tests, and surveys. Synthesize findings with affinity maps and journey maps.',
    coursePrice: 69.99, discount: 15, category: 'UI/UX Design', level: 'Intermediate', thumbIdx: 6,
    lessons: [
      { title: 'Research Methods Overview', type: 'pdf', duration: 25 },
      { title: 'User Interviews', type: 'online', duration: 60 },
      { title: 'Usability Testing Sessions', type: 'online', duration: 90 },
      { title: 'Affinity Mapping', type: 'offline', duration: 60 },
    ],
  },
  {
    courseTitle: 'Motion Design with Framer & After Effects',
    courseDescription: 'Create stunning UI animations using Framer and After Effects. Master easing curves, micro-interactions, and motion principles.',
    coursePrice: 84.99, discount: 5, category: 'UI/UX Design', level: 'Advanced', thumbIdx: 6,
    lessons: [
      { title: 'Motion Design Principles', type: 'pdf', duration: 20 },
      { title: 'After Effects for UI', type: 'online', duration: 90 },
      { title: 'Framer Motion in React', type: 'online', duration: 75 },
      { title: 'Portfolio Project', type: 'offline', duration: 120 },
    ],
  },
  // ---- DIGITAL MARKETING (8 courses) ----
  {
    courseTitle: 'Complete Digital Marketing Bootcamp 2024',
    courseDescription: 'SEO, SEM, social media, email, content, analytics — all in one. Build and launch a complete digital marketing strategy.',
    coursePrice: 89.99, discount: 20, category: 'Digital Marketing', level: 'Beginner', thumbIdx: 7,
    lessons: [
      { title: 'Digital Marketing Overview', type: 'pdf', duration: 20 },
      { title: 'SEO Fundamentals', type: 'online', duration: 90 },
      { title: 'Google Ads & PPC', type: 'online', duration: 75 },
      { title: 'Social Media Strategy', type: 'offline', duration: 60 },
      { title: 'Analytics & Reporting', type: 'online', duration: 45 },
    ],
  },
  {
    courseTitle: 'SEO Mastery: Rank #1 on Google',
    courseDescription: 'Advanced SEO techniques: technical SEO, link building, content strategy, Core Web Vitals, and E-E-A-T optimization.',
    coursePrice: 74.99, discount: 10, category: 'Digital Marketing', level: 'Intermediate', thumbIdx: 7,
    lessons: [
      { title: 'SEO Fundamentals', type: 'pdf', duration: 25 },
      { title: 'Technical SEO Audit', type: 'online', duration: 90 },
      { title: 'Link Building Strategies', type: 'online', duration: 75 },
      { title: 'Local SEO & GMB', type: 'offline', duration: 60 },
    ],
  },
  {
    courseTitle: 'Facebook & Instagram Ads Masterclass',
    courseDescription: 'Run profitable Meta ad campaigns. Master audience targeting, ad creative, funnel strategy, and ROAS optimization.',
    coursePrice: 79.99, discount: 15, category: 'Digital Marketing', level: 'Intermediate', thumbIdx: 24,
    lessons: [
      { title: 'Meta Business Suite', type: 'pdf', duration: 20 },
      { title: 'Campaign & Ad Set Structure', type: 'online', duration: 75 },
      { title: 'Creative Strategy', type: 'online', duration: 60 },
      { title: 'Retargeting & Lookalikes', type: 'offline', duration: 75 },
    ],
  },
  // ---- BUSINESS & FINANCE (10 courses) ----
  {
    courseTitle: 'MBA Essentials: Business Strategy Fundamentals',
    courseDescription: 'Condensed MBA curriculum: competitive strategy, business models, financial analysis, operations, and leadership.',
    coursePrice: 149.99, discount: 10, category: 'Business & Management', level: 'Intermediate', thumbIdx: 10,
    lessons: [
      { title: 'Business Strategy Frameworks', type: 'pdf', duration: 30 },
      { title: 'Financial Analysis Basics', type: 'online', duration: 90 },
      { title: 'Marketing & Growth', type: 'online', duration: 75 },
      { title: 'Leadership & Decision Making', type: 'offline', duration: 60 },
      { title: 'Case Study Workshop', type: 'online', duration: 120 },
    ],
  },
  {
    courseTitle: 'Project Management Professional (PMP) Prep 2024',
    courseDescription: 'Complete PMP exam prep covering all process groups and knowledge areas. 350+ practice questions and mock exams.',
    coursePrice: 129.99, discount: 15, category: 'Business & Management', level: 'Intermediate', thumbIdx: 10,
    lessons: [
      { title: 'PMP Exam Overview', type: 'pdf', duration: 25 },
      { title: 'Project Initiation & Planning', type: 'online', duration: 90 },
      { title: 'Executing & Monitoring', type: 'online', duration: 90 },
      { title: 'Mock Exam Practice', type: 'offline', duration: 120 },
    ],
  },
  {
    courseTitle: 'Entrepreneurship: Launch Your Startup from Zero',
    courseDescription: 'Validate ideas, build an MVP, get first customers, and raise funding. Real startup playbook with founder case studies.',
    coursePrice: 109.99, discount: 5, category: 'Business & Management', level: 'Beginner', thumbIdx: 20,
    lessons: [
      { title: 'Idea Validation Framework', type: 'pdf', duration: 25 },
      { title: 'Building an MVP', type: 'online', duration: 90 },
      { title: 'Customer Acquisition', type: 'online', duration: 75 },
      { title: 'Pitch Deck & Fundraising', type: 'offline', duration: 90 },
    ],
  },
  {
    courseTitle: 'Stock Market Investing for Beginners',
    courseDescription: 'Understand stocks, ETFs, bonds, and mutual funds. Build a diversified portfolio with dollar-cost averaging and value investing principles.',
    coursePrice: 69.99, discount: 20, category: 'Business & Management', level: 'Beginner', thumbIdx: 17,
    lessons: [
      { title: 'Stock Market Basics', type: 'pdf', duration: 25 },
      { title: 'Fundamental Analysis', type: 'online', duration: 75 },
      { title: 'Technical Analysis Basics', type: 'online', duration: 60 },
      { title: 'Portfolio Construction', type: 'offline', duration: 75 },
    ],
  },
  // ---- PHOTOGRAPHY (8 courses) ----
  {
    courseTitle: 'DSLR Photography: Master the Fundamentals',
    courseDescription: 'Learn exposure triangle, composition rules, lighting, and post-processing. Take control of your camera in any situation.',
    coursePrice: 59.99, discount: 10, category: 'Photography', level: 'Beginner', thumbIdx: 8,
    lessons: [
      { title: 'Camera Modes & Settings', type: 'pdf', duration: 20 },
      { title: 'Exposure Triangle', type: 'online', duration: 75 },
      { title: 'Composition & Framing', type: 'online', duration: 60 },
      { title: 'Outdoor Shooting Workshop', type: 'offline', duration: 120 },
      { title: 'Lightroom Editing Basics', type: 'online', duration: 60 },
    ],
  },
  {
    courseTitle: 'Lightroom & Photoshop: Photo Editing Masterclass',
    courseDescription: 'Professional photo editing workflows: color grading, retouching, compositing, and batch processing for commercial work.',
    coursePrice: 69.99, discount: 15, category: 'Photography', level: 'Intermediate', thumbIdx: 8,
    lessons: [
      { title: 'Lightroom Catalog Setup', type: 'pdf', duration: 20 },
      { title: 'Color Grading Techniques', type: 'online', duration: 90 },
      { title: 'Photoshop Retouching', type: 'online', duration: 75 },
      { title: 'Batch Export Workflow', type: 'offline', duration: 45 },
    ],
  },
  {
    courseTitle: 'Portrait Photography — Professional Techniques',
    courseDescription: 'Studio and natural light portrait photography. Posing, lighting setups, background selection, and post-processing for professional results.',
    coursePrice: 79.99, discount: 5, category: 'Photography', level: 'Intermediate', thumbIdx: 8,
    lessons: [
      { title: 'Portrait Lighting Theory', type: 'pdf', duration: 25 },
      { title: 'Studio Lighting Setup', type: 'online', duration: 90 },
      { title: 'Posing Techniques', type: 'offline', duration: 120 },
      { title: 'Post-Processing Portraits', type: 'online', duration: 60 },
    ],
  },
  // ---- PERSONAL DEVELOPMENT (10 courses) ----
  {
    courseTitle: 'The Science of Well-Being',
    courseDescription: 'Based on Yale\'s most popular course. Evidence-based practices for lasting happiness: gratitude, mindfulness, goal-setting, and social connection.',
    coursePrice: 49.99, discount: 0, category: 'Personal Development', level: 'Beginner', thumbIdx: 19,
    lessons: [
      { title: 'Science of Happiness', type: 'pdf', duration: 20 },
      { title: 'Rewirement Challenge 1: Gratitude', type: 'online', duration: 45 },
      { title: 'Rewirement Challenge 2: Meditation', type: 'online', duration: 45 },
      { title: 'Rewirement Challenge 3: Exercise', type: 'offline', duration: 60 },
      { title: 'Building Lasting Habits', type: 'online', duration: 45 },
    ],
  },
  {
    courseTitle: 'Public Speaking & Presentation Mastery',
    courseDescription: 'Overcome fear, structure compelling stories, control body language, and deliver persuasive presentations in any setting.',
    coursePrice: 59.99, discount: 10, category: 'Personal Development', level: 'Beginner', thumbIdx: 20,
    lessons: [
      { title: 'Overcoming Stage Fright', type: 'pdf', duration: 20 },
      { title: 'Structuring Your Message', type: 'online', duration: 60 },
      { title: 'Body Language Mastery', type: 'online', duration: 45 },
      { title: 'Live Presentation Practice', type: 'offline', duration: 90 },
    ],
  },
  {
    courseTitle: 'Habit Building: The Compound Effect',
    courseDescription: 'Design systems for lasting change using behavioral science. Atomic habits, implementation intentions, habit stacking, and tracking.',
    coursePrice: 44.99, discount: 20, category: 'Personal Development', level: 'Beginner', thumbIdx: 14,
    lessons: [
      { title: 'Habit Loop Science', type: 'pdf', duration: 20 },
      { title: 'Designing Your System', type: 'online', duration: 60 },
      { title: 'Habit Stacking Techniques', type: 'online', duration: 45 },
      { title: 'Accountability Workshop', type: 'offline', duration: 60 },
    ],
  },
  {
    courseTitle: 'Emotional Intelligence for Leaders',
    courseDescription: 'Develop self-awareness, empathy, and social skills. Navigate conflict, build trust, and lead high-performing teams.',
    coursePrice: 64.99, discount: 15, category: 'Personal Development', level: 'Intermediate', thumbIdx: 20,
    lessons: [
      { title: 'EQ vs IQ in Leadership', type: 'pdf', duration: 20 },
      { title: 'Self-Awareness Practices', type: 'online', duration: 60 },
      { title: 'Empathy & Active Listening', type: 'online', duration: 45 },
      { title: 'Conflict Resolution', type: 'offline', duration: 75 },
    ],
  },
  // ---- LANGUAGE LEARNING (8 courses) ----
  {
    courseTitle: 'Spanish for Beginners — Complete Course',
    courseDescription: 'Go from zero to conversational Spanish in 3 months. Grammar, vocabulary, pronunciation, and real-life dialogues.',
    coursePrice: 54.99, discount: 10, category: 'Language Learning', level: 'Beginner', thumbIdx: 12,
    lessons: [
      { title: 'Spanish Alphabet & Pronunciation', type: 'pdf', duration: 20 },
      { title: 'Essential Vocabulary & Phrases', type: 'online', duration: 60 },
      { title: 'Grammar Foundations', type: 'online', duration: 75 },
      { title: 'Conversation Practice', type: 'offline', duration: 90 },
    ],
  },
  {
    courseTitle: 'Business English for Professionals',
    courseDescription: 'Master English for business emails, meetings, presentations, and negotiations. Reduce accent and build professional vocabulary.',
    coursePrice: 64.99, discount: 0, category: 'Language Learning', level: 'Intermediate', thumbIdx: 12,
    lessons: [
      { title: 'Business Email Writing', type: 'pdf', duration: 25 },
      { title: 'Meeting & Negotiation English', type: 'online', duration: 75 },
      { title: 'Presentation Skills in English', type: 'online', duration: 60 },
      { title: 'Mock Business Meeting', type: 'offline', duration: 90 },
    ],
  },
  {
    courseTitle: 'Japanese: Hiragana to Conversational',
    courseDescription: 'Learn Japanese from scratch: Hiragana, Katakana, essential Kanji, grammar, and everyday conversation.',
    coursePrice: 74.99, discount: 15, category: 'Language Learning', level: 'Beginner', thumbIdx: 12,
    lessons: [
      { title: 'Hiragana & Katakana', type: 'pdf', duration: 30 },
      { title: 'Basic Grammar Patterns', type: 'online', duration: 90 },
      { title: 'Essential Kanji (N5 Level)', type: 'online', duration: 75 },
      { title: 'Conversation Practice', type: 'offline', duration: 90 },
    ],
  },
  // ---- GAME DEVELOPMENT (6 courses) ----
  {
    courseTitle: 'Unity Game Development: Build 10 Games',
    courseDescription: 'Learn Unity and C# by building 10 complete games. From 2D platformers to 3D shooters, RPGs, and mobile games.',
    coursePrice: 99.99, discount: 10, category: 'Game Development', level: 'Beginner', thumbIdx: 0,
    lessons: [
      { title: 'Unity Interface & C# Basics', type: 'pdf', duration: 30 },
      { title: 'Game 1: 2D Platformer', type: 'online', duration: 180 },
      { title: 'Game 2: 3D Shooter', type: 'online', duration: 240 },
      { title: 'Mobile Game Optimization', type: 'offline', duration: 60 },
      { title: 'Publish to App Stores', type: 'online', duration: 45 },
    ],
  },
  {
    courseTitle: 'Unreal Engine 5 — Complete Developer Course',
    courseDescription: 'Master Nanite, Lumen, Blueprints, and C++ in Unreal Engine 5. Build cinematic environments and multiplayer games.',
    coursePrice: 129.99, discount: 15, category: 'Game Development', level: 'Intermediate', thumbIdx: 13,
    lessons: [
      { title: 'UE5 Setup & Navigation', type: 'pdf', duration: 25 },
      { title: 'Blueprints Fundamentals', type: 'online', duration: 120 },
      { title: 'Nanite & Lumen Lighting', type: 'online', duration: 90 },
      { title: 'Multiplayer Game Setup', type: 'offline', duration: 90 },
    ],
  },
  // ---- MUSIC & AUDIO (6 courses) ----
  {
    courseTitle: 'Music Production with Ableton Live',
    courseDescription: 'Produce professional electronic music in Ableton. Synthesis, sampling, arrangement, mixing, and mastering.',
    coursePrice: 84.99, discount: 10, category: 'Music & Audio', level: 'Beginner', thumbIdx: 9,
    lessons: [
      { title: 'Ableton Interface Overview', type: 'pdf', duration: 20 },
      { title: 'Sound Design & Synthesis', type: 'online', duration: 90 },
      { title: 'Arrangement & Structure', type: 'online', duration: 75 },
      { title: 'Mixing & Mastering', type: 'offline', duration: 90 },
    ],
  },
  {
    courseTitle: 'Guitar for Beginners — Complete Course',
    courseDescription: 'Learn guitar from absolute scratch. Chords, scales, strumming patterns, reading tabs, and playing your first songs.',
    coursePrice: 49.99, discount: 0, category: 'Music & Audio', level: 'Beginner', thumbIdx: 9,
    lessons: [
      { title: 'Guitar Anatomy & Tuning', type: 'pdf', duration: 15 },
      { title: 'Essential Chords', type: 'online', duration: 60 },
      { title: 'Strumming Patterns', type: 'online', duration: 60 },
      { title: 'Play Your First Songs', type: 'offline', duration: 90 },
    ],
  },
  // ---- 3D MODELING & ANIMATION (6 courses) ----
  {
    courseTitle: 'Blender 3D: From Beginner to Pro',
    courseDescription: 'Master Blender for 3D modeling, sculpting, rigging, animation, and rendering. Create characters, environments, and product visualizations.',
    coursePrice: 89.99, discount: 10, category: '3D Modeling & Animation', level: 'Beginner', thumbIdx: 13,
    lessons: [
      { title: 'Blender Interface Basics', type: 'pdf', duration: 20 },
      { title: '3D Modeling Fundamentals', type: 'online', duration: 90 },
      { title: 'Sculpting & Texturing', type: 'online', duration: 90 },
      { title: 'Rigging & Animation', type: 'offline', duration: 120 },
      { title: 'Rendering & Compositing', type: 'online', duration: 60 },
    ],
  },
  {
    courseTitle: 'Cinema 4D Motion Graphics Masterclass',
    courseDescription: 'Create broadcast-quality motion graphics in Cinema 4D. MoGraph, dynamics, and integration with After Effects.',
    coursePrice: 99.99, discount: 15, category: '3D Modeling & Animation', level: 'Intermediate', thumbIdx: 13,
    lessons: [
      { title: 'Cinema 4D Fundamentals', type: 'pdf', duration: 25 },
      { title: 'MoGraph System Deep Dive', type: 'online', duration: 90 },
      { title: 'Dynamics & Simulations', type: 'online', duration: 75 },
      { title: 'AE Integration & Render', type: 'offline', duration: 60 },
    ],
  },
  // ---- HEALTH & FITNESS (6 courses) ----
  {
    courseTitle: 'Complete Yoga for Beginners',
    courseDescription: '30-day yoga program for absolute beginners. Build flexibility, strength, and mindfulness through guided daily sessions.',
    coursePrice: 39.99, discount: 0, category: 'Health & Fitness', level: 'Beginner', thumbIdx: 11,
    lessons: [
      { title: 'Yoga Basics & Safety', type: 'pdf', duration: 15 },
      { title: 'Week 1: Foundation Poses', type: 'online', duration: 60 },
      { title: 'Week 2: Building Strength', type: 'online', duration: 60 },
      { title: 'Week 3: Balance & Flow', type: 'offline', duration: 75 },
      { title: 'Week 4: Full Practice', type: 'online', duration: 90 },
    ],
  },
  {
    courseTitle: 'Strength Training: Build Muscle at Home',
    courseDescription: 'No-gym required strength training program. Progressive overload, nutrition, and recovery for muscle building.',
    coursePrice: 44.99, discount: 10, category: 'Health & Fitness', level: 'Beginner', thumbIdx: 11,
    lessons: [
      { title: 'Workout Science Basics', type: 'pdf', duration: 20 },
      { title: 'Upper Body Program', type: 'online', duration: 60 },
      { title: 'Lower Body Program', type: 'online', duration: 60 },
      { title: 'Nutrition for Muscle', type: 'offline', duration: 45 },
    ],
  },
  // ---- BLOCKCHAIN & WEB3 (6 courses) ----
  {
    courseTitle: 'Ethereum & Solidity: Smart Contract Development',
    courseDescription: 'Build and deploy smart contracts on Ethereum. Solidity, Hardhat, OpenZeppelin, testing, and security auditing.',
    coursePrice: 109.99, discount: 10, category: 'Blockchain & Web3', level: 'Intermediate', thumbIdx: 16,
    lessons: [
      { title: 'Blockchain & Ethereum Basics', type: 'pdf', duration: 25 },
      { title: 'Solidity Programming', type: 'online', duration: 120 },
      { title: 'Smart Contract Testing', type: 'online', duration: 90 },
      { title: 'Security & Auditing', type: 'offline', duration: 75 },
    ],
  },
  {
    courseTitle: 'Web3 Full-Stack: Next.js + Wagmi + Hardhat',
    courseDescription: 'Build complete DApps from scratch. Connect wallets, interact with smart contracts, and deploy on multiple chains.',
    coursePrice: 129.99, discount: 5, category: 'Blockchain & Web3', level: 'Advanced', thumbIdx: 16,
    lessons: [
      { title: 'Web3 Architecture Overview', type: 'pdf', duration: 20 },
      { title: 'Wagmi & Web3 Hooks', type: 'online', duration: 90 },
      { title: 'Building a DeFi Dashboard', type: 'online', duration: 120 },
      { title: 'Multi-Chain Deployment', type: 'offline', duration: 60 },
    ],
  },
  // ---- E-COMMERCE (4 courses) ----
  {
    courseTitle: 'Build an E-Commerce Store with Next.js & Stripe',
    courseDescription: 'Full-stack e-commerce from scratch: product catalog, cart, Stripe payments, orders, and admin dashboard.',
    coursePrice: 99.99, discount: 15, category: 'E-Commerce', level: 'Intermediate', thumbIdx: 18,
    lessons: [
      { title: 'E-Commerce Architecture', type: 'pdf', duration: 20 },
      { title: 'Product Catalog & Cart', type: 'online', duration: 90 },
      { title: 'Stripe Payments Integration', type: 'online', duration: 75 },
      { title: 'Order Management & Admin', type: 'offline', duration: 90 },
    ],
  },
  {
    courseTitle: 'Shopify Development — Build Custom Themes',
    courseDescription: 'Create stunning Shopify themes with Liquid, sections, blocks, and metafields. Optimize for conversion and performance.',
    coursePrice: 79.99, discount: 10, category: 'E-Commerce', level: 'Intermediate', thumbIdx: 18,
    lessons: [
      { title: 'Shopify Architecture & Liquid', type: 'pdf', duration: 25 },
      { title: 'Theme Structure & Sections', type: 'online', duration: 90 },
      { title: 'Custom Metafields', type: 'online', duration: 60 },
      { title: 'Performance Optimization', type: 'offline', duration: 45 },
    ],
  },
  // ---- DATABASE (4 courses) ----
  {
    courseTitle: 'PostgreSQL — Beginner to Expert',
    courseDescription: 'Deep dive into PostgreSQL: advanced queries, indexes, partitioning, replication, and performance tuning.',
    coursePrice: 74.99, discount: 10, category: 'Database Design', level: 'Intermediate', thumbIdx: 21,
    lessons: [
      { title: 'PostgreSQL Installation & Setup', type: 'pdf', duration: 20 },
      { title: 'Advanced SQL & CTEs', type: 'online', duration: 90 },
      { title: 'Indexing & Performance', type: 'online', duration: 75 },
      { title: 'Replication & HA Setup', type: 'offline', duration: 60 },
    ],
  },
  {
    courseTitle: 'Redis Caching & Architecture Patterns',
    courseDescription: 'Speed up applications with Redis. Caching strategies, Pub/Sub, streams, rate limiting, and session management.',
    coursePrice: 64.99, discount: 15, category: 'Database Design', level: 'Intermediate', thumbIdx: 21,
    lessons: [
      { title: 'Redis Data Structures', type: 'pdf', duration: 20 },
      { title: 'Caching Patterns', type: 'online', duration: 60 },
      { title: 'Pub/Sub & Streams', type: 'online', duration: 75 },
      { title: 'Redis in Production', type: 'offline', duration: 60 },
    ],
  },
  // ---- SOFT SKILLS (4 courses) ----
  {
    courseTitle: 'Communication Skills for Professionals',
    courseDescription: 'Write clearly, speak confidently, and listen actively. Build relationships and influence outcomes in any professional context.',
    coursePrice: 49.99, discount: 0, category: 'Soft Skills', level: 'Beginner', thumbIdx: 20,
    lessons: [
      { title: 'Foundations of Communication', type: 'pdf', duration: 20 },
      { title: 'Written Communication', type: 'online', duration: 60 },
      { title: 'Verbal & Nonverbal Skills', type: 'online', duration: 60 },
      { title: 'Presentation Workshop', type: 'offline', duration: 90 },
    ],
  },
  {
    courseTitle: 'Negotiation Masterclass: Win-Win Strategies',
    courseDescription: 'Master principled negotiation: preparation, BATNA, anchoring, concession making, and closing deals in business and life.',
    coursePrice: 59.99, discount: 10, category: 'Soft Skills', level: 'Intermediate', thumbIdx: 20,
    lessons: [
      { title: 'Negotiation Fundamentals', type: 'pdf', duration: 20 },
      { title: 'Preparation & BATNA', type: 'online', duration: 60 },
      { title: 'Tactics & Counter-Tactics', type: 'online', duration: 75 },
      { title: 'Live Negotiation Role Play', type: 'offline', duration: 90 },
    ],
  },
];

// ============================================================
// TUTOR DATA
// ============================================================
const TUTORS = [
  { name: 'Dr. Sarah Mitchell', email: 'sarah@edemy.com', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
  { name: 'Prof. James Rodriguez', email: 'james@edemy.com', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' },
  { name: 'Lisa Chen', email: 'lisa@edemy.com', imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop' },
  { name: 'Marcus Johnson', email: 'marcus@edemy.com', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop' },
  { name: 'Priya Patel', email: 'priya@edemy.com', imageUrl: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop' },
  { name: 'Alex Thompson', email: 'alex@edemy.com', imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop' },
  { name: 'Emma Davis', email: 'emma@edemy.com', imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop' },
];

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(Lesson) private lessonRepo: Repository<Lesson>,
    @InjectRepository(Rating) private ratingRepo: Repository<Rating>,
    @InjectRepository(Progress) private progressRepo: Repository<Progress>,
  ) {}

  async onApplicationBootstrap() {
    console.log('🌱 Checking database seed data...');
    const courseCount = await this.courseRepo.count();
    if (courseCount >= 10) {
      console.log(`✅ Database already seeded with ${courseCount} courses. Enforcing related thumbnails...`);
      const CATEGORY_IMAGES: Record<string, string> = {
        'Web Development': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop&auto=format',
        'Data Science': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop&auto=format',
        'Artificial Intelligence': 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=450&fit=crop&auto=format',
        'Mobile Development': 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=450&fit=crop&auto=format',
        'Cloud & DevOps': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=450&fit=crop&auto=format',
        'Cybersecurity': 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=450&fit=crop&auto=format',
        'UI/UX Design': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop&auto=format',
        'Digital Marketing': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop&auto=format',
        'Finance': 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=450&fit=crop&auto=format',
        'Business': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop&auto=format',
      };
      const courses = await this.courseRepo.find();
      for (const c of courses) {
        const relatedImage = CATEGORY_IMAGES[c.category] || CATEGORY_IMAGES['Web Development'];
        if (c.courseThumbnail !== relatedImage) {
          c.courseThumbnail = relatedImage;
          await this.courseRepo.save(c);
        }
      }
      return;
    }
    console.log('🚀 No courses found. Seeding 100+ courses and demo users...');
    await this.seed();
  }

  async seed() {
    // 1. Seed Users
    const usersData = [
      { id: 'student_test_123', name: 'Jane Student', email: 'jane@student.com', imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', role: 'student', parentId: 'parent_test_123', studentIds: [], enrolledCourses: [] },
      { id: 'teacher_test_123', name: 'Professor Tech', email: 'prof@teacher.com', imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', role: 'teacher', parentId: null, studentIds: [], enrolledCourses: [] },
      { id: 'teacher_test_456', name: 'Dr. Sarah Mitchell', email: 'sarah@edemy.com', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', role: 'teacher', parentId: null, studentIds: [], enrolledCourses: [] },
      { id: 'parent_test_123', name: 'Robert Parent', email: 'robert@parent.com', imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', role: 'parent', parentId: null, studentIds: ['student_test_123'], enrolledCourses: [] },
      { id: 'admin_test_123', name: 'Edemy Administrator', email: 'admin@edemy.com', imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', role: 'admin', parentId: null, studentIds: [], enrolledCourses: [] },
    ];

    for (const u of usersData) {
      const exists = await this.userRepo.findOne({ where: { id: u.id } });
      if (!exists) {
        await this.userRepo.save(this.userRepo.create(u));
      }
    }
    console.log('✅ Users seeded.');

    // 2. Seed Courses
    const teacherIds = ['teacher_test_123', 'teacher_test_456'];
    const futureBase = new Date();

    for (let i = 0; i < COURSES_DATA.length; i++) {
      const data = COURSES_DATA[i];
      const educatorId = teacherIds[i % teacherIds.length];

      const course = this.courseRepo.create({
        courseTitle: data.courseTitle,
        courseDescription: data.courseDescription,
        courseThumbnail: getThumbnail(data.thumbIdx),
        coursePrice: data.coursePrice,
        isPublished: true,
        discount: data.discount,
        educator: educatorId,
        category: data.category,
        level: data.level,
        language: 'English',
        enrolledStudents: i < 5 ? ['student_test_123'] : [],
      });
      const savedCourse = await this.courseRepo.save(course);

      // Seed lessons
      for (let j = 0; j < data.lessons.length; j++) {
        const l = data.lessons[j];
        const futureDate = new Date(futureBase);
        futureDate.setDate(futureDate.getDate() + (i * 3) + j + 1);
        futureDate.setHours(14 + (j % 4), 0, 0, 0);

        const tutor = TUTORS[j % TUTORS.length];
        const lesson = this.lessonRepo.create({
          lessonId: `${savedCourse.id}_lesson_${j + 1}`,
          lessonTitle: l.title,
          lessonType: l.type,
          duration: l.duration,
          sortOrder: j,
          courseId: savedCourse.id,
          tutors: [{ name: tutor.name, email: tutor.email, imageUrl: tutor.imageUrl }],
          pdfUrl: l.type === 'pdf' ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : null,
          webLink: l.type === 'link' ? 'https://developer.mozilla.org/en-US/' : null,
          meetLink: l.type === 'online' ? `https://meet.google.com/edm-${savedCourse.id}-${j}` : null,
          locationDetails: l.type === 'offline' ? `Edemy Campus, Building ${String.fromCharCode(65 + (i % 8))}, Room ${100 + (j * 10)}` : null,
          timeSchedule: (l.type === 'online' || l.type === 'offline') ? futureDate : null,
          quizQuestion: j % 2 === 0 ? `Which concept from "${l.title}" is most fundamental?` : null,
          quizOptions: j % 2 === 0 ? ['Core principle A', 'Core principle B', 'Core principle C', 'Core principle D'] : null,
          quizCorrectIndex: j % 2 === 0 ? 0 : null,
        });
        await this.lessonRepo.save(lesson);
      }

      // Seed demo ratings
      const ratings = [
        { userId: 'student_test_123', rating: 4 + (i % 2), review: 'Great course, very well structured!' },
        { userId: 'parent_test_123', rating: 5, review: 'Excellent content and teaching style.' },
      ];
      for (const r of ratings) {
        await this.ratingRepo.save(this.ratingRepo.create({ courseId: savedCourse.id, ...r }));
      }
    }
    console.log(`✅ ${COURSES_DATA.length} courses seeded successfully.`);

    // 3. Seed progress for enrolled student
    const firstCourse = await this.courseRepo.findOne({ where: {} });
    if (firstCourse) {
      const existingProgress = await this.progressRepo.findOne({ where: { userId: 'student_test_123', courseId: firstCourse.id } });
      if (!existingProgress) {
        await this.progressRepo.save(this.progressRepo.create({
          userId: 'student_test_123',
          courseId: firstCourse.id,
          completed: false,
          completedLessons: [`${firstCourse.id}_lesson_1`],
        }));
      }
    }
    console.log('✅ Progress data seeded.');
    console.log('🎉 Seed complete!');
  }
}
