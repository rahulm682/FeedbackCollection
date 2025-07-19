<!-- ````markdown -->
# Feedback Collection Platform

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
-   [Approach and Design Decisions](#approach-and-design-decisions)
-   [Folder Structure](#folder-structure)

## Features

* **Admin Authentication:** Secure registration and login for administrators to manage forms.
* **Form Creation:** Admins can create new feedback forms with a title, description, multiple questions, and an optional expiry date.
* **Question Types:** Supports two types of questions:
    * **Text Input:** For open-ended text answers.
    * **Multiple Choice:** For pre-defined options (single or multiple selections).
* **Required Questions:** Mark questions as mandatory to ensure comprehensive responses.
* **Form Expiry:** Forms can be set to expire, after which they will no longer accept responses.
* **Public Form Submission:** Shareable public URLs for forms, allowing anyone to submit responses without authentication.
* **Dashboard Overview:** Admins can view all their created forms on a centralized dashboard.
* **Response Viewing:**
    * **Tabular View:** See all responses in a clear table format, with each question as a column.
    * **Summary View:** Get aggregated insights for multiple-choice questions (option counts) and a list of text answers.
* **Responsive UI:** Built with Material-UI for a modern and adaptive user experience.
* **Export Responses:** Download form responses in CSV format for easy analysis.

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
* **date-fns:** For date manipulation in `DateTimePicker`.

## Prerequisites

Before you begin, ensure you have the following installed:

* **Node.js** (v20 or higher recommended)
* **npm** or **Yarn**
* **MongoDB** (running locally or accessible via a cloud service like MongoDB Atlas)

## Installation

Clone the repository and set up both the backend and frontend.

```bash
git clone [Your_GitHub_Repository_URL_Here]
cd [Your_Cloned_Repository_Folder_Name]
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
3.  Create a `.env` file in the `frontend` directory and add your backend API base URL:
    ```env
    VITE_BASE_URL=http://localhost:5000
    ```
      * Replace `http://localhost:5000` with the actual URL where your backend server is running if it's different.

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
      * **Password Rule:** Minimum 6 characters.
      * **Response:** `{ _id, name, email, token }`
  * **`POST /api/auth/login`** (Public)
      * Authenticate a user and get a JWT token.
      * **Body:** `{ email, password }`
      * **Response:** `{ _id, name, email, token }`

### Forms

  * **`POST /api/forms`** (Private)
      * Create a new feedback form.
      * **Headers:** `Authorization: Bearer <token>`
      * **Body:** `{ title, description?, questions: [{ id, type, questionText, options?, required }], expiresAt? }`
      * **Response:** `Form Object`
  * **`GET /api/forms`** (Private)
      * Get all forms created by the authenticated admin.
      * **Headers:** `Authorization: Bearer <token>`
      * **Response:** `Array of Form Objects`
  * **`GET /api/forms/:id`** (Public)
      * Get a single form by its ID (for public submission).
      * **Response:** `Form Object`
  * **`GET /api/forms/:id/admin-details`** (Private)
      * Get a single form by its ID with admin-specific details (e.g., without filtering for expiry).
      * **Headers:** `Authorization: Bearer <token>`
      * **Response:** `Form Object`
  * **`GET /api/forms/:formId/responses`** (Private)
      * Get all responses for a specific form.
      * **Headers:** `Authorization: Bearer <token>`
      * **Response:** `Array of Response Objects`
  * **`GET /api/forms/:formId/responses/export-csv`** (Private)
      * Export all responses for a specific form as a CSV file.
      * **Headers:** `Authorization: Bearer <token>`
      * **Response:** `CSV file`
  * **`DELETE /api/forms/:id`** (Private)
      * Delete a form and all its associated responses.
      * **Headers:** `Authorization: Bearer <token>`
      * **Response:** `{ message }`

### Responses

  * **`POST /api/responses`** (Public)
      * Submit a response to a form.
      * **Body:** `{ formId, answers: [{ questionId, answerText?, selectedOptions? }] }`
      * **Response:** `{ message, responseId }`

## Approach and Design Decisions

This Feedback Collection Platform is designed with a clear separation of concerns using a **MERN stack** (MongoDB, Express.js, React, Node.js) architecture, leveraging TypeScript for improved code quality and maintainability.

### Architectural Decisions:

  * **Monorepo Structure (Logical Separation):** While the project is in a single repository, it's logically separated into `backend` and `frontend` directories. This allows for independent development, dependency management, and deployment of each part while keeping them cohesive for ease of development and understanding.
  * **RESTful API Design:** The backend exposes a well-defined RESTful API for all interactions, including authentication, form management, and response submission. This ensures a stateless, scalable, and easily consumable interface for the frontend or any other client.
  * **Token-Based Authentication (JWT):** JSON Web Tokens are used for secure authentication and authorization. This approach provides a stateless mechanism for verifying user identity across requests, reducing the need for session management on the server-side.
  * **Separation of Concerns (MVC-like on Backend):** The backend follows a pattern similar to MVC (Model-View-Controller), with distinct layers for:
      * **Models:** Mongoose schemas define the data structures for `User`, `Form`, and `Response`, enforcing data integrity and providing an interface for database interaction.,,
      * **Controllers:** Handle the business logic and interact with models to fulfill API requests (e.g., `authController`, `formController`, `responseController`).,,
      * **Routes:** Define the API endpoints and map them to the respective controller functions, applying middleware like `protect` for authentication.,,

### Frontend Design Decisions:

  * **React with TypeScript:** Chosen for building a dynamic and type-safe user interface. TypeScript greatly enhances code readability, helps catch errors early, and improves maintainability.
  * **Redux Toolkit for State Management:** Provides a robust and efficient way to manage the application's global state. It simplifies complex state logic and offers utilities like `createSlice` and `configureStore`.
  * **RTK Query for API Interaction:** Integrated with Redux Toolkit, RTK Query drastically simplifies data fetching, caching, and invalidation. It reduces boilerplate and provides powerful features like automatic re-fetching and optimistic updates, leading to a more efficient and responsive UI.
  * **Material-UI for Component Library:** Utilized for a consistent, modern, and responsive design. Material-UI components accelerate UI development and ensure a polished user experience across different devices.
  * **Client-Side Routing (React Router DOM):** Enables a single-page application experience, allowing for seamless navigation between different views without full page reloads.
  * **Theming (Light/Dark Mode):** Implemented a theme slice in Redux to allow users to toggle between light and dark modes, enhancing user preference and accessibility.
  * **UUID for Question IDs:** Ensures unique identification of questions within a form, which is crucial for handling responses and updates accurately.

### Key Feature Implementations:

  * **Dynamic Form Creation:** The `CreateFormPage` and `QuestionBuilder` components allow administrators to dynamically add and configure different types of questions (text, multiple-choice) with options for required fields.,
  * **Public Submission:** Forms can be accessed and submitted by anyone via a unique public URL, enabling wide feedback collection.
  * **Comprehensive Response Viewing:** `ViewResponsesPage` provides both a detailed tabular view for individual responses and a summary view for aggregated insights, especially useful for multiple-choice questions.
  * **CSV Export:** Functionality to export responses to CSV is directly implemented on the backend (`exportFormResponsesCsv` controller) and accessible from the frontend, facilitating external data analysis.

These decisions collectively aim to create a scalable, maintainable, and user-friendly feedback platform.

## Folder Structure

The project is divided into `backend` and `frontend` directories, each with its own dependencies and configuration.

```
AynaTask/
├── backend/
│   ├── src/
│   │   ├── app.ts             # Main Express application file
│   │   ├── config/
│   │   │   └── db.ts          # MongoDB connection setup
│   │   ├── controllers/
│   │   │   ├── authController.ts    # User authentication logic
│   │   │   ├── formController.ts    # Form creation, retrieval, and response handling logic
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
    │   │   ├── FormCard.tsx       # Component to display individual forms on dashboard
    │   │   ├── Navbar.tsx         # Navigation bar component
    │   │   └── QuestionBuilder.tsx# Component for building questions in form creation
    │   ├── features/
    │   │   ├── auth/
    │   │   │   ├── authApi.ts     # RTK Query API slice for authentication
    │   │   │   └── authSlice.ts   # Redux slice for authentication state
    │   │   ├── forms/
    │   │   │   └── formsApi.ts    # RTK Query API slice for forms
    │   │   ├── responses/
    │   │   │   └── responsesApi.ts# RTK Query API slice for responses
    │   │   └── theme/
    │   │       └── themeSlice.ts  # Redux slice for theme (light/dark mode)
    │   ├── pages/
    │   │   ├── CreateFormPage.tsx # Page for creating new forms
    │   │   ├── DashboardPage.tsx  # Admin dashboard page displaying created forms
    │   │   ├── LoginPage.tsx      # User login page
    │   │   ├── RegisterPage.tsx   # User registration page
    │   │   ├── SubmitFormPage.tsx # Public page for submitting form responses
    │   │   └── ViewResponsesPage.tsx# Page for viewing form responses and their summaries
    │   ├── types/
    │   │   └── index.ts           # TypeScript type definitions for data structures
    │   ├── index.css            # Global CSS styles
    │   └── main.tsx             # Main React entry point, routing, and theme setup
    ├── index.html             # Main HTML file
    ├── package.json           # Frontend dependencies and scripts
    ├── tsconfig.json          # Base TypeScript configuration for frontend
    ├── tsconfig.app.json      # TypeScript config for application code
    ├── tsconfig.node.json     # TypeScript config for Node.js specific files (like vite.config.ts)
    ├── vite.config.ts         # Vite configuration
    └── .env.example           # Example environment file
```