import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ModernDashboard = ({ userRole = 'admin' }) => {
  const [inventoryData, setInventoryData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockInventoryData = [
      { name: 'Electronics', stock: 450, sold: 120, revenue: 15000 },
      { name: 'Clothing', stock: 320, sold: 89, revenue: 8900 },
      { name: 'Home & Garden', stock: 180, sold: 67, revenue: 6700 },
      { name: 'Sports', stock: 240, sold: 45, revenue: 4500 },
      { name: 'Books', stock: 890, sold: 234, revenue: 2340 },
    ];

    const mockSalesData = [
      { month: 'Jan', sales: 2400, orders: 240 },
      { month: 'Feb', sales: 1398, orders: 139 },
      { month: 'Mar', sales: 9800, orders: 980 },
      { month: 'Apr', sales: 3908, orders: 390 },
      { month: 'May', sales: 4800, orders: 480 },
      { month: 'Jun', sales: 3800, orders: 380 },
    ];

    const mockCategoryData = [
      { name: 'Electronics', value: 35, color: '#0088FE' },
      { name: 'Clothing', value: 25, color: '#00C49F' },
      { name: 'Home', value: 20, color: '#FFBB28' },
      { name: 'Sports', value: 15, color: '#FF8042' },
      { name: 'Others', value: 5, color: '#8884D8' },
    ];

    const mockRevenueData = [
      { day: 'Mon', revenue: 2400, profit: 1200 },
      { day: 'Tue', revenue: 1398, profit: 899 },
      { day: 'Wed', revenue: 9800, profit: 5800 },
      { day: 'Thu', revenue: 3908, profit: 2508 },
      { day: 'Fri', revenue: 4800, profit: 2800 },
      { day: 'Sat', revenue: 3800, profit: 2300 },
      { day: 'Sun', revenue: 4300, profit: 2500 },
    ];

    setTimeout(() => {
      setInventoryData(mockInventoryData);
      setSalesData(mockSalesData);
      setCategoryData(mockCategoryData);
      setRevenueData(mockRevenueData);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod]);

  const StatCard = ({ title, value, change, icon, trend = 'up' }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <p className={cn(
              "text-xs flex items-center gap-1",
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            )}>
              <span>{trend === 'up' ? '↗' : '↘'}</span>
              {change}% from last period
            </p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DashboardHeader = () => (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {userRole === 'admin' ? 'Admin Dashboard' : 
           userRole === 'manager' ? 'Manager Dashboard' : 'Owner Dashboard'}
        </h1>
        <p className="text-muted-foreground">
          Manage your inventory and track performance
        </p>
      </div>
      <div className="flex gap-2">
        {['7d', '30d', '90d', '1y'].map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
          >
            {period}
          </Button>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value="$45,231"
          change={12.5}
          trend="up"
          icon={<span className="text-2xl">💰</span>}
        />
        <StatCard
          title="Total Orders"
          value="1,234"
          change={8.2}
          trend="up"
          icon={<span className="text-2xl">📦</span>}
        />
        <StatCard
          title="Active Products"
          value="2,456"
          change={-2.1}
          trend="down"
          icon={<span className="text-2xl">📊</span>}
        />
        <StatCard
          title="Low Stock Items"
          value="23"
          change={15.3}
          trend="up"
          icon={<span className="text-2xl">⚠️</span>}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Profit Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="profit"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Inventory Status by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#8884d8" name="In Stock" />
                <Bar dataKey="sold" fill="#82ca9d" name="Sold" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: 'New order #1234', time: '2 minutes ago', type: 'order' },
              { action: 'Low stock alert: iPhone 15', time: '5 minutes ago', type: 'alert' },
              { action: 'Product added: MacBook Pro', time: '10 minutes ago', type: 'product' },
              { action: 'User login: john@example.com', time: '15 minutes ago', type: 'user' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    activity.type === 'order' && 'bg-green-500',
                    activity.type === 'alert' && 'bg-red-500',
                    activity.type === 'product' && 'bg-blue-500',
                    activity.type === 'user' && 'bg-yellow-500'
                  )} />
                  <span className="font-medium">{activity.action}</span>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernDashboard;