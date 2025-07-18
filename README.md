<!-- ````markdown -->
# Feedback Platform

A full-stack web application designed to allow administrators to create custom feedback forms with various question types, share them publicly for response collection, and view submitted responses in a structured or summarized format. The application features user authentication for admin access and a responsive user interface built with React and Material-UI.

## Table of Contents

-   [Features](#features)
-   [Technologies Used](#technologies-used)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
    -   [Backend Setup](#backend-setup)
    -   [Frontend Setup](#frontend-setup)
-   [Running the Application](#running-the-application)
-   [API Endpoints](#api-endpoints)
    -   [Authentication](#authentication)
    -   [Forms](#forms)
    -   [Responses](#responses)
-   [Folder Structure](#folder-structure)
-   [License](#license)

## Features

* **Admin Authentication:** Secure registration and login for administrators to manage forms.
* **Form Creation:** Admins can create new feedback forms with a title, description, and multiple questions.
* **Question Types:** Supports two types of questions:
    * **Text Input:** For open-ended text answers.
    * **Multiple Choice:** For pre-defined options (single or multiple selections).
* **Required Questions:** Mark questions as mandatory to ensure comprehensive responses.
* **Public Form Submission:** Shareable public URLs for forms, allowing anyone to submit responses without authentication.
* **Dashboard Overview:** Admins can view all their created forms on a centralized dashboard.
* **Response Viewing:**
    * **Tabular View:** See all responses in a clear table format, with each question as a column.
    * **Summary View:** Get aggregated insights for multiple-choice questions (option counts) and a list of text answers.
* **Responsive UI:** Built with Material-UI for a modern and adaptive user experience.

## Technologies Used

### Backend

* **Node.js:** JavaScript runtime.
* **Express.js:** Web framework for building RESTful APIs.
* **TypeScript:** Superset of JavaScript that adds static types.
* **MongoDB:** NoSQL database for data storage.
* **Mongoose:** ODM (Object Data Modeling) library for MongoDB.
* **Bcryptjs:** For password hashing and security.
* **JSON Web Token (JWT):** For user authentication and authorization.
* **Dotenv:** To manage environment variables.
* **CORS:** Middleware for enabling Cross-Origin Resource Sharing.

### Frontend

* **React:** JavaScript library for building user interfaces.
* **TypeScript:** For type-safe frontend development.
* **Vite:** Fast build tool and development server.
* **Material-UI:** React component library for beautiful and consistent UI.
* **React Router DOM:** For client-side routing.
* **Redux Toolkit:** For efficient state management.
    * **RTK Query:** For simplified API data fetching, caching, and state management.
* **UUID:** For generating unique IDs for questions.

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (v18 or higher recommended)
* **npm** or **Yarn** (npm comes with Node.js)
* **MongoDB** (running locally or accessible via a cloud service like MongoDB Atlas)

## Installation

Clone the repository and set up both the backend and frontend.

```bash
git clone <repository_url>
cd AynaTask-6405d8e364a23089a1e7a1765fc83bc7f4159057
````

### Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Install backend dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3.  Create a `.env` file in the `backend` directory and add your MongoDB URI and JWT secret:
    ```env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=a_very_strong_secret_key_for_jwt
    ```
      * Replace `your_mongodb_connection_string` with your MongoDB connection string (e.g., `mongodb://localhost:27017/feedback_platform` for local or a cloud Atlas URI).
      * Replace `a_very_strong_secret_key_for_jwt` with a long, random string.

### Frontend Setup

1.  Navigate to the `frontend` directory:
    ```bash
    cd ../frontend
    ```
2.  Install frontend dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

## Running the Application

After setting up both backend and frontend, you can run the application.

1.  **Start the Backend Server:**
    Open a new terminal, navigate to the `backend` directory, and run:

    ```bash
    cd backend
    npm run dev
    # The server will run on http://localhost:5000 (or your specified PORT).
    ```

    (Alternatively, `npm start` to run the compiled JavaScript from `dist/app.js`)

2.  **Start the Frontend Development Server:**
    Open another terminal, navigate to the `frontend` directory, and run:

    ```bash
    cd frontend
    npm run dev
    # The frontend will typically open in your browser at http://localhost:5173 (or a similar port).
    ```

## API Endpoints

The backend API is built with Express.js and serves data for the frontend. All endpoints are prefixed with `/api`.

### Authentication

  * **`POST /api/auth/register`** (Public)
      * Register a new admin user.
      * **Body:** `{ name, email, password }`
      * **Response:** `{ _id, name, email, token }`
  * **`POST /api/auth/login`** (Public)
      * Authenticate a user and get a JWT token.
      * **Body:** `{ email, password }`
      * **Response:** `{ _id, name, email, token }`

### Forms

  * **`POST /api/forms`** (Private - Admin Only)
      * Create a new feedback form.
      * **Headers:** `Authorization: Bearer <token>`
      * **Body:** `{ title, description?, questions: [{ id, type, questionText, options?, required }] }`
      * **Response:** `Form Object`
  * **`GET /api/forms`** (Private - Admin Only)
      * Get all forms created by the authenticated admin.
      * **Headers:** `Authorization: Bearer <token>`
      * **Response:** `Array of Form Objects`
  * **`GET /api/forms/:id`** (Public)
      * Get a single form by its ID (for public submission).
      * **Response:** `Form Object`
  * **`GET /api/forms/:formId/responses`** (Private - Admin Only)
      * Get all responses for a specific form.
      * **Headers:** `Authorization: Bearer <token>`
      * **Response:** `Array of Response Objects`

### Responses

  * **`POST /api/responses`** (Public)
      * Submit a response to a form.
      * **Body:** `{ formId, answers: [{ questionId, answerText?, selectedOptions? }] }`
      * **Response:** `{ message, responseId }`

## Folder Structure

The project is divided into `backend` and `frontend` directories, each with its own dependencies and configuration.

```
AynaTask-6405d8e364a23089a1e7a1765fc83bc7f4159057/
├── backend/
│   ├── src/
│   │   ├── app.ts             # Main Express application file
│   │   ├── config/
│   │   │   └── db.ts          # MongoDB connection setup
│   │   ├── controllers/
│   │   │   ├── authController.ts    # User authentication logic
│   │   │   ├── formController.ts    # Form creation and retrieval logic
│   │   │   └── responseController.ts# Response submission logic
│   │   ├── middleware/
│   │   │   └── authMiddleware.ts    # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── Form.ts              # Mongoose schema for Forms
│   │   │   ├── Response.ts          # Mongoose schema for Responses
│   │   │   └── User.ts              # Mongoose schema for Users
│   │   ├── routes/
│   │   │   ├── authRoutes.ts        # Authentication routes
│   │   │   ├── formRoutes.ts        # Form management routes
│   │   │   └── responseRoutes.ts    # Response submission routes
│   │   └── utils/
│   │       └── jwt.ts           # JWT token generation utility
│   ├── package.json           # Backend dependencies and scripts
│   ├── tsconfig.json          # TypeScript configuration for backend
│   └── .env.example           # Example environment file
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── app/
    │   │   └── store.ts           # Redux store configuration
    │   ├── components/
    │   │   ├── FormCard.tsx       # Component to display individual forms
    │   │   ├── Navbar.tsx         # Navigation bar component
    │   │   └── QuestionBuilder.tsx# Component for building questions in form creation
    │   ├── features/
    │   │   ├── auth/
    │   │   │   ├── authApi.ts     # RTK Query API slice for authentication
    │   │   │   └── authSlice.ts   # Redux slice for authentication state
    │   │   ├── forms/
    │   │   │   └── formsApi.ts    # RTK Query API slice for forms
    │   │   └── responses/
    │   │       └── responsesApi.ts# RTK Query API slice for responses
    │   ├── pages/
    │   │   ├── CreateFormPage.tsx # Page for creating new forms
    │   │   ├── DashboardPage.tsx  # Admin dashboard page
    │   │   ├── LoginPage.tsx      # User login page
    │   │   ├── RegisterPage.tsx   # User registration page
    │   │   ├── SubmitFormPage.tsx # Public page for submitting form responses
    │   │   └── ViewResponsesPage.tsx# Page for viewing form responses
    │   ├── types/
    │   │   └── index.ts           # TypeScript type definitions
    │   ├── index.css            # Global CSS styles
    │   └── main.tsx             # Main React entry point and routing setup
    ├── index.html             # Main HTML file
    ├── package.json           # Frontend dependencies and scripts
    ├── tsconfig.json          # Base TypeScript configuration for frontend
    ├── tsconfig.app.json      # TypeScript config for application code
    ├── tsconfig.node.json     # TypeScript config for Node.js specific files (like vite.config.ts)
    └── vite.config.ts         # Vite configuration
```