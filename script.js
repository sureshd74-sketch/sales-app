// ==============================
// XELTRIX Sales App - Main Script
// ==============================

// Global State
let currentUser = null;
let isAdmin = false;
let currentLang = localStorage.getItem('appLanguage') || 'en';
let products = [];
let currentProductId = null;
let salesData = [];
let visitsData = [];
let qrStream = null;
let qrScanning = false;

// Backend Detection Helper Functions
function isFirebaseAvailable() {
  return typeof db !== 'undefined' && db && typeof firebase !== 'undefined';
}

function isLocalStorageAvailable() {
  return typeof LocalStorageBackend !== 'undefined';
}

// Admin Password (simple approach - can be changed)
const ADMIN_PASSWORD = 'Anitha123';

// Language Dictionary
const LANG = {
  en: {
    // Login
    loginTitle: 'Select Salesperson',
    salespersonLabel: 'Select Salesperson',
    selectYourName: 'Select your name',
    continue: 'Continue',
    adminPassword: 'Admin Password',
    enterPassword: 'Enter admin password',
    
    // Home
    welcomeTitle: 'Welcome',
    welcome: 'Welcome',
    
    // Navigation
    productCatalog: 'Product Catalog',
    addSale: 'Add Sale',
    addVisit: 'Add Visit',
    adminDashboard: 'Admin Dashboard',
    logout: 'Logout',
    back: 'Back',
    
    // Product Catalog
    catalogTitle: 'Product Catalog',
    addProduct: 'Add Product',
    editProduct: 'Edit Product',
    productNameEn: 'Product Name (English)',
    productNameTa: 'Product Name (Tamil)',
    unit: 'Unit',
    price: 'Price (₹)',
    productImage: 'Product Image',
    removeImage: 'Remove Image',
    active: 'Active',
    inactive: 'Inactive',
    saveProduct: 'Save Product',
    cancel: 'Cancel',
    searchProducts: 'Search products...',
    noProducts: 'No products found',
    edit: 'Edit',
    delete: 'Delete',
    uploadingImage: 'Uploading image...',
    imageUploaded: 'Image uploaded successfully!',
    
    // Sales
    saleTitle: 'Add Sale',
    date: 'Date',
    customerName: 'Customer Name',
    product: 'Product',
    selectProduct: 'Select product',
    quantity: 'Quantity',
    pricePerUnit: 'Price per Unit (₹)',
    total: 'Total (₹)',
    paymentMode: 'Payment Mode',
    remarks: 'Remarks',
    saveSale: 'Save Sale',
    cash: 'Cash',
    credit: 'Credit',
    upi: 'UPI',
    
    // Visits
    visitTitle: 'Add Visit',
    customerShopName: 'Customer/Shop Name',
    location: 'Location',
    purposeOfVisit: 'Purpose of Visit',
    notes: 'Notes',
    saveVisit: 'Save Visit',
    
    // Admin
    adminTitle: 'Admin Dashboard',
    sales: 'Sales',
    visits: 'Visits',
    reports: 'Reports',
    fromDate: 'From Date',
    toDate: 'To Date',
    salesperson: 'Salesperson',
    all: 'All',
    applyFilters: 'Apply Filters',
    exportToExcel: 'Export to Excel',
    exportToPDF: 'Export to PDF',
    noData: 'No data found',
    
    // Bulk Upload
    bulkUploadTitle: 'Bulk Upload Products',
    downloadTemplate: 'Download Template',
    selectFile: 'Select CSV/Excel File',
    uploadImport: 'Upload & Import',
    uploadSuccess: 'Products uploaded successfully!',
    uploadError: 'Error uploading products',
    
    // Reports
    reportsTitle: 'Reports',
    daily: 'Daily',
    monthly: 'Monthly',
    custom: 'Custom',
    totalSales: 'Total Sales',
    totalOrders: 'Total Orders',
    cash: 'Cash',
    credit: 'Credit',
    avgDailySales: 'Avg Daily Sales',
    topSalesperson: 'Top Salesperson',
    refresh: 'Refresh',
    downloadReport: 'Download Report',
    generateReport: 'Generate Report',
    selectMonth: 'Select Month',
    
    // QR Code
    scanQR: 'Scan QR Code',
    stopScanning: 'Stop Scanning',
    qrNotSupported: 'QR scanning not supported on this device',
    qrProductFound: 'Product found!',
    qrProductNotFound: 'Product not found in catalog',
    
    // Messages
    saleSaved: 'Sale saved successfully!',
    visitSaved: 'Visit saved successfully!',
    productSaved: 'Product saved successfully!',
    productDeleted: 'Product deleted successfully!',
    error: 'An error occurred',
    fillAllFields: 'Please fill all required fields',
    invalidPassword: 'Invalid admin password',
    
    // Language
    langToggle: 'EN / TA'
  },
  ta: {
    // Login
    loginTitle: 'விற்பனையாளர் தேர்வு',
    salespersonLabel: 'விற்பனையாளர் தேர்வு',
    selectYourName: 'உங்கள் பெயரை தேர்வு செய்யவும்',
    continue: 'தொடர்',
    adminPassword: 'நிர்வாக கடவுச்சொல்',
    enterPassword: 'நிர்வாக கடவுச்சொல்லை உள்ளிடவும்',
    
    // Home
    welcomeTitle: 'வரவேற்கிறோம்',
    welcome: 'வரவேற்கிறோம்',
    
    // Navigation
    productCatalog: 'பொருள் பட்டியல்',
    addSale: 'விற்பனை சேர்க்கவும்',
    addVisit: 'வருகை சேர்க்கவும்',
    adminDashboard: 'நிர்வாக கட்டுப்பாட்டு பலகை',
    logout: 'வெளியேறு',
    back: 'பின்',
    
    // Product Catalog
    catalogTitle: 'பொருள் பட்டியல்',
    addProduct: 'பொருள் சேர்க்கவும்',
    editProduct: 'பொருள் திருத்தவும்',
    productNameEn: 'பொருள் பெயர் (ஆங்கிலம்)',
    productNameTa: 'பொருள் பெயர் (தமிழ்)',
    unit: 'அலகு',
    price: 'விலை (₹)',
    productImage: 'பொருள் படம்',
    removeImage: 'படத்தை நீக்கு',
    active: 'செயலில்',
    inactive: 'செயலற்ற',
    saveProduct: 'பொருளை சேமிக்கவும்',
    cancel: 'ரத்துசெய்',
    searchProducts: 'பொருட்களை தேடவும்...',
    noProducts: 'பொருட்கள் கிடைக்கவில்லை',
    edit: 'திருத்து',
    delete: 'நீக்கு',
    uploadingImage: 'படம் பதிவேற்றப்படுகிறது...',
    imageUploaded: 'படம் வெற்றிகரமாக பதிவேற்றப்பட்டது!',
    
    // Sales
    saleTitle: 'விற்பனை சேர்க்கவும்',
    date: 'தேதி',
    customerName: 'வாடிக்கையாளர் பெயர்',
    product: 'பொருள்',
    selectProduct: 'பொருளை தேர்வு செய்யவும்',
    quantity: 'அளவு',
    pricePerUnit: 'அலகுக்கு விலை (₹)',
    total: 'மொத்தம் (₹)',
    paymentMode: 'கட்டண முறை',
    remarks: 'குறிப்புகள்',
    saveSale: 'விற்பனையை சேமிக்கவும்',
    cash: 'பணம்',
    credit: 'கடன்',
    upi: 'UPI',
    
    // Visits
    visitTitle: 'வருகை சேர்க்கவும்',
    customerShopName: 'வாடிக்கையாளர்/கடை பெயர்',
    location: 'இடம்',
    purposeOfVisit: 'வருகையின் நோக்கம்',
    notes: 'குறிப்புகள்',
    saveVisit: 'வருகையை சேமிக்கவும்',
    
    // Admin
    adminTitle: 'நிர்வாக கட்டுப்பாட்டு பலகை',
    sales: 'விற்பனைகள்',
    visits: 'வருகைகள்',
    reports: 'அறிக்கைகள்',
    fromDate: 'தொடக்க தேதி',
    toDate: 'இறுதி தேதி',
    salesperson: 'விற்பனையாளர்',
    all: 'அனைத்தும்',
    applyFilters: 'வடிகட்டல்களை பயன்படுத்தவும்',
    exportToExcel: 'எக்செல் க்கு ஏற்றுமதி',
    exportToPDF: 'PDF க்கு ஏற்றுமதி',
    noData: 'தரவு கிடைக்கவில்லை',
    
    // Bulk Upload
    bulkUploadTitle: 'மொத்த பதிவேற்றம்',
    downloadTemplate: 'டெம்ப்ளேட் பதிவிறக்க',
    selectFile: 'CSV/Excel கோப்பை தேர்ந்தெடுக்கவும்',
    uploadImport: 'பதிவேற்றம் மற்றும் இறக்குமதி',
    uploadSuccess: 'பொருட்கள் வெற்றிகரமாக பதிவேற்றப்பட்டன!',
    uploadError: 'பொருட்களை பதிவேற்றுவதில் பிழை',
    
    // Reports
    reportsTitle: 'அறிக்கைகள்',
    daily: 'தினசரி',
    monthly: 'மாதாந்திர',
    custom: 'தனிப்பயன்',
    totalSales: 'மொத்த விற்பனை',
    totalOrders: 'மொத்த ஆர்டர்கள்',
    cash: 'பணம்',
    credit: 'கடன்',
    avgDailySales: 'சராசரி தினசரி விற்பனை',
    topSalesperson: 'சிறந்த விற்பனையாளர்',
    refresh: 'புதுப்பிக்க',
    downloadReport: 'அறிக்கையை பதிவிறக்க',
    generateReport: 'அறிக்கையை உருவாக்க',
    selectMonth: 'மாதத்தை தேர்ந்தெடுக்கவும்',
    
    // QR Code
    scanQR: 'QR குறியீட்டை ஸ்கேன் செய்யவும்',
    stopScanning: 'ஸ்கேனிங் நிறுத்த',
    qrNotSupported: 'இந்த சாதனத்தில் QR ஸ்கேனிங் ஆதரிக்கப்படவில்லை',
    qrProductFound: 'பொருள் கண்டுபிடிக்கப்பட்டது!',
    qrProductNotFound: 'பட்டியலில் பொருள் கிடைக்கவில்லை',
    
    // Messages
    saleSaved: 'விற்பனை வெற்றிகரமாக சேமிக்கப்பட்டது!',
    visitSaved: 'வருகை வெற்றிகரமாக சேமிக்கப்பட்டது!',
    productSaved: 'பொருள் வெற்றிகரமாக சேமிக்கப்பட்டது!',
    productDeleted: 'பொருள் வெற்றிகரமாக நீக்கப்பட்டது!',
    error: 'ஒரு பிழை ஏற்பட்டது',
    fillAllFields: 'தயவுசெய்து அனைத்து தேவையான புலங்களையும் நிரப்பவும்',
    invalidPassword: 'தவறான நிர்வாக கடவுச்சொல்',
    
    // Language
    langToggle: 'TA / EN'
  }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Check backend availability
  if (!isFirebaseAvailable() && !isLocalStorageAvailable()) {
    console.error('No backend available!');
    showToast('Error: Backend not loaded. Please check script includes.');
    return;
  }
  
  // Log which backend is being used
  if (isFirebaseAvailable()) {
    console.log('✅ Using Firebase backend');
  } else {
    console.log('✅ Using LocalStorage backend');
  }
  
  setupEventListeners();
  loadProducts();
  setTodayDate();
  applyLanguage();
  
  // Check if user is already logged in
  const savedUser = localStorage.getItem('currentUser');
  const savedAdmin = localStorage.getItem('isAdmin') === 'true';
  if (savedUser) {
    currentUser = savedUser;
    isAdmin = savedAdmin;
    showScreen('homeScreen');
    updateWelcomeMessage();
  }
}

function setupEventListeners() {
  // Language Toggle
  document.getElementById('langBtn').addEventListener('click', toggleLanguage);
  
  // Login Form
  document.getElementById('salespersonForm').addEventListener('submit', handleLogin);
  document.getElementById('salespersonSelect').addEventListener('change', handleSalespersonChange);
  
  // Home Navigation
  document.getElementById('catalogBtn').addEventListener('click', () => showScreen('catalogScreen'));
  document.getElementById('saleBtn').addEventListener('click', () => {
    loadProductsForSale();
    showScreen('saleScreen');
  });
  document.getElementById('visitBtn').addEventListener('click', () => showScreen('visitScreen'));
  document.getElementById('adminBtn').addEventListener('click', () => {
    loadAdminData();
    showScreen('adminScreen');
  });
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);
  
  // Product Catalog
  document.getElementById('catalogBackBtn').addEventListener('click', () => showScreen('homeScreen'));
  document.getElementById('addProductBtn').addEventListener('click', () => {
    currentProductId = null;
    resetProductForm();
    showScreen('productFormScreen');
  });
  document.getElementById('bulkUploadBtn').addEventListener('click', () => showScreen('bulkUploadScreen'));
  document.getElementById('exportCatalogBtn').addEventListener('click', exportCatalog);
  document.getElementById('productFormBackBtn').addEventListener('click', () => showScreen('catalogScreen'));
  document.getElementById('productForm').addEventListener('submit', handleSaveProduct);
  document.getElementById('cancelProductBtn').addEventListener('click', () => showScreen('catalogScreen'));
  document.getElementById('productSearch').addEventListener('input', filterProducts);
  
  // Product Image
  document.getElementById('productImage').addEventListener('change', handleImagePreview);
  document.getElementById('removeImageBtn').addEventListener('click', removeImagePreview);
  
  // Bulk Upload
  document.getElementById('bulkUploadBackBtn').addEventListener('click', () => showScreen('catalogScreen'));
  document.getElementById('downloadTemplateBtn').addEventListener('click', downloadTemplate);
  document.getElementById('bulkUploadForm').addEventListener('submit', handleBulkUpload);
  
  // QR Code
  document.getElementById('scanProductQRBtn').addEventListener('click', startQRScan);
  document.getElementById('stopQRScanBtn').addEventListener('click', stopQRScan);
  
  // Reports
  document.getElementById('reportsBackBtn').addEventListener('click', () => showScreen('adminScreen'));
  document.getElementById('viewReportsBtn').addEventListener('click', () => {
    loadReportsData();
    showScreen('reportsScreen');
  });
  document.querySelectorAll('[data-report]').forEach(btn => {
    btn.addEventListener('click', (e) => switchReportTab(e.target.dataset.report));
  });
  document.getElementById('refreshDailyBtn').addEventListener('click', () => loadDailyReport());
  document.getElementById('refreshMonthlyBtn').addEventListener('click', () => loadMonthlyReport());
  document.getElementById('monthSelect').addEventListener('change', () => loadMonthlyReport());
  document.getElementById('generateCustomBtn').addEventListener('click', generateCustomReport);
  document.getElementById('downloadDailyBtn').addEventListener('click', () => downloadReport('daily'));
  document.getElementById('downloadMonthlyBtn').addEventListener('click', () => downloadReport('monthly'));
  
  // Sales Form
  document.getElementById('saleBackBtn').addEventListener('click', () => showScreen('homeScreen'));
  document.getElementById('saleForm').addEventListener('submit', handleSaveSale);
  document.getElementById('saleProduct').addEventListener('change', updateSalePrice);
  document.getElementById('saleQuantity').addEventListener('input', calculateSaleTotal);
  document.getElementById('salePrice').addEventListener('input', calculateSaleTotal);
  
  // Visit Form
  document.getElementById('visitBackBtn').addEventListener('click', () => showScreen('homeScreen'));
  document.getElementById('visitForm').addEventListener('submit', handleSaveVisit);
  
  // Admin Dashboard
  document.getElementById('adminBackBtn').addEventListener('click', () => showScreen('homeScreen'));
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (e.target.dataset.tab) {
        switchAdminTab(e.target.dataset.tab);
      }
    });
  });
  document.getElementById('applyFiltersBtn').addEventListener('click', applyAdminFilters);
  document.getElementById('exportBtn').addEventListener('click', exportToExcel);
  document.getElementById('exportPDFBtn').addEventListener('click', exportToPDF);
}

