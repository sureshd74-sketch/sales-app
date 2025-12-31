// ==============================
// LocalStorage Backend - No Firebase Required!
// ==============================
// This file provides localStorage-based data storage
// Later, you can easily switch to Firebase by using firebase-backend.js

// Storage Keys
const STORAGE_KEYS = {
  PRODUCTS: 'xeltrix_products',
  SALES: 'xeltrix_sales',
  VISITS: 'xeltrix_visits',
  SETTINGS: 'xeltrix_settings'
};

// Initialize LocalStorage Backend
const LocalStorageBackend = {
  // Products
  getProducts: function() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading products:', error);
      return [];
    }
  },

  saveProducts: function(products) {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      return true;
    } catch (error) {
      console.error('Error saving products:', error);
      return false;
    }
  },

  addProduct: function(product) {
    const products = this.getProducts();
    const newProduct = {
      id: 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      ...product,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct.id;
  },

  updateProduct: function(productId, updates) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === productId);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveProducts(products);
      return true;
    }
    return false;
  },

  deleteProduct: function(productId) {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== productId);
    this.saveProducts(filtered);
    return true;
  },

  // Sales
  getSales: function() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SALES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading sales:', error);
      return [];
    }
  },

  saveSales: function(sales) {
    try {
      localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
      return true;
    } catch (error) {
      console.error('Error saving sales:', error);
      return false;
    }
  },

  addSale: function(sale) {
    const sales = this.getSales();
    const newSale = {
      id: 'sale_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      ...sale,
      createdAt: new Date().toISOString()
    };
    sales.push(newSale);
    this.saveSales(sales);
    return newSale.id;
  },

  // Visits
  getVisits: function() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VISITS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading visits:', error);
      return [];
    }
  },

  saveVisits: function(visits) {
    try {
      localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));
      return true;
    } catch (error) {
      console.error('Error saving visits:', error);
      return false;
    }
  },

  addVisit: function(visit) {
    const visits = this.getVisits();
    const newVisit = {
      id: 'visit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      ...visit,
      createdAt: new Date().toISOString()
    };
    visits.push(newVisit);
    this.saveVisits(visits);
    return newVisit.id;
  },

  // Image Storage (Base64 - for local storage)
  saveImage: function(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
      // Store as base64 data URL
      const base64Image = e.target.result;
      callback(base64Image);
    };
    reader.onerror = function() {
      callback(null);
    };
    reader.readAsDataURL(file);
  },

  // Export data (for backup/migration)
  exportData: function() {
    return {
      products: this.getProducts(),
      sales: this.getSales(),
      visits: this.getVisits(),
      exportedAt: new Date().toISOString()
    };
  },

  // Import data (for migration)
  importData: function(data) {
    if (data.products) this.saveProducts(data.products);
    if (data.sales) this.saveSales(data.sales);
    if (data.visits) this.saveVisits(data.visits);
    return true;
  }
};

// Make it globally available
window.LocalStorageBackend = LocalStorageBackend;


