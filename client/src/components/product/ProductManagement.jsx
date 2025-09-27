import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: 'iPhone 15 Pro',
        description: 'Latest Apple smartphone with advanced features',
        category: 'Electronics',
        price: 999.99,
        costPrice: 750.00,
        stock: 45,
        minStock: 10,
        sku: 'IPH15P001',
        supplier: 'Apple Inc.',
        location: 'Warehouse A',
        status: 'active',
        createdAt: '2024-01-10T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z',
        image: '/api/placeholder/150/150'
      },
      {
        id: 2,
        name: 'Samsung Galaxy S24',
        description: 'Premium Android smartphone',
        category: 'Electronics',
        price: 899.99,
        costPrice: 650.00,
        stock: 3,
        minStock: 5,
        sku: 'SGS24001',
        supplier: 'Samsung',
        location: 'Warehouse B',
        status: 'active',
        createdAt: '2024-01-12T09:15:00Z',
        updatedAt: '2024-01-14T16:20:00Z',
        image: '/api/placeholder/150/150'
      },
      {
        id: 3,
        name: 'Nike Air Max',
        description: 'Comfortable running shoes',
        category: 'Sports',
        price: 129.99,
        costPrice: 80.00,
        stock: 0,
        minStock: 5,
        sku: 'NAM001',
        supplier: 'Nike',
        location: 'Warehouse A',
        status: 'inactive',
        createdAt: '2024-01-08T11:30:00Z',
        updatedAt: '2024-01-15T10:45:00Z',
        image: '/api/placeholder/150/150'
      }
    ];

    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and search products
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy, sortOrder]);

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const getStockStatus = (product) => {
    if (product.stock === 0) return { status: 'out', color: 'bg-red-100 text-red-800', text: 'Out of Stock' };
    if (product.stock <= product.minStock) return { status: 'low', color: 'bg-yellow-100 text-yellow-800', text: 'Low Stock' };
    return { status: 'good', color: 'bg-green-100 text-green-800', text: 'In Stock' };
  };

  const ProductCard = ({ product }) => {
    const stockStatus = getStockStatus(product);
    
    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedProduct(product)}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjQwIiB5PSI0MCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiByeD0iNCIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{product.sku}</p>
                  <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                </div>
                <span className={cn(
                  "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ml-2",
                  stockStatus.color
                )}>
                  {stockStatus.text}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm font-medium">${product.price}</p>
                    <p className="text-xs text-muted-foreground">Price</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{product.stock}</p>
                    <p className="text-xs text-muted-foreground">Stock</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{product.category}</p>
                    <p className="text-xs text-muted-foreground">Category</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ProductModal = ({ product, onClose }) => {
    const [formData, setFormData] = useState({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      costPrice: product.costPrice,
      stock: product.stock,
      minStock: product.minStock,
      sku: product.sku,
      supplier: product.supplier,
      location: product.location,
      status: product.status
    });

    const handleSave = () => {
      // API call to update product
      console.log('Updating product:', formData);
      onClose();
    };

    const profit = ((formData.price - formData.costPrice) / formData.costPrice * 100).toFixed(1);

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <CardTitle>Edit Product: {product.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    className="w-full p-2 border rounded-md h-20"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({...prev, sku: e.target.value}))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Selling Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({...prev, price: parseFloat(e.target.value)}))}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Cost Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.costPrice}
                      onChange={(e) => setFormData(prev => ({...prev, costPrice: parseFloat(e.target.value)}))}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">Profit Margin: <span className="font-medium text-green-600">{profit}%</span></p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Current Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData(prev => ({...prev, stock: parseInt(e.target.value)}))}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Minimum Stock</label>
                    <input
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => setFormData(prev => ({...prev, minStock: parseInt(e.target.value)}))}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Supplier</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData(prev => ({...prev, supplier: e.target.value}))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const lowStockCount = products.filter(p => p.stock <= p.minStock && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">Manage your inventory products</p>
        </div>
        <Button onClick={() => setShowAddProduct(true)}>
          Add New Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Total Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-yellow-600">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground">Low Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-red-600">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground">Out of Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products by name, SKU, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="p-2 border rounded-md"
              >
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
                <option value="price-asc">Price Low-High</option>
                <option value="price-desc">Price High-Low</option>
                <option value="stock-asc">Stock Low-High</option>
                <option value="stock-desc">Stock High-Low</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product List */}
      <div className="grid gap-4">
        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </CardContent>
          </Card>
        ) : (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* Modals */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductManagement;