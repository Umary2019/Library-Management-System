# Design and Implementation of a Web-Based Library Management System with Borrowing, Return Tracking and Overdue Monitoring

A modern full-stack Library Management System built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB. The application replaces paper-based records with a secure digital platform for managing books, users, borrowing, returns, overdue monitoring, and reports.

## Features

- Modern landing page for project presentation
- Role-based authentication for admin, librarian, and student
- Protected routes and dashboard layouts
- Book management with search and filtering
- User management and librarian creation
- Category management
- Borrowing and return tracking
- Overdue monitoring and fine calculation
- Reports and dashboard analytics
- Responsive UI for desktop, tablet, and mobile
- Toast notifications, loading states, and empty states

## Landing Page Overview

The landing page explains the system purpose, problem statement, solution, key features, user roles, workflow, benefits, statistics preview, and contact details in a polished defense-ready layout.

## Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Icons
- Recharts
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs
- express-validator
- helmet
- cors
- morgan
- compression
- express-rate-limit
- dotenv

## Folder Structure

```text
library-management-system/
  frontend/
  backend/
```

## Installation Steps

### 1. Clone or open the project

Open the `library-management-system` folder in VS Code.

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### 3. Configure the frontend

```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

## Backend Setup

- Copy `backend/.env.example` to `backend/.env`
- Update `MONGO_URI` and `JWT_SECRET`
- Run the seed script to create default users, sample categories, sample books, and borrow records

## Frontend Setup

- Copy `frontend/.env.example` to `frontend/.env`
- Ensure `VITE_API_URL` points to the backend API
- Start the Vite development server

## Environment Variables

### Backend

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/library_management_system
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Frontend

```env
VITE_API_URL=http://localhost:5000/api
```

## Default Login Accounts

- Admin: `umarkhalifaabubakar0@gmail.com` / `Umar@2019`
- Librarian: `bargazal002@gmail.com` / `Umar@2019`
- Students register from the registration page.

## API Summary

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`
- `PUT /api/auth/change-password`

### Users
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users/librarian`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`
- `PATCH /api/users/:id/status`

### Books
- `GET /api/books`
- `GET /api/books/:id`
- `POST /api/books`
- `PUT /api/books/:id`
- `DELETE /api/books/:id`
- `GET /api/books/search`
- `GET /api/books/category/:category`

### Categories
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Borrowing
- `POST /api/borrow`
- `GET /api/borrow`
- `GET /api/borrow/my-records`
- `GET /api/borrow/active`
- `GET /api/borrow/overdue`
- `PUT /api/borrow/:id/return`
- `GET /api/borrow/:id`

### Reports
- `GET /api/reports/books`
- `GET /api/reports/borrowed`
- `GET /api/reports/returned`
- `GET /api/reports/overdue`
- `GET /api/reports/users`
- `GET /api/reports/monthly`

### Dashboard
- `GET /api/dashboard/admin`
- `GET /api/dashboard/librarian`
- `GET /api/dashboard/student`

## How to Run the Project

1. Start MongoDB locally or use a hosted MongoDB cluster.
2. Run the backend server.
3. Run the frontend app.
4. Open the frontend URL shown by Vite.
5. Log in using one of the default accounts.

## Deploy to Vercel

Deploy this system as two Vercel projects:
- `backend` as a Node.js Serverless Function API
- `frontend` as a Vite static site

### 1. Prepare MongoDB Atlas

- Create a MongoDB Atlas database (or use an existing cluster).
- Whitelist Vercel network access in Atlas (temporarily `0.0.0.0/0` or a stricter policy if available).
- Create a database user and URL-encode special characters in password.

### 2. Deploy backend (`backend/`)

1. In Vercel, create a new project and set **Root Directory** to `backend`.
2. Keep framework as **Other** (auto-detected Node).
3. Add environment variables:

```env
MONGO_URI=your_atlas_connection_string
JWT_SECRET=a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend.vercel.app
CLIENT_URLS=https://your-frontend.vercel.app
ALLOW_VERCEL_PREVIEWS=true
```

4. Deploy and copy backend URL, for example:

```text
https://your-backend.vercel.app
```

5. Verify health endpoint:

```text
https://your-backend.vercel.app/api/health
```

### 3. Deploy frontend (`frontend/`)

1. Create another Vercel project and set **Root Directory** to `frontend`.
2. Framework preset should be **Vite**.
3. Add environment variable:

```env
VITE_API_URL=https://your-backend.vercel.app/api
```

4. Deploy and open the frontend URL.

### 4. Update backend CORS allow-list

- Add your final frontend production URL and preview URL policy in backend env:

```env
CLIENT_URLS=https://your-frontend.vercel.app
ALLOW_VERCEL_PREVIEWS=true
```

- Redeploy backend after env updates.

### 5. Seed data (one-time)

Because Vercel functions are stateless, run seed from local machine against Atlas:

```bash
cd backend
cp .env.example .env
# set .env MONGO_URI/JWT values to your Atlas deployment values
npm install
npm run seed
```

### Deployment Notes

- Root-level `vercel.json` contains the multi-service deployment mapping.
- Backend routing is configured by `backend/vercel.json`.
- Frontend SPA routing is configured by `frontend/vercel.json`.
- Serverless entrypoint is `backend/api/index.js`.
- Express app is exported from `backend/app.js` for Vercel and started locally via `backend/server.js`.

## Future Improvements

- PDF export implementation for reports
- Book barcode scanning
- Email reminders for overdue books
- Fine payment integration
- Advanced audit logs and notifications
- Reservation and renewal features