// Language Functions
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'ta' : 'en';
  localStorage.setItem('appLanguage', currentLang);
  applyLanguage();
}

function applyLanguage() {
  const l = LANG[currentLang];
  const elements = document.querySelectorAll('[id]');
  
  // Update all translatable elements
  Object.keys(l).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      if (element.tagName === 'INPUT' && element.type !== 'submit' && element.type !== 'button') {
        element.placeholder = l[key];
      } else if (element.tagName === 'LABEL' || element.tagName === 'H2' || element.tagName === 'P' || element.tagName === 'SPAN') {
        element.textContent = l[key];
      } else if (element.tagName === 'BUTTON' || element.tagName === 'OPTION') {
        element.textContent = l[key];
      }
    }
  });
  
  // Special cases
  document.getElementById('langBtn').textContent = l.langToggle;
  document.getElementById('selectPlaceholder').textContent = l.selectYourName;
  document.getElementById('saleProduct').querySelector('option[value=""]').textContent = l.selectProduct;
  
  // Update product list if visible
  if (document.getElementById('catalogScreen').classList.contains('active')) {
    renderProducts();
  }
}

// Screen Navigation
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

// Login Functions
function handleSalespersonChange(e) {
  const value = e.target.value;
  const passwordContainer = document.getElementById('adminPasswordContainer');
  if (value === 'admin') {
    passwordContainer.style.display = 'block';
  } else {
    passwordContainer.style.display = 'none';
  }
}

function handleLogin(e) {
  e.preventDefault();
  const select = document.getElementById('salespersonSelect');
  const selectedValue = select.value;
  const passwordInput = document.getElementById('adminPassword');
  
  if (selectedValue === 'admin') {
    if (passwordInput.value === ADMIN_PASSWORD) {
      currentUser = 'admin';
      isAdmin = true;
      localStorage.setItem('currentUser', 'admin');
      localStorage.setItem('isAdmin', 'true');
      showScreen('homeScreen');
      updateWelcomeMessage();
      passwordInput.value = '';
    } else {
      showToast(LANG[currentLang].invalidPassword);
      return;
    }
  } else if (selectedValue) {
    currentUser = selectedValue;
    isAdmin = false;
    localStorage.setItem('currentUser', selectedValue);
    localStorage.setItem('isAdmin', 'false');
    showScreen('homeScreen');
    updateWelcomeMessage();
  }
  
  select.value = '';
}

function handleLogout() {
  currentUser = null;
  isAdmin = false;
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isAdmin');
  showScreen('loginScreen');
  document.getElementById('salespersonForm').reset();
  document.getElementById('adminPasswordContainer').style.display = 'none';
}

function updateWelcomeMessage() {
  const welcomeText = document.getElementById('welcomeText');
  const adminBtn = document.getElementById('adminBtn');
  
  if (isAdmin) {
    welcomeText.textContent = LANG[currentLang].welcome + ' Admin';
    adminBtn.style.display = 'block';
  } else {
    const nameMap = {
      'maruthu': 'Maruthu',
      'nagaraj': 'Nagaraj',
      'vetri': 'Vetri'
    };
    welcomeText.textContent = LANG[currentLang].welcome + ', ' + (nameMap[currentUser] || currentUser);
    adminBtn.style.display = 'none';
  }
}

// Product Functions
function loadProducts() {
  if (isFirebaseAvailable()) {
    // Firebase backend
    db.collection('products')
      .orderBy('nameEn')
      .onSnapshot((snapshot) => {
        products = [];
        snapshot.forEach(doc => {
          products.push({ id: doc.id, ...doc.data() });
        });
        if (document.getElementById('catalogScreen').classList.contains('active')) {
          renderProducts();
        }
      }, (error) => {
        console.error('Error loading products:', error);
      });
  } else {
    // LocalStorage backend
    products = LocalStorageBackend.getProducts().sort((a, b) => 
      (a.nameEn || '').localeCompare(b.nameEn || '')
    );
    if (document.getElementById('catalogScreen').classList.contains('active')) {
      renderProducts();
    }
  }
}

function renderProducts() {
  const container = document.getElementById('productList');
  const adminControls = document.getElementById('adminCatalogControls');
  const searchTerm = document.getElementById('productSearch').value.toLowerCase();
  
  // Show/hide admin controls
  if (adminControls) {
    adminControls.style.display = isAdmin ? 'block' : 'none';
  }
  
  let filteredProducts = products;
  if (searchTerm) {
    filteredProducts = products.filter(p => 
      p.nameEn?.toLowerCase().includes(searchTerm) ||
      p.nameTa?.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filteredProducts.length === 0) {
    container.innerHTML = `<p class="no-data">${LANG[currentLang].noProducts}</p>`;
    return;
  }
  
  container.innerHTML = filteredProducts.map(product => `
    <div class="product-item ${!product.active ? 'inactive' : ''}">
      ${product.imageUrl ? `
        <div class="product-image-container">
          <img src="${product.imageUrl}" alt="${product.nameEn || ''}" class="product-image" onerror="this.style.display='none'">
        </div>
      ` : '<div class="product-image-container"><div class="product-image-placeholder">📦</div></div>'}
      <div class="product-info">
        <h3>${product.nameEn || ''}</h3>
        <p class="product-tamil">${product.nameTa || ''}</p>
        <p class="product-details">${product.unit || ''} - ₹${product.price || 0}</p>
        ${!product.active ? `<span class="badge">${LANG[currentLang].inactive}</span>` : ''}
      </div>
      ${isAdmin ? `
        <div class="product-actions">
          <button class="icon-btn small" onclick="editProduct('${product.id}')">${LANG[currentLang].edit}</button>
          <button class="icon-btn small danger" onclick="deleteProduct('${product.id}')">${LANG[currentLang].delete}</button>
        </div>
      ` : ''}
    </div>
  `).join('');
}

function filterProducts() {
  renderProducts();
}

function loadProductsForSale() {
  const select = document.getElementById('saleProduct');
  const activeProducts = products.filter(p => p.active);
  
  select.innerHTML = `<option value="" disabled selected>${LANG[currentLang].selectProduct}</option>` +
    activeProducts.map(p => 
      `<option value="${p.id}" data-price="${p.price}">${p.nameEn} (${p.unit})</option>`
    ).join('');
}

function editProduct(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  currentProductId = productId;
  document.getElementById('productNameEn').value = product.nameEn || '';
  document.getElementById('productNameTa').value = product.nameTa || '';
  document.getElementById('productUnit').value = product.unit || 'Litre';
  document.getElementById('productPrice').value = product.price || 0;
  document.getElementById('productActive').checked = product.active !== false;
  
  // Show existing image if available
  if (product.imageUrl) {
    const previewContainer = document.getElementById('productImagePreview');
    const previewImg = document.getElementById('productImagePreviewImg');
    previewImg.src = product.imageUrl;
    previewContainer.style.display = 'block';
    previewContainer.dataset.existingImage = product.imageUrl;
  } else {
    document.getElementById('productImagePreview').style.display = 'none';
  }
  
  document.getElementById('productFormTitle').textContent = LANG[currentLang].editProduct;
  showScreen('productFormScreen');
}

function deleteProduct(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  if (isFirebaseAvailable()) {
    db.collection('products').doc(productId).delete()
      .then(() => {
        showToast(LANG[currentLang].productDeleted);
      })
      .catch(error => {
        console.error('Error deleting product:', error);
        showToast(LANG[currentLang].error);
      });
  } else {
    LocalStorageBackend.deleteProduct(productId);
    showToast(LANG[currentLang].productDeleted);
    loadProducts(); // Refresh list
  }
}

function resetProductForm() {
  document.getElementById('productForm').reset();
  document.getElementById('productActive').checked = true;
  document.getElementById('productImagePreview').style.display = 'none';
  document.getElementById('productImagePreview').dataset.existingImage = '';
  document.getElementById('productFormTitle').textContent = LANG[currentLang].addProduct;
}

// Image Preview Functions
function handleImagePreview(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // Validate file size (max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    showToast('Image size must be less than 2MB');
    e.target.value = '';
    return;
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    showToast('Please select an image file');
    e.target.value = '';
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const previewContainer = document.getElementById('productImagePreview');
    const previewImg = document.getElementById('productImagePreviewImg');
    previewImg.src = event.target.result;
    previewContainer.style.display = 'block';
    previewContainer.dataset.existingImage = ''; // Clear existing image flag
  };
  reader.readAsDataURL(file);
}

function removeImagePreview() {
  document.getElementById('productImage').value = '';
  document.getElementById('productImagePreview').style.display = 'none';
  document.getElementById('productImagePreview').dataset.existingImage = '';
}

function handleSaveProduct(e) {
  e.preventDefault();
  
  const imageFile = document.getElementById('productImage').files[0];
  const previewContainer = document.getElementById('productImagePreview');
  const existingImageUrl = previewContainer.dataset.existingImage;
  
  if (isFirebaseAvailable()) {
    // Firebase: upload image first
    if (!imageFile && !existingImageUrl) {
      saveProductData(null);
      return;
    }
    if (imageFile) {
      uploadProductImage(imageFile, (imageUrl) => {
        saveProductData(imageUrl);
      });
    } else {
      saveProductData(existingImageUrl);
    }
  } else {
    // LocalStorage: save image as base64
    if (imageFile) {
      LocalStorageBackend.saveImage(imageFile, (imageUrl) => {
        saveProductData(imageUrl);
      });
    } else {
      saveProductData(existingImageUrl);
    }
  }
}

function uploadProductImage(file, callback) {
  if (!storage) {
    showToast('Storage not initialized. Please check Firebase setup.');
    return;
  }
  
  showToast(LANG[currentLang].uploadingImage);
  
  // Create unique filename
  const timestamp = Date.now();
  const filename = `products/${timestamp}_${file.name}`;
  const storageRef = storage.ref().child(filename);
  
  // Upload file
  const uploadTask = storageRef.put(file);
  
  uploadTask.on('state_changed',
    (snapshot) => {
      // Progress tracking (optional)
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload progress:', progress + '%');
    },
    (error) => {
      console.error('Error uploading image:', error);
      showToast('Error uploading image. Product saved without image.');
      callback(null);
    },
    () => {
      // Upload complete, get download URL
      uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
        showToast(LANG[currentLang].imageUploaded);
        callback(downloadURL);
      });
    }
  );
}

function saveProductData(imageUrl) {
  const productData = {
    nameEn: document.getElementById('productNameEn').value.trim(),
    nameTa: document.getElementById('productNameTa').value.trim(),
    unit: document.getElementById('productUnit').value,
    price: parseFloat(document.getElementById('productPrice').value),
    active: document.getElementById('productActive').checked
  };
  
  // Add image URL if available
  if (imageUrl) {
    productData.imageUrl = imageUrl;
  } else if (currentProductId && isFirebaseAvailable()) {
    // Firebase: remove image if explicitly removed
    const previewContainer = document.getElementById('productImagePreview');
    if (!previewContainer.dataset.existingImage && !document.getElementById('productImage').files[0]) {
      productData.imageUrl = firebase.firestore.FieldValue.delete();
    }
  }
  
  if (isFirebaseAvailable()) {
    // Firebase backend
    if (currentProductId) {
      productData.updatedAt = firebase.firestore.FieldValue.serverTimestamp();
      db.collection('products').doc(currentProductId).update(productData)
        .then(() => {
          showToast(LANG[currentLang].productSaved);
          showScreen('catalogScreen');
          resetProductForm();
        })
        .catch(error => {
          console.error('Error updating product:', error);
          showToast(LANG[currentLang].error);
        });
    } else {
      productData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      db.collection('products').add(productData)
        .then(() => {
          showToast(LANG[currentLang].productSaved);
          showScreen('catalogScreen');
          resetProductForm();
        })
        .catch(error => {
          console.error('Error adding product:', error);
          showToast(LANG[currentLang].error);
        });
    }
  } else {
    // LocalStorage backend
    if (currentProductId) {
      LocalStorageBackend.updateProduct(currentProductId, productData);
      showToast(LANG[currentLang].productSaved);
      showScreen('catalogScreen');
      resetProductForm();
      loadProducts(); // Refresh list
    } else {
      LocalStorageBackend.addProduct(productData);
      showToast(LANG[currentLang].productSaved);
      showScreen('catalogScreen');
      resetProductForm();
      loadProducts(); // Refresh list
    }
  }
}

// Sales Functions
function setTodayDate() {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('saleDate').value = today;
  document.getElementById('visitDate').value = today;
}

function updateSalePrice() {
  const productSelect = document.getElementById('saleProduct');
  const selectedOption = productSelect.options[productSelect.selectedIndex];
  const price = selectedOption ? parseFloat(selectedOption.dataset.price) : 0;
  document.getElementById('salePrice').value = price || 0;
  calculateSaleTotal();
}

function calculateSaleTotal() {
  const quantity = parseFloat(document.getElementById('saleQuantity').value) || 0;
  const price = parseFloat(document.getElementById('salePrice').value) || 0;
  const total = quantity * price;
  document.getElementById('saleTotal').value = total.toFixed(2);
}

function handleSaveSale(e) {
  e.preventDefault();
  
  const saleData = {
    date: document.getElementById('saleDate').value,
    customer: document.getElementById('saleCustomer').value.trim(),
    productId: document.getElementById('saleProduct').value,
    productName: document.getElementById('saleProduct').options[document.getElementById('saleProduct').selectedIndex].text,
    quantity: parseFloat(document.getElementById('saleQuantity').value),
    price: parseFloat(document.getElementById('salePrice').value),
    total: parseFloat(document.getElementById('saleTotal').value),
    paymentMode: document.getElementById('salePayment').value,
    remarks: document.getElementById('saleRemarks').value.trim(),
    salesperson: currentUser
  };
  
  if (isFirebaseAvailable()) {
    saleData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    db.collection('sales').add(saleData)
      .then(() => {
        showToast(LANG[currentLang].saleSaved);
        document.getElementById('saleForm').reset();
        setTodayDate();
        showScreen('homeScreen');
      })
      .catch(error => {
        console.error('Error saving sale:', error);
        showToast(LANG[currentLang].error);
      });
  } else {
    LocalStorageBackend.addSale(saleData);
    showToast(LANG[currentLang].saleSaved);
    document.getElementById('saleForm').reset();
    setTodayDate();
    showScreen('homeScreen');
  }
}

// Visit Functions
function handleSaveVisit(e) {
  e.preventDefault();
  
  const visitData = {
    date: document.getElementById('visitDate').value,
    customer: document.getElementById('visitCustomer').value.trim(),
    location: document.getElementById('visitLocation').value.trim(),
    purpose: document.getElementById('visitPurpose').value.trim(),
    notes: document.getElementById('visitNotes').value.trim(),
    salesperson: currentUser
  };
  
  if (isFirebaseAvailable()) {
    visitData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    db.collection('visits').add(visitData)
      .then(() => {
        showToast(LANG[currentLang].visitSaved);
        document.getElementById('visitForm').reset();
        setTodayDate();
        showScreen('homeScreen');
      })
      .catch(error => {
        console.error('Error saving visit:', error);
        showToast(LANG[currentLang].error);
      });
  } else {
    LocalStorageBackend.addVisit(visitData);
    showToast(LANG[currentLang].visitSaved);
    document.getElementById('visitForm').reset();
    setTodayDate();
    showScreen('homeScreen');
  }
}

