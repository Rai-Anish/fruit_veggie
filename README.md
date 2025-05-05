# 🛒 Multi-Vendor Groceries eCommerce Platform

It's a scalable and modular backend system for a multi-vendor eCommerce marketplace with support for vendor approvals, organic product verification, secure authentication (OTP-based), product categorization, order management, and more.

---

## 📦 Features

- 🔐 **Authentication System**
  - Email & OTP-based registration/login
  - JWT-based authentication
  - Password reset functionality

- 👤 **User Roles**
  - `customer`, `vendor`, `admin`

- 🏪 **Vendors**
  - Vendor application & approval process
  - Organic product approval workflow
  - Store product management

- 🛍️ **Products**
  - Category management with nested parent categories
  - Organic/non-organic tagging
  - Product reviews & ratings (1–5)

- 🛒 **Cart & Orders**
  - Add-to-cart, cart item quantity update, cart total calculation
  - Order placement, tracking (status: placed, processing, shipped, delivered)
  - Delivery address management

- 💳 **Payments**
  - Support for Cash on Delivery and Credit Card (logic placeholder)

- 🧾 **Admin Features**
  - Approve vendors & organic products
  - View all users, vendors, and orders

---

## 🗂️ Database Schema
- The schema is designed to support a multi-vendor marketplace with modular entities like users, products, carts, orders, and reviews.
- Designed using **DBML** (used with dbdiagram.io)
- Follows normalized structure with dedicated `orderItems`, `cartItems`, and `deliveryAddresses` tables
- Enumerations used for clear role, status, and purpose handling

Here is the high-level Entity-Relationship (ER) diagram for the backend:

![ER diagram](https://github.com/user-attachments/assets/f36e265e-565d-4404-b13e-e111b7efe52f)

*Note: If you want clear ER diagram then click the link below*

Full DBML available in [`Interactive ER Diagram`](https://dbdiagram.io/d/68179ff41ca52373f56592ff)



## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB 
- **ORM**: Mongoose
- **Authentication**: JWT, OTP via email
- **Dev Tools**: DBML (for schema design), Postman, resend

---



