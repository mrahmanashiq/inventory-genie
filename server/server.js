import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Import routes
import authRoutes from './src/routes/auth.routes.js';
import inventoryRoutes from './src/routes/inventory.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';

// Import middleware
import { 
  securityHeaders, 
  requestLogger, 
  errorHandler 
} from './src/middleware/auth.middleware.js';

// Load environment variables
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Create Express app
const app = express();
const server = createServer(app);

// Socket.io setup for real-time features
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Inventory Management System API',
      version: '2.0.0',
      description: 'Enterprise Inventory Management System - RESTful API Documentation',
      contact: {
        name: 'API Support',
        email: 'support@inventorygenie.com'
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Security headers
app.use(securityHeaders);

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.CLIENT_URL || 'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173', // Vite dev server
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Custom request logging
app.use(requestLogger);

// API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Inventory Management API',
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
const API_VERSION = '/api/v1';
app.use(`${API_VERSION}/auth`, authRoutes);
app.use(`${API_VERSION}/inventory`, inventoryRoutes);
app.use(`${API_VERSION}/upload`, uploadRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join user to their personal room for notifications
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their notification room`);
  });

  // Handle real-time inventory updates
  socket.on('inventory_update', (data) => {
    // Broadcast to all connected clients in the same location
    socket.to(`location_${data.locationId}`).emit('inventory_changed', data);
  });

  // Handle low stock alerts
  socket.on('low_stock_alert', (data) => {
    // Notify admin and manager users
    io.to('admin_users').emit('alert', {
      type: 'low_stock',
      message: `${data.productName} is running low in stock`,
      data: data
    });
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// 404 handler for undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

// Database connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/inventory_genie');

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up database indexes for better performance
    await setupDatabaseIndexes();
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Setup database indexes
const setupDatabaseIndexes = async () => {
  try {
    // Add any additional indexes here if needed
    console.log('Database indexes set up successfully');
  } catch (error) {
    console.error('Error setting up database indexes:', error);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    mongoose.connection.close();
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    
    server.listen(PORT, () => {
      console.log(`
🚀 Server is running!
📝 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Port: ${PORT}
📚 API Docs: http://localhost:${PORT}/api/docs
💾 Database: Connected to MongoDB
⏰ Started at: ${new Date().toISOString()}
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Export for testing
export { app, io };