// Admin Dashboard Functions
function switchAdminTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
  
  document.getElementById('salesList').style.display = tab === 'sales' ? 'block' : 'none';
  document.getElementById('visitsList').style.display = tab === 'visits' ? 'block' : 'none';
  document.getElementById('reportsTabContent').style.display = tab === 'reports' ? 'block' : 'none';
}

function loadAdminData() {
  loadSales();
  loadVisits();
}

function loadSales() {
  if (isFirebaseAvailable()) {
    db.collection('sales')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()
      .then(snapshot => {
        salesData = [];
        snapshot.forEach(doc => {
          salesData.push({ id: doc.id, ...doc.data() });
        });
        renderSales();
      })
      .catch(error => {
        console.error('Error loading sales:', error);
      });
  } else {
    salesData = LocalStorageBackend.getSales()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 100);
    renderSales();
  }
}

function loadVisits() {
  if (isFirebaseAvailable()) {
    db.collection('visits')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get()
      .then(snapshot => {
        visitsData = [];
        snapshot.forEach(doc => {
          visitsData.push({ id: doc.id, ...doc.data() });
        });
        renderVisits();
      })
      .catch(error => {
        console.error('Error loading visits:', error);
      });
  } else {
    visitsData = LocalStorageBackend.getVisits()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 100);
    renderVisits();
  }
}

function renderSales() {
  const container = document.getElementById('salesList');
  const filtered = getFilteredSales();
  
  if (filtered.length === 0) {
    container.innerHTML = `<p class="no-data">${LANG[currentLang].noData}</p>`;
    return;
  }
  
  container.innerHTML = filtered.map(sale => {
    let date = sale.date || '';
    if (!date && sale.createdAt) {
      if (sale.createdAt.toDate) {
        date = sale.createdAt.toDate().toLocaleDateString();
      } else if (typeof sale.createdAt === 'string') {
        date = new Date(sale.createdAt).toLocaleDateString();
      }
    }
    return `
      <div class="data-item">
        <div class="data-header">
          <strong>${sale.customer || ''}</strong>
          <span class="data-date">${date}</span>
        </div>
        <div class="data-body">
          <p>${sale.productName || ''} - Qty: ${sale.quantity || 0} - ₹${sale.total || 0}</p>
          <p class="data-meta">${sale.paymentMode || ''} | ${sale.salesperson || ''}</p>
          ${sale.remarks ? `<p class="data-remarks">${sale.remarks}</p>` : ''}
        </div>
      </div>
    `;
  }).join('');
}

function renderVisits() {
  const container = document.getElementById('visitsList');
  const filtered = getFilteredVisits();
  
  if (filtered.length === 0) {
    container.innerHTML = `<p class="no-data">${LANG[currentLang].noData}</p>`;
    return;
  }
  
  container.innerHTML = filtered.map(visit => {
    let date = visit.date || '';
    if (!date && visit.createdAt) {
      if (visit.createdAt.toDate) {
        date = visit.createdAt.toDate().toLocaleDateString();
      } else if (typeof visit.createdAt === 'string') {
        date = new Date(visit.createdAt).toLocaleDateString();
      }
    }
    return `
      <div class="data-item">
        <div class="data-header">
          <strong>${visit.customer || ''}</strong>
          <span class="data-date">${date}</span>
        </div>
        <div class="data-body">
          ${visit.location ? `<p><strong>Location:</strong> ${visit.location}</p>` : ''}
          <p><strong>Purpose:</strong> ${visit.purpose || ''}</p>
          ${visit.notes ? `<p class="data-remarks">${visit.notes}</p>` : ''}
          <p class="data-meta">${visit.salesperson || ''}</p>
        </div>
      </div>
    `;
  }).join('');
}

function getFilteredSales() {
  let filtered = [...salesData];
  const fromDate = document.getElementById('filterDateFrom').value;
  const toDate = document.getElementById('filterDateTo').value;
  const salesperson = document.getElementById('filterSalesperson').value;
  
  if (fromDate) {
    filtered = filtered.filter(s => s.date >= fromDate);
  }
  if (toDate) {
    filtered = filtered.filter(s => s.date <= toDate);
  }
  if (salesperson) {
    filtered = filtered.filter(s => s.salesperson === salesperson);
  }
  
  return filtered;
}

function getFilteredVisits() {
  let filtered = [...visitsData];
  const fromDate = document.getElementById('filterDateFrom').value;
  const toDate = document.getElementById('filterDateTo').value;
  const salesperson = document.getElementById('filterSalesperson').value;
  
  if (fromDate) {
    filtered = filtered.filter(v => v.date >= fromDate);
  }
  if (toDate) {
    filtered = filtered.filter(v => v.date <= toDate);
  }
  if (salesperson) {
    filtered = filtered.filter(v => v.salesperson === salesperson);
  }
  
  return filtered;
}

function applyAdminFilters() {
  const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
  if (activeTab === 'sales') {
    renderSales();
  } else {
    renderVisits();
  }
}

function exportToExcel() {
  // Using SheetJS (xlsx) library - need to include it
  if (typeof XLSX === 'undefined') {
    // Load xlsx library dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js';
    script.onload = () => performExport();
    document.head.appendChild(script);
  } else {
    performExport();
  }
}

function performExport() {
  const activeTab = document.querySelector('.tab-btn.active').dataset.tab;
  let data, filename;
  
  if (activeTab === 'sales') {
    const filtered = getFilteredSales();
    data = filtered.map(sale => ({
      'Date': sale.date || '',
      'Customer': sale.customer || '',
      'Product': sale.productName || '',
      'Quantity': sale.quantity || 0,
      'Price': sale.price || 0,
      'Total': sale.total || 0,
      'Payment Mode': sale.paymentMode || '',
      'Salesperson': sale.salesperson || '',
      'Remarks': sale.remarks || ''
    }));
    filename = 'sales_export.xlsx';
  } else {
    const filtered = getFilteredVisits();
    data = filtered.map(visit => ({
      'Date': visit.date || '',
      'Customer/Shop': visit.customer || '',
      'Location': visit.location || '',
      'Purpose': visit.purpose || '',
      'Notes': visit.notes || '',
      'Salesperson': visit.salesperson || ''
    }));
    filename = 'visits_export.xlsx';
  }
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  XLSX.writeFile(wb, filename);
  showToast('Export completed!');
}

