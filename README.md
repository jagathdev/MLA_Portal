# 🏛️ MLA Portal

A full-stack management portal designed to provide a centralized platform for managing users, administrative activities, information, and portal operations with a modern and responsive interface.

## 🚀 Live Demo

**Live Application:** https://mla-portal-dusky.vercel.app

## ✨ Features

* 🔐 **Authentication** — Secure user authentication and protected application access.
* 🔑 **Google OAuth** — Sign in securely using Google authentication.
* 👤 **User Management** — Manage and maintain user-related information.
* 🛡️ **Role-Based Access** — Control access to application features based on user roles.
* 📊 **Dashboard** — Centralized interface for managing portal activities and information.
* 🗄️ **MongoDB Integration** — Store and manage application data using MongoDB.
* 📡 **REST API** — Backend APIs for communication between frontend and server.
* 📁 **File Upload Support** — Upload and process files using the backend.
* 📧 **Email Integration** — Send application-related emails using Nodemailer.
* ⚡ **Modern React UI** — Responsive frontend built with React and TypeScript.
* 📱 **Responsive Design** — Designed for desktop and mobile experiences.
* 🧩 **Modular Architecture** — Organized frontend and backend structure for maintainability.

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* Motion
* Lucide React
* React Router

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication
* Express Session
* Passport.js
* Google OAuth
* Bcrypt
* Nodemailer
* Multer
* Express Validator
* CORS
* Google GenAI

## 📁 Project Structure

```text
MLA_Portal/
│
├── client/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── server.ts
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* MongoDB
* Git

### 1. Clone the Repository

```bash
git clone https://github.com/jagathdev/MLA_Portal.git

cd MLA_Portal
```

### 2. Setup the Client

```bash
cd client
npm install
npm run dev
```

The frontend will run using Vite.

### 3. Setup the Server

Open another terminal:

```bash
cd server
npm install
npm run dev
```

The backend runs using the TypeScript development server.

## 🔐 Environment Variables

Create the required environment variables for the client and server.

Example:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> Never commit your `.env` file, credentials, OAuth secrets, or API keys to GitHub.

## 🔄 Application Flow

```text
User
  │
  ▼
Login / Register
  │
  ├──► Email & Password
  │
  └──► Google OAuth
  │
  ▼
Authentication
  │
  ▼
User Session / JWT
  │
  ▼
Protected Portal
  │
  ├──► User Management
  ├──► Dashboard
  ├──► Portal Operations
  └──► Administrative Features
  │
  ▼
Backend REST API
  │
  ▼
MongoDB
```

## 🔑 Authentication

The application supports secure authentication using:

* JWT authentication
* Session-based authentication
* Google OAuth
* Passport.js
* Password hashing with Bcrypt
* Protected API routes
* Authentication middleware

Authentication helps ensure that protected portal functionality is accessible only to authorized users.

## 🗄️ Database Integration

The application uses **MongoDB** as the primary database with **Mongoose** for database operations.

MongoDB is used for storing application and user-related data.

The backend follows a structured model-based architecture for managing database operations.

## 📡 API Integration

The frontend communicates with the backend through REST APIs.

```text
React Frontend
      │
      ▼
    Axios
      │
      ▼
Express REST API
      │
      ▼
Middleware
      │
      ▼
Controllers
      │
      ▼
Services
      │
      ▼
Mongoose
      │
      ▼
MongoDB
```

## 📁 File Upload

The backend uses **Multer** to handle file uploads and multipart form data.

This provides support for processing files submitted through the portal.

## 📧 Email Integration

The backend uses **Nodemailer** for email-related functionality.

It can be used for:

* User notifications
* Portal communication
* Account-related emails
* Administrative notifications

## 🤖 AI Integration

The project includes Google's GenAI integration, providing a foundation for AI-powered functionality within the portal.

AI capabilities can be extended for:

* Intelligent information processing
* Automated content generation
* Data summarization
* User assistance
* AI-powered portal workflows

## 🛡️ Security

The application includes several security mechanisms:

* JWT-based authentication
* Session management
* Password hashing
* Google OAuth authentication
* Protected API routes
* Request validation
* CORS configuration
* Environment-based secrets
* Server-side API integration

## 🎯 Future Improvements

* Advanced admin dashboard
* Advanced user management
* Role and permission management
* Notification system
* Analytics dashboard
* Activity tracking
* Advanced search and filtering
* Document management
* AI-powered features
* Email notification system
* Audit logs
* Mobile application
* Automated testing
* CI/CD integration

## 📌 Project Purpose

This project was built as a practical full-stack application to explore the development of a **management portal using React, TypeScript, Node.js, Express, MongoDB, authentication, Google OAuth, REST APIs, file processing, email integration, and AI technologies**.

## 👨‍💻 Author

**Jagathratchagan V**

GitHub: https://github.com/jagathdev

## 📄 License

This project is for learning and development purposes.
