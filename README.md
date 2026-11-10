# BookEase – Service Booking Platform

**A Full-Stack MERN Application for Seamless Service Booking**

BookEase is a full-stack service booking platform that connects customers with service providers through a simple and convenient online booking system. Customers can explore services and book appointments, vendors can manage their services and availability, and administrators can manage vendor approvals.

## Live Demo

| Resource | Link |
|---|---|
| Live Application | https://book-ease-lovat.vercel.app |
| Backend API | https://bookease-ya30.onrender.com |
| GitHub Repository | https://github.com/hardiktak11-hub/BookEase |

## Project Overview

BookEase is inspired by service marketplace platforms such as Urban Company. It provides a centralized platform where customers can discover services, select vendors, and schedule appointments.

The application implements role-based functionality for three types of users: Customers, Vendors, and Administrators.

## Key Features

### Customer
- User registration and login.
- Browse available services.
- View service details and vendor information.
- Book services based on available time slots.
- View personal booking history.
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
- Dedicated admin dashboard.
- View vendor registration requests.
- Approve or reject vendor applications.
- Manage vendor approval functionality.

### Authentication & Security
- JWT-based authentication.
- Access token and refresh token implementation.
- Password hashing using bcrypt.
- HTTP-only cookie-based authentication.
- Role-based authorization.
- Protected frontend routes.
- Authentication and authorization middleware.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite |
| Styling | CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcrypt |
| API Communication | Axios, REST APIs |
| API Testing | Postman |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git, GitHub |

## Project Architecture

BookEase follows a client-server architecture with a modular backend structure.

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

## Application Workflow

1. Customers register and log in.
2. Vendors register and create their vendor profiles.
3. Administrators review and approve vendor applications.
4. Approved vendors manage their services.
5. Vendors configure their availability and time slots.
6. Customers browse services and create bookings.
7. Customers and vendors manage their bookings through their respective dashboards.

## Installation & Setup

Follow these instructions to run BookEase locally.

### Prerequisites

- Node.js
- npm
- MongoDB database
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/hardiktak11-hub/BookEase.git

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

Create a `.env` file inside the backend directory:

```env
PORT=8000

MONGO_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

FRONTEND_URL=http://localhost:5173
```

Start the backend development server:

```bash
npm run dev
```

The backend will run on:

`http://localhost:8000`

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal.

## API Modules

The backend provides RESTful APIs organized into separate route modules:

| Module | Functionality |
|---|---|
| Authentication | Registration, login, logout and token management |
| Services | Service listing and management |
| Bookings | Booking creation, retrieval and cancellation |
| Availability | Vendor availability and time-slot management |
| Vendors | Vendor profiles and vendor management |
| Admin | Vendor approval and administrative operations |

## Deployment Architecture

The application is deployed using the following services:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas
- **Source Code:** GitHub

The React frontend
