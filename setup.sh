#!/bin/bash

# 🚀 Inventory Genie Enterprise - Development Setup Script
echo "🚀 Inventory Genie Enterprise - Development Setup"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ and try again."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_status "Node.js version: $(node -v)"

# Check if MongoDB is accessible
print_info "Checking MongoDB connection..."
if command -v mongosh &> /dev/null; then
    print_status "MongoDB client found"
else
    print_warning "MongoDB client (mongosh) not found. Make sure MongoDB is accessible."
fi

# Install server dependencies
echo ""
print_info "Installing server dependencies..."
cd server
if npm install; then
    print_status "Server dependencies installed successfully"
else
    print_error "Failed to install server dependencies"
    exit 1
fi

# Install client dependencies
echo ""
print_info "Installing client dependencies..."
cd ../client
if npm install; then
    print_status "Client dependencies installed successfully"
else
    print_error "Failed to install client dependencies"
    exit 1
fi

# Go back to root directory
cd ..

# Check if .env files exist
echo ""
print_info "Checking environment configuration..."

if [ ! -f "server/.env" ]; then
    print_warning "Server .env file not found. Creating from template..."
    cp server/.env.example server/.env
    print_info "Please update server/.env with your MongoDB URI and other settings"
fi

if [ ! -f "client/.env" ]; then
    print_warning "Client .env file not found. Creating basic configuration..."
    echo "REACT_APP_API_URL=http://localhost:5000/api/v1" > client/.env
    echo "REACT_APP_BASE_URL=http://localhost:5000" >> client/.env
fi

print_status "Environment files checked"

# Seed database (optional)
echo ""
read -p "🌱 Do you want to seed the database with sample data? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Seeding database..."
    cd server
    if npm run seed; then
        print_status "Database seeded successfully"
        echo ""
        print_info "🔐 Default login credentials:"
        echo "   Admin: admin@inventory-genie.com / Admin@123"
        echo "   Manager: manager@inventory-genie.com / Manager@123"
        echo "   Employee: employee@inventory-genie.com / Employee@123"
    else
        print_warning "Database seeding failed. You can run 'npm run seed' later."
    fi
    cd ..
fi

# Create start script
echo ""
print_info "Creating development start script..."
cat > start-dev.sh << 'EOF'
#!/bin/bash

# Start both server and client in development mode
echo "🚀 Starting Inventory Genie Enterprise in development mode..."

# Function to handle cleanup
cleanup() {
    echo "Shutting down development servers..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set up trap to handle Ctrl+C
trap cleanup SIGINT

# Start server in background
echo "Starting server on port 5000..."
cd server && npm run dev &
SERVER_PID=$!

# Wait a moment for server to start
sleep 3

# Start client in background
echo "Starting client on port 3000..."
cd ../client && npm start &
CLIENT_PID=$!

# Wait for both processes
wait $SERVER_PID $CLIENT_PID
EOF

chmod +x start-dev.sh

# Create production build script
cat > build-prod.sh << 'EOF'
#!/bin/bash

echo "🏗️  Building Inventory Genie Enterprise for production..."

# Build client
echo "Building client..."
cd client
npm run build
cd ..

# The server doesn't need building for Node.js
echo "✅ Production build completed!"
echo "📁 Client build files are in: client/build/"
echo "🚀 Server files are ready in: server/"
EOF

chmod +x build-prod.sh

print_status "Development scripts created"

# Final setup complete message
echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
print_status "All dependencies installed"
print_status "Environment files configured"
print_status "Development scripts created"
echo ""
print_info "📚 Available commands:"
echo "   ./start-dev.sh     - Start development servers"
echo "   ./build-prod.sh    - Build for production"
echo ""
print_info "🌐 Application URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000/api/v1"
echo "   API Docs: http://localhost:5000/api/docs"
echo ""
print_info "📖 Next steps:"
echo "   1. Update server/.env with your MongoDB URI and settings"
echo "   2. Run './start-dev.sh' to start development servers"
echo "   3. Access the application at http://localhost:3000"
echo ""
print_status "Happy coding! 🚀"