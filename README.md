# BookEase – Service Booking Platform

A full-stack MERN application that connects customers with service providers through a simple and convenient online booking platform.

BookEase allows customers to discover services, book appointments, and manage their bookings, while vendors can manage their services and availability. Administrators oversee vendor approvals and platform operations.

## Overview

BookEase is designed to simplify the process of finding and booking professional services. It provides separate dashboards and role-based functionality for customers, vendors, and administrators.

The platform focuses on secure authentication, service management, appointment scheduling, and booking management.

## Key Features

### Customer
- User registration and login.
- Browse and explore available services.
- View service details and vendor information.
- Book services based on available time slots.
- View and manage personal bookings.
- Cancel bookings.
- Manage profile information.

### Vendor
- Vendor registration and profile creation.
- Submit vendor profiles for admin approval.
- Manage service listings.
- Manage availability and time slots.
- View and manage customer bookings.
- Access a dedicated vendor dashboard.

### Admin
- Dedicated administrator dashboard.
- Review vendor registration requests.
- Approve or reject vendor applications.
- Manage platform operations.

### Authentication & Security
- JWT-based authentication.
- Access token and refresh token implementation.
- Password hashing using bcrypt.
- HTTP-only cookie-based token handling.
- Role-based access control.
- Protected routes and middleware.
- Input validation and error handling.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Styling | CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Authentication | JWT, bcrypt |
| API Testing | Postman |
| Version Control | Git & GitHub |

## Project Architecture

The project follows a client-server architecture.

```text
BookEase/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .gitignore
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md
```

## Installation & Setup

Follow these steps to run BookEase locally.

### 1. Clone the Repository

```bash
git clone https://github.com/hardiktak11-hub/BookEase.git
```

Navigate to the project directory:

```bash
cd BookEase
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the backend directory and configure the following environment variables:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

Start the backend server using the development script configured in `package.json`:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

## Application Roles

BookEase supports three distinct user roles:

| Role | Responsibilities |
|---|---|
| Customer | Discover services and manage bookings |
| Vendor | Manage services, availability, and bookings |
| Admin | Manage vendor approvals and platform operations |

Role-based authorization ensures that users can access only the functionality permitted for their assigned roles.

## API Functionality

The backend provides RESTful APIs organized into separate route modules:

- **Authentication APIs:** Registration, login, logout, and token management.
- **Service APIs:** Service listing and service management.
- **Booking APIs:** Booking creation, retrieval, and cancellation.
- **Availability APIs:** Vendor availability and time-slot management.
- **Vendor APIs:** Vendor profile and service management.
- **Admin APIs:** Vendor approval and administrative operations.

## Security Considerations

- Passwords are hashed before being stored in the database.
- JWT tokens are used for authentication.
- HTTP-only cookies help protect authentication tokens.
- Protected middleware validates user access.
- Role-based authorization restricts sensitive operations.
- Environment variables are used to store sensitive configuration.

## Future Enhancements

- Payment gateway integration.
- Customer reviews and ratings.
- Booking notifications.
- AI-based vendor recommendations.
- Enhanced analytics and reporting.

## What I Learned

Through building BookEase, I gained practical experience in:

- Developing REST APIs using Node.js and Express.js.
- Designing MongoDB schemas using Mongoose.
- Implementing JWT authentication and refresh token mechanisms.
- Building role-based authorization systems.
- Implementing CRUD operations.
- Managing relationships between users, vendors, services, and bookings.
- Connecting React frontend with backend APIs.
- Testing APIs using Postman.
- Organizing a full-stack application using a modular architecture.

## Project Information

**Project Name:** BookEase – Service Booking Platform

**Project Type:** Full-Stack Web Application

**Technology:** MERN Stack

**Developer:** Hardik Tak

**GitHub Repository:** https://github.com/hardiktak11-hub/BookEase

---

If you find this project interesting, feel free to explore the repository!