// Bulk Upload Functions
function downloadTemplate() {
  const template = [
    ['Product Name (English)', 'Product Name (Tamil)', 'Unit', 'Price', 'Active'],
    ['Example Product', 'எடுத்துக்காட்டு பொருள்', 'Litre', '100', 'true']
  ];
  
  if (typeof XLSX === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js';
    script.onload = () => exportTemplate(template);
    document.head.appendChild(script);
  } else {
    exportTemplate(template);
  }
}

function exportTemplate(template) {
  const ws = XLSX.utils.aoa_to_sheet(template);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Products');
  XLSX.writeFile(wb, 'product_template.xlsx');
}

function handleBulkUpload(e) {
  e.preventDefault();
  const fileInput = document.getElementById('csvFile');
  const file = fileInput.files[0];
  if (!file) return;
  
  const progressDiv = document.getElementById('uploadProgress');
  const statusP = document.getElementById('uploadStatus');
  const progressFill = document.getElementById('progressFill');
  
  progressDiv.style.display = 'block';
  statusP.textContent = 'Reading file...';
  progressFill.style.width = '20%';
  
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const data = event.target.result;
      let rows = [];
      
      if (file.name.endsWith('.csv')) {
        rows = parseCSV(data);
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        if (typeof XLSX === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js';
          script.onload = () => parseExcel(data, file);
          document.head.appendChild(script);
          return;
        }
        rows = parseExcel(data, file);
      }
      
      statusP.textContent = 'Uploading products...';
      progressFill.style.width = '50%';
      
      uploadProducts(rows, progressFill, statusP);
    } catch (error) {
      console.error('Error parsing file:', error);
      showToast(LANG[currentLang].uploadError);
      progressDiv.style.display = 'none';
    }
  };
  reader.readAsArrayBuffer(file);
}

function parseCSV(data) {
  const text = new TextDecoder().decode(data);
  const lines = text.split('\n').filter(line => line.trim());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(col => col.trim().replace(/^"|"$/g, ''));
    if (cols.length >= 4) {
      rows.push({
        nameEn: cols[0],
        nameTa: cols[1],
        unit: cols[2],
        price: parseFloat(cols[3]) || 0,
        active: cols[4]?.toLowerCase() === 'true' || cols[4] === '1'
      });
    }
  }
  return rows;
}

function parseExcel(data, file) {
  const workbook = XLSX.read(data, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(worksheet);
  
  return rows.map(row => ({
    nameEn: row['Product Name (English)'] || row['nameEn'] || '',
    nameTa: row['Product Name (Tamil)'] || row['nameTa'] || '',
    unit: row['Unit'] || row['unit'] || 'Litre',
    price: parseFloat(row['Price'] || row['price'] || 0),
    active: row['Active'] === true || row['Active'] === 'true' || row['active'] === true || row['active'] === 'true' || row['Active'] === 1
  }));
}

function uploadProducts(rows, progressFill, statusP) {
  let uploaded = 0;
  const total = rows.length;
  const batch = db.batch();
  
  rows.forEach((row, index) => {
    if (row.nameEn && row.price > 0) {
      const productRef = db.collection('products').doc();
      batch.set(productRef, {
        nameEn: row.nameEn,
        nameTa: row.nameTa || row.nameEn,
        unit: row.unit || 'Litre',
        price: row.price,
        active: row.active !== false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  });
  
  batch.commit()
    .then(() => {
      progressFill.style.width = '100%';
      statusP.textContent = `Successfully uploaded ${total} products!`;
      setTimeout(() => {
        document.getElementById('uploadProgress').style.display = 'none';
        document.getElementById('bulkUploadForm').reset();
        showScreen('catalogScreen');
        showToast(LANG[currentLang].uploadSuccess);
      }, 2000);
    })
    .catch(error => {
      console.error('Error uploading products:', error);
      showToast(LANG[currentLang].uploadError);
      document.getElementById('uploadProgress').style.display = 'none';
    });
}

function exportCatalog() {
  if (typeof XLSX === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js';
    script.onload = () => performCatalogExport();
    document.head.appendChild(script);
  } else {
    performCatalogExport();
  }
}

function performCatalogExport() {
  const data = products.map(p => ({
    'Product Name (English)': p.nameEn || '',
    'Product Name (Tamil)': p.nameTa || '',
    'Unit': p.unit || '',
    'Price': p.price || 0,
    'Active': p.active ? 'Yes' : 'No'
  }));
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Products');
  XLSX.writeFile(wb, 'product_catalog.xlsx');
  showToast('Catalog exported!');
}

// QR Code Functions
function startQRScan() {
  if (!('mediaDevices' in navigator) || !navigator.mediaDevices.getUserMedia) {
    showToast(LANG[currentLang].qrNotSupported);
    return;
  }
  
  const video = document.getElementById('qrVideo');
  const scannerArea = document.getElementById('qrScannerArea');
  scannerArea.style.display = 'block';
  
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    .then(stream => {
      qrStream = stream;
      video.srcObject = stream;
      video.play();
      qrScanning = true;
      scanQRCode();
    })
    .catch(error => {
      console.error('Error accessing camera:', error);
      showToast(LANG[currentLang].qrNotSupported);
    });
}

function stopQRScan() {
  qrScanning = false;
  if (qrStream) {
    qrStream.getTracks().forEach(track => track.stop());
    qrStream = null;
  }
  document.getElementById('qrScannerArea').style.display = 'none';
  const video = document.getElementById('qrVideo');
  video.srcObject = null;
}

function scanQRCode() {
  if (!qrScanning) return;
  
  const video = document.getElementById('qrVideo');
  const canvas = document.getElementById('qrCanvas');
  const context = canvas.getContext('2d');
  
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Simple QR code detection - in production, use a library like jsQR
    // For now, this is a placeholder
    // You would integrate jsQR library: https://github.com/cozmo/jsQR
    try {
      // Placeholder - replace with actual QR library
      const qrData = detectQRCode(canvas);
      if (qrData) {
        handleQRResult(qrData);
        return;
      }
    } catch (e) {
      console.error('QR scan error:', e);
    }
  }
  
  requestAnimationFrame(scanQRCode);
}

function detectQRCode(canvas) {
  // To enable full QR code scanning, add jsQR library:
  // Add this to index.html: <script src="https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.min.js"></script>
  // Then uncomment and use:
  /*
  const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  if (code) {
    return code.data;
  }
  */
  return null;
}

function handleQRResult(qrData) {
  stopQRScan();
  
  // Try to find product by ID or name
  const product = products.find(p => 
    p.id === qrData || 
    p.nameEn?.toLowerCase().includes(qrData.toLowerCase()) ||
    p.nameTa?.toLowerCase().includes(qrData.toLowerCase())
  );
  
  if (product) {
    document.getElementById('saleProduct').value = product.id;
    updateSalePrice();
    showToast(LANG[currentLang].qrProductFound);
  } else {
    showToast(LANG[currentLang].qrProductNotFound);
  }
}

// Reports Functions
function switchReportTab(tab) {
  document.querySelectorAll('[data-report]').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`[data-report="${tab}"]`).classList.add('active');
  
  document.getElementById('dailyReport').style.display = tab === 'daily' ? 'block' : 'none';
  document.getElementById('monthlyReport').style.display = tab === 'monthly' ? 'block' : 'none';
  document.getElementById('customReport').style.display = tab === 'custom' ? 'block' : 'none';
  
  if (tab === 'daily') loadDailyReport();
  else if (tab === 'monthly') loadMonthlyReport();
}

function loadReportsData() {
  loadSales();
  loadVisits();
}

function loadDailyReport() {
  const today = new Date().toISOString().split('T')[0];
  const todaySales = salesData.filter(s => s.date === today);
  
  const totalSales = todaySales.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalOrders = todaySales.length;
  const cash = todaySales.filter(s => s.paymentMode === 'Cash').reduce((sum, s) => sum + (s.total || 0), 0);
  const credit = todaySales.filter(s => s.paymentMode === 'Credit').reduce((sum, s) => sum + (s.total || 0), 0);
  
  document.getElementById('dailyTotalSales').textContent = `₹${totalSales.toFixed(2)}`;
  document.getElementById('dailyTotalOrders').textContent = totalOrders;
  document.getElementById('dailyCash').textContent = `₹${cash.toFixed(2)}`;
  document.getElementById('dailyCredit').textContent = `₹${credit.toFixed(2)}`;
}

function loadMonthlyReport() {
  const monthValue = document.getElementById('monthSelect').value;
  if (!monthValue) {
    const now = new Date();
    document.getElementById('monthSelect').value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return loadMonthlyReport();
  }
  
  const [year, month] = monthValue.split('-');
  const startDate = `${year}-${month}-01`;
  const endDate = `${year}-${month}-31`;
  
  const monthSales = salesData.filter(s => {
    if (!s.date) return false;
    return s.date >= startDate && s.date <= endDate;
  });
  
  const totalSales = monthSales.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalOrders = monthSales.length;
  const daysInMonth = new Date(year, month, 0).getDate();
  const avgDaily = totalSales / daysInMonth;
  
  // Find top salesperson
  const salespersonTotals = {};
  monthSales.forEach(s => {
    const sp = s.salesperson || 'Unknown';
    salespersonTotals[sp] = (salespersonTotals[sp] || 0) + (s.total || 0);
  });
  const topSalesperson = Object.entries(salespersonTotals)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
  
  document.getElementById('monthlyTotalSales').textContent = `₹${totalSales.toFixed(2)}`;
  document.getElementById('monthlyTotalOrders').textContent = totalOrders;
  document.getElementById('monthlyAvgDaily').textContent = `₹${avgDaily.toFixed(2)}`;
  document.getElementById('monthlyTopSalesperson').textContent = topSalesperson;
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById('monthlyReportTitle').textContent = 
    `${monthNames[parseInt(month) - 1]} ${year} Summary`;
}

function generateCustomReport() {
  const fromDate = document.getElementById('customDateFrom').value;
  const toDate = document.getElementById('customDateTo').value;
  
  if (!fromDate || !toDate) {
    showToast('Please select both dates');
    return;
  }
  
  const customSales = salesData.filter(s => {
    if (!s.date) return false;
    return s.date >= fromDate && s.date <= toDate;
  });
  
  const totalSales = customSales.reduce((sum, s) => sum + (s.total || 0), 0);
  const totalOrders = customSales.length;
  
  const content = document.getElementById('customReportContent');
  content.innerHTML = `
    <div class="summary-cards">
      <div class="summary-card">
        <div class="summary-label">Total Sales</div>
        <div class="summary-value">₹${totalSales.toFixed(2)}</div>
      </div>
      <div class="summary-card">
        <div class="summary-label">Total Orders</div>
        <div class="summary-value">${totalOrders}</div>
      </div>
    </div>
  `;
}

function downloadReport(type) {
  if (typeof XLSX === 'undefined') {
    const script = document.createElement('script');
    script.src = 'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js';
    script.onload = () => performReportExport(type);
    document.head.appendChild(script);
  } else {
    performReportExport(type);
  }
}

function performReportExport(type) {
  let data, filename;
  
  if (type === 'daily') {
    const today = new Date().toISOString().split('T')[0];
    const todaySales = salesData.filter(s => s.date === today);
    data = todaySales.map(s => ({
      'Date': s.date || '',
      'Customer': s.customer || '',
      'Product': s.productName || '',
      'Quantity': s.quantity || 0,
      'Price': s.price || 0,
      'Total': s.total || 0,
      'Payment Mode': s.paymentMode || '',
      'Salesperson': s.salesperson || '',
      'Remarks': s.remarks || ''
    }));
    filename = `daily_report_${today}.xlsx`;
  } else if (type === 'monthly') {
    const monthValue = document.getElementById('monthSelect').value;
    const [year, month] = monthValue.split('-');
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-31`;
    const monthSales = salesData.filter(s => s.date >= startDate && s.date <= endDate);
    data = monthSales.map(s => ({
      'Date': s.date || '',
      'Customer': s.customer || '',
      'Product': s.productName || '',
      'Quantity': s.quantity || 0,
      'Price': s.price || 0,
      'Total': s.total || 0,
      'Payment Mode': s.paymentMode || '',
      'Salesperson': s.salesperson || '',
      'Remarks': s.remarks || ''
    }));
    filename = `monthly_report_${year}_${month}.xlsx`;
  }
  
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');
  XLSX.writeFile(wb, filename);
  showToast('Report downloaded!');
}

function exportToPDF() {
  // Simple PDF export using window.print() or integrate jsPDF
  // For now, use browser print
  window.print();
}

// Utility Functions
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
