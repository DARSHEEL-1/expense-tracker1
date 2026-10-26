# 💰 MERN Stack Expense Tracker

A full-stack Expense Tracker web application built with MongoDB, Express.js, React (Vite), and Node.js. Includes JWT authentication, real-time balance analytics, transaction management, and secure password hashing.

## 🚀 Features

- **JWT Authentication**: User registration and login with encrypted passwords (`bcryptjs`).
- **Dashboard Analytics**: Real-time calculations for Total Balance, Income, and Expenses.
- **Transaction Management**: Add and delete transactions mapped directly to the logged-in user.
- **RESTful API**: Node/Express API routes protected by authorization middleware.
- **MongoDB Cloud Persistence**: User and transaction data stored safely in MongoDB Atlas.

---

## 🛠️ Project Structure

```text
expense-tracker/
├── server/      # Node.js + Express Backend & MongoDB Models
└── client/      # React + Vite Frontend & Tailwind CSS UI