import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Import models
import { userModel as User } from '../models/user.model.js';
import { productModel as Product } from '../models/product.model.js';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data (optional - remove in production)
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create default admin user
    console.log('Creating default admin user...');
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@inventory-genie.com',
      password: hashedPassword,
      role: 'admin',
      permissions: [
        {
          module: 'users',
          actions: ['create', 'read', 'update', 'delete']
        },
        {
          module: 'products',
          actions: ['create', 'read', 'update', 'delete']
        },
        {
          module: 'inventory',
          actions: ['create', 'read', 'update', 'delete']
        },
        {
          module: 'reports',
          actions: ['read', 'export']
        }
      ],
      status: 'active',
      profile: {
        avatar: '',
        phone: '+1-555-0123',
        address: '123 Admin Street, Admin City, Admin State, 12345, USA'
      }
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');

    // Create sample manager user
    console.log('Creating sample manager user...');
    const managerPassword = await bcrypt.hash('Manager@123', 12);
    
    const managerUser = new User({
      name: 'John Manager',
      email: 'manager@inventory-genie.com',
      password: managerPassword,
      role: 'manager',
      permissions: [
        {
          module: 'products',
          actions: ['create', 'read', 'update', 'delete']
        },
        {
          module: 'inventory',
          actions: ['read', 'update']
        },
        {
          module: 'reports',
          actions: ['read']
        }
      ],
      status: 'active',
      profile: {
        avatar: '',
        phone: '+1-555-0124',
        address: '456 Manager Avenue, Manager City, Manager State, 12346, USA'
      }
    });

    await managerUser.save();
    console.log('✅ Manager user created successfully');

    // Create sample employee user
    console.log('Creating sample employee user...');
    const employeePassword = await bcrypt.hash('Employee@123', 12);
    
    const employeeUser = new User({
      name: 'Jane Employee',
      email: 'employee@inventory-genie.com',
      password: employeePassword,
      role: 'inventory_staff',
      permissions: [
        {
          module: 'products',
          actions: ['read', 'update']
        },
        {
          module: 'inventory',
          actions: ['read', 'update']
        }
      ],
      status: 'active',
      profile: {
        avatar: '',
        phone: '+1-555-0125',
        address: '789 Employee Lane, Employee City, Employee State, 12347, USA'
      }
    });

    await employeeUser.save();
    console.log('✅ Employee user created successfully');

    // Create sample products
    console.log('Creating sample products...');
    
    const sampleProducts = [
      {
        sku: 'IPH15P001',
        barcode: '123456789012',
        name: 'iPhone 15 Pro',
        description: 'Latest Apple smartphone with advanced features and A17 Pro chip',
        category: {
          main: 'Electronics',
          sub: 'Smartphones',
          tags: ['apple', 'premium', 'new']
        },
        brand: 'Apple',
        pricing: {
          cost: 750.00,
          price: 999.99,
          margin: 249.99
        },
        inventory: {
          quantity: 45,
          reserved: 0,
          available: 45,
          reorderLevel: 10,
          maxLevel: 100
        },
        location: {
          warehouse: 'main-warehouse',
          zone: 'A1-01'
        },
        status: 'active',
        createdBy: adminUser._id
      },
      {
        sku: 'SGS24U001',
        barcode: '123456789013',
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone with S Pen and advanced camera',
        category: {
          main: 'Electronics',
          sub: 'Smartphones',
          tags: ['samsung', 'premium', 'android']
        },
        brand: 'Samsung',
        pricing: {
          cost: 900.00,
          price: 1199.99,
          margin: 299.99
        },
        inventory: {
          quantity: 3,
          reserved: 0,
          available: 3,
          reorderLevel: 5,
          maxLevel: 50
        },
        location: {
          warehouse: 'main-warehouse',
          zone: 'A1-02'
        },
        status: 'active',
        createdBy: adminUser._id
      },
      {
        sku: 'MBP16001',
        barcode: '123456789014',
        name: 'MacBook Pro 16-inch',
        description: 'Powerful laptop for professionals with M3 Pro chip',
        category: {
          main: 'Electronics',
          sub: 'Laptops',
          tags: ['apple', 'professional', 'powerful']
        },
        brand: 'Apple',
        pricing: {
          cost: 1900.00,
          price: 2499.99,
          margin: 599.99
        },
        inventory: {
          quantity: 12,
          reserved: 0,
          available: 12,
          reorderLevel: 5,
          maxLevel: 30
        },
        location: {
          warehouse: 'main-warehouse',
          zone: 'B2-01'
        },
        status: 'active',
        createdBy: managerUser._id
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log('✅ Sample products created successfully');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- 3 users created (admin, manager, employee)');
    console.log('- 5 sample products created');
    console.log('\n🔐 Login Credentials:');
    console.log('Admin: admin@inventory-genie.com / Admin@123');
    console.log('Manager: manager@inventory-genie.com / Manager@123');
    console.log('Employee: employee@inventory-genie.com / Employee@123');
    console.log('\n🌐 Access the application at: http://localhost:3000');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
seedDatabase();