# VEYRA — A smarter way to shop.

A full-stack e-commerce web application built with React, Node.js, Express, and MongoDB.

VEYRA provides a modern shopping experience with product browsing, cart management, checkout, order tracking, authentication, and a dedicated admin panel for product and order management.

---

## ✨ Features

### 🛍️ Customer Features

- User registration and login
- JWT-based authentication
- Browse product catalog
- Product categories
- Product search and sorting
- Product details
- Product images
- Add products to cart
- Update cart quantities
- Remove products from cart
- Checkout
- Order creation
- Order history
- Order status tracking
- Responsive interface

### 🔐 Authentication & Authorization

- Secure user authentication
- Password hashing with bcrypt
- JWT session tokens
- Role-based access control
- Separate User and Admin permissions
- Protected API routes

### 👑 Admin Features

- Dedicated admin dashboard
- Admin-only access
- Product management
  - Create products
  - Update products
  - Delete products
  - Manage stock
- Order management
- View customer orders
- Update order status
- Track order lifecycle

### 🗄️ Database

VEYRA uses MongoDB with Mongoose for persistent data storage.

The application supports:

- Local MongoDB
- MongoDB Atlas

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Context API
- Lucide React
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

### Development

- npm
- Git
- GitHub

---

## 📁 Project Structure

```text
VEYRA/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── .gitignore
├── package.json
└── README.md