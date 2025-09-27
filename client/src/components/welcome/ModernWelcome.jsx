import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';

const ModernWelcome = ({ userData }) => {
  const isAdmin = userData?.role === 'admin';
  const isManager = userData?.role === 'manager';
  const isOwner = userData?.role === 'owner';

  const features = [
    {
      title: 'Modern Dashboard',
      description: 'Interactive charts, real-time analytics, and comprehensive reporting with beautiful visualizations.',
      icon: '📊',
      href: '/modern-dashboard',
      available: isManager || isAdmin || isOwner,
      highlights: ['Real-time Data', 'Interactive Charts', 'Performance Metrics', 'Revenue Analytics']
    },
    {
      title: 'Product Management',
      description: 'Advanced product catalog with search, filtering, stock management, and profit tracking.',
      icon: '📦',
      href: '/product-management',
      available: isManager || isAdmin,
      highlights: ['Smart Search', 'Stock Alerts', 'Profit Analysis', 'Bulk Operations']
    },
    {
      title: 'Admin Panel',
      description: 'Complete user management with role-based permissions and access control.',
      icon: '👥',
      href: '/admin-panel',
      available: isAdmin,
      highlights: ['User Management', 'Role Assignment', 'Permission Control', 'Activity Monitoring']
    },
    {
      title: 'Legacy Management',
      description: 'Access to traditional inventory, customer, and vendor management tools.',
      icon: '📋',
      href: '/manage-inventory',
      available: isAdmin,
      highlights: ['Inventory Control', 'Customer Records', 'Vendor Management', 'Order Processing']
    }
  ];

  const availableFeatures = features.filter(feature => feature.available);

  const stats = [
    { label: 'Total Products', value: '2,456', change: '+12%', trend: 'up' },
    { label: 'Active Users', value: '89', change: '+8%', trend: 'up' },
    { label: 'Monthly Revenue', value: '$45,231', change: '+15%', trend: 'up' },
    { label: 'Orders Today', value: '34', change: '+5%', trend: 'up' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Welcome to Inventory Genie Enterprise
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Modern inventory management system with advanced analytics, role-based access, and enterprise-grade features.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>👋 Welcome back,</span>
            <span className="font-medium">{userData?.name}</span>
            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs uppercase font-medium">
              {userData?.role}
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <span>↗</span>
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableFeatures.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {feature.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
                <Link to={feature.href}>
                  <Button className="w-full" size="sm">
                    Access {feature.title}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">🚀 What's New in Enterprise Edition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-primary">🎨 Modern UI/UX</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Tailwind CSS design system</li>
                  <li>• Responsive layouts</li>
                  <li>• Dark mode support</li>
                  <li>• Accessibility features</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-primary">📊 Advanced Analytics</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Interactive charts with Recharts</li>
                  <li>• Real-time data updates</li>
                  <li>• Revenue & profit tracking</li>
                  <li>• Performance insights</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-primary">🔐 Enterprise Security</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Role-based access control</li>
                  <li>• JWT authentication</li>
                  <li>• Audit logging</li>
                  <li>• Multi-location support</li>
                </ul>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">React 18</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Node.js</span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">MongoDB</span>
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">Tailwind CSS</span>
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Recharts</span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Socket.io</span>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">JWT Auth</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>⚡ Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {isAdmin && (
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                  <Link to="/admin-panel">
                    <span className="text-2xl">👥</span>
                    <span className="text-sm">Manage Users</span>
                  </Link>
                </Button>
              )}
              {(isManager || isAdmin) && (
                <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                  <Link to="/product-management">
                    <span className="text-2xl">📦</span>
                    <span className="text-sm">Add Product</span>
                  </Link>
                </Button>
              )}
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                <Link to="/modern-dashboard">
                  <span className="text-2xl">📊</span>
                  <span className="text-sm">View Reports</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" asChild>
                <Link to="/profile">
                  <span className="text-2xl">⚙️</span>
                  <span className="text-sm">Settings</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernWelcome;