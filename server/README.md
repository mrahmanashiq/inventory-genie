# Inventory Genie - Backend API

Modern Node.js/Express backend for the Inventory Genie Enterprise system.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## 📚 API Documentation

Visit `/api/docs` when the server is running to view the Swagger documentation.

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_URL=your_cloudinary_url
```

## 🏗️ Project Structure

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── models/          # Database schemas
├── routes/          # API routes
├── middleware/      # Authentication & validation
└── utils/           # Helper functions
```

## 🔐 Authentication

This API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```
