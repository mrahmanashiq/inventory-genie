import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

const ModernNavbar = ({ userData, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/modern-dashboard',
      icon: '📊',
      roles: ['admin', 'manager', 'owner']
    },
    {
      name: 'Product Management',
      href: '/product-management',
      icon: '📦',
      roles: ['admin', 'manager']
    },
    {
      name: 'Admin Panel',
      href: '/admin-panel',
      icon: '👥',
      roles: ['admin']
    },
    {
      name: 'Inventory',
      href: '/manage-inventory',
      icon: '📋',
      roles: ['admin']
    },
    {
      name: 'Customers',
      href: '/manage-customer',
      icon: '👤',
      roles: ['admin']
    },
    {
      name: 'Vendors',
      href: '/manage-vendor',
      icon: '🏢',
      roles: ['admin']
    },
  ];

  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(userData?.role)
  );

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <Link
        to={item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          isActive 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
        )}
      >
        <span className="text-lg">{item.icon}</span>
        {item.name}
      </Link>
    );
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">IG</span>
            </div>
            <span className="font-bold text-lg">Inventory Genie</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {filteredItems.map((item) => (
              <NavItem key={item.href} item={item} />
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {userData?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="text-sm">
                <p className="font-medium">{userData?.name || 'User'}</p>
                <p className="text-muted-foreground capitalize">{userData?.role || 'user'}</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
            >
              Logout
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              ☰
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>
            
            {/* Mobile User Info */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {userData?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="text-sm">
                  <p className="font-medium">{userData?.name || 'User'}</p>
                  <p className="text-muted-foreground capitalize">{userData?.role || 'user'}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ModernNavbar;