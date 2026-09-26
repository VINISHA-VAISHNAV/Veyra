# VEYRA — A Smarter Way to Shop

![VEYRA E-Commerce Platform](https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80)

> **VEYRA** is a full-stack consumer-tech and lifestyle e-commerce web application engineered with an editorial, minimalist aesthetic and architecture. Built with **React (Vite)**, **Node.js**, **Express.js**, and **MongoDB Atlas**, it features complete role-based access control (User/Admin), real-time inventory validation, visual order milestone tracking, and a dedicated administrative console.

---

## ⚡ Highlights & Key Features

- **Curated Storefront & Dynamic Discovery**:
  - Hero introduction with brand ethos and "Explore Collection" smooth anchor.
  - Real-time catalog filtering across 5 categories: `Audio`, `Wearables`, `Accessories`, `Lifestyle`, and `Tech`.
  - Live search across product names and descriptions.
  - Sorting by Newest Arrivals, Price (Low to High, High to Low), and Alphabetical.
- **Editorial Product Detail Experience**:
  - High-resolution imagery with stock status badges (`In Stock`, `Low Stock`, `Out of Stock`).
  - Interactive quantity stepper strictly clamped to current available inventory.
  - Guarantee callouts: expedited shipping, 2-year warranty, and 30-day return policy.
- **Cart & Reservation Mechanics**:
  - Live quantity adjustment directly in cart.
  - Automatic clamping to maximum inventory stock units.
  - Order subtotal calculations and complimentary shipping threshold.
  - State persistence backed by `localStorage` with server validation.
- **Trustworthy Checkout Flow**:
  - Full shipping destination form (Name, Phone, Address, City, Pincode).
  - Simulated payment options: **Cash on Delivery** and **Demo Card** (no real credit cards charged).
  - **Server-Side Security**: Prices and stock are never trusted from the client; the Express backend verifies product presence, asserts stock availability, calculates true totals from MongoDB, and atomically decrements inventory upon order creation.
- **Customer Order Milestone Tracking**:
  - Real-time visual progress stepper: `Placed` → `Confirmed` → `Shipped` → `Delivered`.
  - Explicit warning alert state if an order is `Cancelled`.
  - Comprehensive historical receipt with item snapshots, totals, and shipping details.
- **Administrative Command Center (`/admin`)**:
  - **Metric Dashboard**: Real-time counters for Total Products, Total Orders, Total Users, and Total Net Revenue (excluding cancelled orders).
  - **Product Management**: View, add new products, edit price/stock/category/featured flag, and delete products with confirmation dialogs.
  - **Order Management**: Inspect customer orders and update tracking status with automatic inventory restock upon cancellation.
- **Security & Session Architecture**:
  - Passwords hashed using `bcryptjs` with salt rounds.
  - Stateless JSON Web Token (`JWT`) authentication containing user ID and role.
  - Role-based authorization middleware protecting administrative endpoints.
  - Password hashes omitted from all queries and JSON responses.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM v6, Lucide React, Custom CSS Design System |
| **Backend** | Node.js, Express.js REST API, Mongoose ODM, JWT, BcryptJS, CORS, Dotenv |
| **Database** | MongoDB Atlas (Cloud) or Local MongoDB Community Server |
| **Environment** | Node.js 18+ / 20+ / 22+ / 26+ |

---

## 📂 Project Structure

```
Shopsyyy/
├── client/                     # Frontend Single Page Application (SPA)
│   ├── public/                 # Static assets & favicon
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx      # Typographic wordmark, search, cart counter, responsive drawer
│   │   │   ├── Footer.jsx      # Editorial brand footer, links, trust pillars
│   │   │   ├── ProductCard.jsx # Curated product card with stock badges
│   │   │   ├── OrderTimeline.jsx # Visual step tracker (Placed -> Confirmed -> Shipped -> Delivered)
│   │   │   ├── ProtectedRoute.jsx # Guard for logged-in user routes
│   │   │   └── AdminRoute.jsx  # Guard enforcing admin authorization
│   │   ├── context/
│   │   │   ├── AuthContext.jsx # JWT session, login, signup, logout
│   │   │   └── CartContext.jsx # Cart state, quantity limits, local persistence
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx # Analytics cards & recent orders table
│   │   │   │   ├── AdminProducts.jsx  # Full catalog CRUD & stock adjustment
│   │   │   │   └── AdminOrders.jsx    # Order fulfillment & status updates
│   │   │   ├── Home.jsx        # Hero, category pills, search & collection grid
│   │   │   ├── ProductDetail.jsx # Editorial specs, stock indicator, quantity picker
│   │   │   ├── Cart.jsx        # Items list, quantity steppers, order summary
│   │   │   ├── Checkout.jsx    # Shipping form, simulated payment, server order dispatch
│   │   │   ├── MyOrders.jsx    # Customer order history & live milestone tracker
│   │   │   ├── Login.jsx       # VEYRA login with demo credential quick-fill
│   │   │   └── Signup.jsx      # Customer registration with validation
│   │   ├── services/
│   │   │   └── api.js          # Unified Fetch client with Bearer token injection
│   │   ├── App.jsx             # React Router routing table & providers
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # VEYRA Minimal Design System (Obsidian/Zinc/Slate)
│   ├── index.html              # HTML shell with Google Fonts & meta tags
│   ├── vite.config.js          # Vite configuration with API dev proxy
│   └── package.json
│
├── server/                     # Backend REST API Server
│   ├── middleware/
│   │   ├── auth.js             # Bearer JWT verification & user attachment
│   │   ├── admin.js            # Role === 'admin' access check
│   │   └── errorHandler.js     # Centralized HTTP status code & error formatter
│   ├── models/
│   │   ├── User.js             # User schema with bcrypt password hashing
│   │   ├── Product.js          # Product catalog schema with search indexing
│   │   └── Order.js            # Order schema with items, total, shipping, and status
│   ├── routes/
│   │   ├── auth.js             # /api/auth (signup, login, me)
│   │   ├── products.js         # /api/products (get catalog, get single)
│   │   ├── orders.js           # /api/orders (create with stock validation, get my orders)
│   │   └── admin.js            # /api/admin (stats, products CRUD, orders status updates)
│   ├── utils/
│   │   └── seed.js             # Automatic seeder (admin account + 8 realistic products)
│   ├── .env                    # Active environment variables
│   ├── .env.example            # Environment configuration template
│   ├── server.js               # Express application entry point & MongoDB connection
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🍃 MongoDB Atlas Setup Guide

To connect VEYRA to a cloud MongoDB Atlas database:

1. **Create an Account**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and register for a free account.
2. **Deploy a Free Cluster**:
   - Choose the **M0 Free Shared** cluster.
   - Select your preferred cloud provider (AWS / Google Cloud) and nearest region.
3. **Configure Database Access (User)**:
   - In Atlas, go to **Security** → **Database Access**.
   - Click **Add New Database User**.
   - Authentication Method: **Password**.
   - Create a username (e.g. `veyra_admin`) and a password (e.g. `VeyraSecurePass2026`).
   - Grant role: **Read and write to any database**.
4. **Configure Network Access (IP Whitelist)**:
   - Go to **Security** → **Network Access**.
   - Click **Add IP Address**.
   - Select **Allow Access From Anywhere** (`0.0.0.0/0`) for development.
5. **Obtain Connection String**:
   - Go to **Deployments** → **Database** and click **Connect**.
   - Select **Drivers** (Node.js).
   - Copy the connection string:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/veyra?retryWrites=true&w=majority
     ```
   - Replace `<username>` and `<password>` with your database user credentials.
6. **Paste into `server/.env`**:
   - Open `server/.env` and update `MONGODB_URI`:
     ```env
     MONGODB_URI=mongodb+srv://veyra_admin:VeyraSecurePass2026@cluster0.xxxx.mongodb.net/veyra?retryWrites=true&w=majority
     ```

*(If you have MongoDB Community Server installed locally, the default `mongodb://127.0.0.1:27017/veyra` in `server/.env` works immediately out of the box).*

---

## ⚙️ Environment Variables

The server configuration resides in `server/.env`. A template is provided in `server/.env.example`:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Port for the Express backend | `5000` |
| `MONGODB_URI` | MongoDB Atlas or Local connection string | `mongodb://127.0.0.1:27017/veyra` |
| `JWT_SECRET` | Secret key used to sign JWT session tokens | `veyra_jwt_super_secret_key_production_2026` |
| `ADMIN_EMAIL` | Email for the auto-seeded administrator | `admin@veyra.com` |
| `ADMIN_PASSWORD` | Password for the auto-seeded administrator | `Admin@12345` |
| `ADMIN_NAME` | Display name of the administrator | `VEYRA Administrator` |

---

## 🚀 Installation & Running

### Step 1: Install Dependencies

Open a terminal in the project root:

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### Step 2: Start the Backend Server

```bash
cd server
npm start
```

*On initial startup, the backend automatically connects to MongoDB, seeds the administrator account (`admin@veyra.com`), and inserts the 8 curated products if the database is empty.*

Expected output:
```
--------------------------------------------------
 VEYRA — A smarter way to shop.
 Connected successfully to MongoDB Database.
--------------------------------------------------
[VEYRA Seed] Admin user created: admin@veyra.com
[VEYRA Seed] Successfully seeded 8 curated products.
[VEYRA Server] Listening on port 5000
[VEYRA API] http://localhost:5000/api/health
```

### Step 3: Start the Frontend Client

Open a second terminal window:

```bash
cd client
npm run dev
```

Visit the application in your browser at:
👉 **`http://localhost:5173`**

---

## 🔑 Administrator Access

When the server starts for the first time, an administrative account is automatically generated:

- **Email**: `admin@veyra.com`
- **Password**: `Admin@12345`

### Logging in as Admin:
1. Navigate to **`http://localhost:5173/login`**.
2. Click the convenient **"Auto-fill"** button in the demo credentials card (or manually type the credentials above).
3. Click **Sign In**.
4. A distinctive **`VEYRA / ADMIN`** badge will appear in the top navigation bar.
5. Click **`VEYRA / ADMIN`** or visit **`http://localhost:5173/admin`** to manage catalog items and customer orders.

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Public | Register new user (returns JWT token and profile) |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials (returns JWT token) |
| `GET` | `/api/auth/me` | Protected | Retrieve currently authenticated user profile |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | List products (supports `?category=`, `?search=`, `?sort=`) |
| `GET` | `/api/products/:id` | Public | Retrieve single product specifications |

### Orders (`/api/orders`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/orders` | Protected | Validate cart, check stock, compute total, reserve items, create order |
| `GET` | `/api/orders/my` | Protected | Retrieve authenticated user's order history |

### Administration (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | Dashboard summary (Products, Orders, Users, Net Revenue) |
| `GET` | `/api/admin/products` | Admin | Complete catalog inventory table |
| `POST` | `/api/admin/products` | Admin | Create and publish a new product |
| `PATCH` | `/api/admin/products/:id` | Admin | Update product price, stock, description, or featured flag |
| `DELETE` | `/api/admin/products/:id`| Admin | Delete product from catalog |
| `GET` | `/api/admin/orders` | Admin | List all orders placed across the storefront |
| `PATCH` | `/api/admin/orders/:id/status`| Admin | Update status (`Placed`, `Confirmed`, `Shipped`, `Delivered`, `Cancelled`) |

---

## 📸 Screenshots & UI Walkthrough

| Section | Preview Description |
| :--- | :--- |
| **Storefront Hero** | Minimalist editorial headline *"A smarter way to shop"*, value pillars, and category pills. |
| **Curated Catalog** | Clean cards with high-res photography, stock badges, and clamped quantity actions. |
| **Product Detail** | Full specifications, live inventory counter, and delivery guarantees. |
| **Order Tracking** | Visual milestone stepper: `Placed` → `Confirmed` → `Shipped` → `Delivered`. |
| **Admin Dashboard** | Real-time financial counters, catalog management modal, and fulfillment status controller. |

---

## 🛡️ Security Best Practices Implemented

1. **Server-Side Stock Validation**: Every order request recalculates product totals and ensures inventory availability directly in MongoDB before order confirmation.
2. **Encrypted Passwords**: `bcryptjs` with salted hashing protects user passwords. Passwords are never serialized into API responses.
3. **Role-Based Authorization**: Administrative routes verify `req.user.role === 'admin'` from verified JWT claims.
4. **Environment Isolation**: Database credentials and JWT secrets reside in `.env` and are strictly excluded from source control via `.gitignore`.
