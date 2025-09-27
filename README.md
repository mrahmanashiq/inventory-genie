# 🚀 Inventory Genie Enterprise

A modern, scalable, and enterprise-grade inventory management system built with cutting-edge technologies.

## ✨ Features

### 🎨 Modern UI/UX
- **Tailwind CSS Design System**: Beautiful, responsive, and accessible components
- **Dark Mode Support**: Automatic theme switching with system preferences
- **Mobile-First Design**: Fully responsive across all devices
- **Component Library**: Reusable UI components following design system principles

### 📊 Advanced Analytics & Dashboards
- **Real-time Charts**: Interactive visualizations using Recharts
- **Performance Metrics**: Revenue, profit, inventory turnover analytics
- **Role-based Dashboards**: Customized views for Admin, Manager, and Owner roles
- **Export Capabilities**: PDF and Excel export functionality

### 🔐 Enterprise Security
- **Role-Based Access Control (RBAC)**: Granular permission system
- **JWT Authentication**: Secure token-based authentication with refresh tokens
- **Audit Logging**: Complete activity tracking and compliance reporting
- **Multi-location Support**: Manage inventory across multiple warehouses

### 📦 Inventory Management
- **Advanced Product Catalog**: Smart search, filtering, and categorization
- **Stock Management**: Real-time stock tracking with low-stock alerts
- **Multi-location Inventory**: Track products across multiple warehouses
- **Barcode Integration**: QR code and barcode scanning support
- **Supplier Management**: Complete vendor relationship management

### 👥 User Management
- **User Roles**: Admin, Manager, Employee, Customer role hierarchy
- **Permission System**: Granular access control for features and data
- **User Activity Tracking**: Monitor user actions and system usage
- **Bulk Operations**: Efficient user and data management tools

## 🏗️ Architecture

### Backend (Node.js/Express)
```
server/
├── src/
│   ├── controllers/     # API request handlers
│   ├── services/        # Business logic layer
│   ├── models/          # Database schemas (MongoDB/Mongoose)
│   ├── middleware/      # Authentication, validation, logging
│   ├── routes/          # API route definitions
│   └── utils/           # Helper functions and utilities
├── config/              # Database and app configuration
└── docs/                # API documentation (Swagger)
```

### Frontend (React 18)
```
client/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/          # Base UI components (Button, Card, etc.)
│   │   ├── Dashboard/   # Dashboard components
│   │   ├── admin/       # Admin-specific components
│   │   └── product/     # Product management components
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React context providers
│   ├── apis/            # API client functions
│   └── lib/             # Utility functions
└── public/              # Static assets
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with concurrent features
- **TypeScript** - Type-safe development (optional)
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality component library
- **React Query (TanStack Query)** - Server state management
- **React Hook Form** - Performant form handling
- **Recharts** - Interactive chart library
- **React Router v6** - Client-side routing
- **Framer Motion** - Smooth animations

### Backend
- **Node.js 18+** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Socket.io** - Real-time communication
- **Swagger** - API documentation
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Jest** - Testing framework
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB 5.0+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mrahmanashiq/inventory-genie.git
   cd inventory-genie
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Server environment
   cd server
   cp .env.example .env
   # Edit .env with your configuration

   # Client environment (if needed)
   cd ../client
   cp .env.example .env
   ```

4. **Database Setup**
   ```bash
   # Make sure MongoDB is running
   # The application will create necessary collections automatically
   ```

5. **Start Development Servers**
   ```bash
   # Start backend (from server directory)
   npm run dev

   # Start frontend (from client directory)
   npm start
   ```

6. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

## 📱 User Roles & Permissions

### 🔹 Admin
- Full system access and configuration
- User management and role assignment
- System settings and security configuration
- Advanced reporting and analytics
- Audit log access

### 🔹 Manager
- Inventory management and optimization
- User supervision and team management
- Reporting and performance analytics
- Vendor and supplier management
- Order processing and fulfillment

### 🔹 Employee
- Product entry and updates
- Order processing
- Basic inventory operations
- Customer service functions
- Task assignment completion

### 🔹 Customer
- Product browsing and search
- Order placement and tracking
- Account management
- Order history and invoices

## 🔧 Configuration

### Environment Variables

**Server (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory-genie
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# Redis (for sessions and caching)
REDIS_URL=redis://localhost:6379
```

**Client (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
REACT_APP_UPLOAD_URL=http://localhost:5000/uploads
```

## 📊 API Documentation

The API is fully documented using Swagger/OpenAPI 3.0. Access the interactive documentation at:
- Development: http://localhost:5000/api-docs
- Production: https://your-domain.com/api-docs

### Key API Endpoints

```
Authentication
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/refresh
POST   /api/auth/logout

Products
GET    /api/products
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id

Users (Admin only)
GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id

Reports
GET    /api/reports/sales
GET    /api/reports/inventory
GET    /api/reports/analytics
```

## 🧪 Testing

```bash
# Run backend tests
cd server
npm test

# Run frontend tests
cd client
npm test

# Run integration tests
npm run test:integration

# Generate test coverage
npm run test:coverage
```

## 🚀 Deployment

### Docker Deployment

1. **Build Docker images**
   ```bash
   # Build and run with docker-compose
   docker-compose up -d
   ```

2. **Manual Docker build**
   ```bash
   # Backend
   cd server
   docker build -t inventory-genie-api .

   # Frontend
   cd client
   docker build -t inventory-genie-web .
   ```

### Production Deployment

1. **Prepare production build**
   ```bash
   # Client production build
   cd client
   npm run build

   # Server optimization
   cd server
   npm run build
   ```

2. **Environment setup**
   - Configure production environment variables
   - Set up MongoDB cluster
   - Configure reverse proxy (Nginx)
   - Set up SSL certificates

3. **Deploy using PM2**
   ```bash
   # Install PM2 globally
   npm install -g pm2

   # Start application
   pm2 start ecosystem.config.js
   ```

## 🔄 Development Workflow

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create pull request
git push origin feature/your-feature-name
```

### Code Style
- Use ESLint and Prettier for consistent code formatting
- Follow conventional commit messages
- Write tests for new features
- Update documentation for API changes

## 📈 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Service worker for offline functionality
- **Bundle Analysis**: Regular bundle size monitoring

### Backend Optimizations
- **Database Indexing**: Optimized MongoDB indexes
- **Caching**: Redis for session and data caching
- **Rate Limiting**: API protection and fair usage
- **Connection Pooling**: Efficient database connections

## 🛡️ Security Features

- **Input Validation**: Comprehensive data validation using Zod
- **CORS Protection**: Configured cross-origin resource sharing
- **Helmet.js**: Security headers and XSS protection
- **Rate Limiting**: Brute force attack prevention
- **JWT Security**: Secure token handling with refresh mechanism
- **Audit Logging**: Complete activity tracking for compliance

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Tailwind CSS** for the amazing utility-first CSS framework
- **Shadcn/ui** for the beautiful component library
- **Recharts** for interactive data visualizations
- **MongoDB** for the flexible NoSQL database
- **React Team** for the incredible frontend library

## 📞 Support

For support, email mizanur.r.ashiq@gmail.com.

---

**Built with ❤️ by the Inventory Genie Team**