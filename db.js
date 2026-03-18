/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ZedMarket Database Module
 * Handles all data persistence, retrieval, and business logic
 * ═══════════════════════════════════════════════════════════════════════════
 */

class ZedMarketDB {
  constructor() {
    this.storageKey = 'zedmarket_data';
    this.initializeStorage();
  }

  /**
   * Initialize localStorage with default data if empty
   */
  initializeStorage() {
    if (!localStorage.getItem(this.storageKey)) {
      const defaultData = {
        businesses: this.getDefaultBusinesses(),
        users: [],
        pendingBusinesses: [],
        trendingRequests: [],
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
    }
  }

  /**
   * Get all data from storage
   */
  getAllData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Save all data to storage
   */
  saveData(data) {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  /**
   * Get default/seed businesses
   */
  getDefaultBusinesses() {
    return [
      {
        id: 1,
        name: 'Lusaka Tech Hub',
        cat: 'Technology',
        city: 'Lusaka',
        province: 'Lusaka Province',
        desc: 'Premier IT solutions and software development company serving Zambia since 2018.',
        fullDesc:
          "Lusaka Tech Hub provides cutting-edge technology solutions including custom software development, IT support, networking, and digital transformation. We've served 200+ clients across Zambia.",
        svc: 'Custom Software, IT Support, Networking, Web Design, Mobile Apps',
        emoji: '💻',
        trending: true,
        verified: true,
        status: 'approved',
        owner: 'Chanda Mwale',
        nrc: '123456/78/1',
        phone: '+260 97 123 4567',
        wa: '260971234567',
        fb: 'LusakaTechHub',
        ig: 'lusakatechhub',
        email: 'info@lusakatech.zm',
        address: 'Plot 15, Cairo Road, Lusaka',
        rating: 4.8,
        reg: '2025-01-10',
      },
      {
        id: 2,
        name: "Mama Zam's Kitchen",
        cat: 'Food & Beverage',
        city: 'Kitwe',
        province: 'Copperbelt Province',
        desc: 'Authentic Zambian cuisine and catering services for all occasions.',
        fullDesc:
          'We specialize in traditional Zambian dishes made from fresh local ingredients. Available for weddings, corporate events, and daily lunch delivery across Kitwe and Ndola.',
        svc: 'Nshima & Relish, Catering, Event Food, Lunch Delivery, Custom Menus',
        emoji: '🍽',
        trending: true,
        verified: true,
        status: 'approved',
        owner: 'Mary Mutale',
        nrc: '234567/89/2',
        phone: '+260 96 234 5678',
        wa: '260962345678',
        fb: 'MamaZamsKitchen',
        ig: 'mamakitchenZM',
        email: 'mamakitchen@zm.com',
        address: 'Parklands, Kitwe',
        rating: 4.9,
        reg: '2025-01-15',
      },
      {
        id: 3,
        name: 'ZedThreads Fashion',
        cat: 'Fashion & Clothing',
        city: 'Lusaka',
        province: 'Lusaka Province',
        desc: 'Modern Zambian-inspired fashion for men, women and children.',
        fullDesc:
          'ZedThreads blends traditional Zambian chitenge prints with contemporary fashion. We design, manufacture and retail from our Lusaka showroom.',
        svc: 'Custom Clothing, Ready-to-Wear, Chitenge Designs, Alterations, School Uniforms',
        emoji: '👗',
        trending: false,
        verified: true,
        status: 'approved',
        owner: 'Bupe Nakamba',
        nrc: '345678/90/3',
        phone: '+260 95 345 6789',
        wa: '260953456789',
        fb: 'ZedThreadsFashion',
        ig: 'zedthreads',
        email: 'zedthreads@zm.com',
        address: 'Arcades Mall, Lusaka',
        rating: 4.6,
        reg: '2025-02-01',
      },
      {
        id: 4,
        name: 'Green Farm Zambia',
        cat: 'Agriculture',
        city: 'Chipata',
        province: 'Eastern Province',
        desc: 'Fresh organic produce delivered farm-to-table across Eastern Province.',
        fullDesc:
          'Green Farm Zambia is a family-owned organic farm supplying fresh vegetables, maize, and seasonal produce to supermarkets, restaurants, and households.',
        svc: 'Maize, Vegetables, Organic Produce, Farm Tours, Bulk Supply',
        emoji: '🌾',
        trending: false,
        verified: false,
        status: 'approved',
        owner: 'Joseph Phiri',
        nrc: '456789/01/4',
        phone: '+260 97 456 7890',
        wa: '260974567890',
        fb: 'GreenFarmZambia',
        ig: '',
        email: 'greenfarm@zm.net',
        address: 'Chipata Road, Eastern Province',
        rating: 4.3,
        reg: '2025-02-10',
      },
      {
        id: 5,
        name: 'SafeRide Transport',
        cat: 'Transport & Logistics',
        city: 'Lusaka',
        province: 'Lusaka Province',
        desc: 'Reliable passenger and cargo transport across all provinces of Zambia.',
        fullDesc:
          'SafeRide operates a modern fleet providing safe, affordable transport. We cover all 10 provinces with dedicated cargo and passenger routes.',
        svc: 'Passenger Transport, Cargo Delivery, School Runs, Airport Transfers, Long Distance',
        emoji: '🚛',
        trending: false,
        verified: true,
        status: 'approved',
        owner: 'David Tembo',
        nrc: '567890/12/5',
        phone: '+260 96 567 8901',
        wa: '260965678901',
        fb: 'SafeRideZambia',
        ig: 'saferidetransport',
        email: 'saferide@zm.com',
        address: 'Ben Bella Road, Lusaka',
        rating: 4.5,
        reg: '2025-02-20',
      },
    ];
  }

  /**
   * Get all approved businesses
   */
  getApprovedBusinesses() {
    const data = this.getAllData();
    return data.businesses.filter((b) => b.status === 'approved');
  }

  /**
   * Get business by ID
   */
  getBusinessById(id) {
    const data = this.getAllData();
    return data.businesses.find((b) => b.id === id);
  }

  /**
   * Search businesses by query and category
   */
  searchBusinesses(query = '', category = '', sortBy = 'trending') {
    let businesses = this.getApprovedBusinesses();

    // Filter by category
    if (category) {
      businesses = businesses.filter((b) => b.cat === category || b.cat === category.replace('&amp;', '&'));
    }

    // Filter by search query
    if (query) {
      const q = query.toLowerCase().trim();
      businesses = businesses.filter((b) => (b.name + b.desc + b.cat).toLowerCase().includes(q));
    }

    // Sort
    if (sortBy === 'trending') {
      businesses.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
    } else if (sortBy === 'newest') {
      businesses.sort((a, b) => new Date(b.reg) - new Date(a.reg));
    } else if (sortBy === 'rating') {
      businesses.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return businesses;
  }

  /**
   * Get all categories
   */
  getCategories() {
    const categories = new Set();
    this.getApprovedBusinesses().forEach((b) => categories.add(b.cat));
    return Array.from(categories).sort();
  }

  /**
   * Register a new user (seller)
   */
  registerUser(userData) {
    const data = this.getAllData();
    const user = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
    data.users.push(user);
    this.saveData(data);
    return user;
  }

  /**
   * Authenticate user
   */
  authenticateUser(email, password) {
    const data = this.getAllData();
    const user = data.users.find((u) => u.email === email && u.pw === password);
    return user || null;
  }

  /**
   * Submit a new business for review
   */
  submitBusiness(businessData) {
    const data = this.getAllData();
    const business = {
      id: Date.now() + 1,
      ...businessData,
      status: 'pending',
      trending: false,
      verified: false,
      rating: 0,
      reg: new Date().toISOString().slice(0, 10),
    };
    data.pendingBusinesses.push(business);
    this.saveData(data);
    return business;
  }

  /**
   * Get all pending businesses
   */
  getPendingBusinesses() {
    const data = this.getAllData();
    return data.pendingBusinesses;
  }

  /**
   * Approve a pending business
   */
  approveBusiness(businessId) {
    const data = this.getAllData();
    const index = data.pendingBusinesses.findIndex((b) => b.id === businessId);

    if (index >= 0) {
      const business = data.pendingBusinesses[index];
      business.status = 'approved';
      business.rating = 4.0;
      data.businesses.push(business);
      data.pendingBusinesses.splice(index, 1);
      this.saveData(data);
      return business;
    }
    return null;
  }

  /**
   * Reject a pending business
   */
  rejectBusiness(businessId) {
    const data = this.getAllData();
    const index = data.pendingBusinesses.findIndex((b) => b.id === businessId);

    if (index >= 0) {
      const business = data.pendingBusinesses[index];
      data.pendingBusinesses.splice(index, 1);
      this.saveData(data);
      return business;
    }
    return null;
  }

  /**
   * Submit a trending request
   */
  submitTrendingRequest(requestData) {
    const data = this.getAllData();
    const request = {
      id: Date.now(),
      ...requestData,
      status: 'pending',
      date: new Date().toISOString().slice(0, 10),
    };
    data.trendingRequests.push(request);
    this.saveData(data);
    return request;
  }

  /**
   * Get all trending requests
   */
  getTrendingRequests() {
    const data = this.getAllData();
    return data.trendingRequests;
  }

  /**
   * Toggle business trending status
   */
  toggleTrending(businessId) {
    const data = this.getAllData();
    const business = data.businesses.find((b) => b.id === businessId);

    if (business) {
      business.trending = !business.trending;
      this.saveData(data);
      return business;
    }
    return null;
  }

  /**
   * Toggle business verification status
   */
  toggleVerification(businessId) {
    const data = this.getAllData();
    const business = data.businesses.find((b) => b.id === businessId);

    if (business) {
      business.verified = !business.verified;
      this.saveData(data);
      return business;
    }
    return null;
  }

  /**
   * Delete a business
   */
  deleteBusiness(businessId) {
    const data = this.getAllData();
    const index = data.businesses.findIndex((b) => b.id === businessId);

    if (index >= 0) {
      const business = data.businesses[index];
      data.businesses.splice(index, 1);
      this.saveData(data);
      return business;
    }
    return null;
  }

  /**
   * Dismiss a trending request
   */
  dismissTrendingRequest(requestId) {
    const data = this.getAllData();
    const index = data.trendingRequests.findIndex((r) => r.id === requestId);

    if (index >= 0) {
      const request = data.trendingRequests[index];
      data.trendingRequests.splice(index, 1);
      this.saveData(data);
      return request;
    }
    return null;
  }

  /**
   * Get admin statistics
   */
  getAdminStats() {
    const data = this.getAllData();
    const approvedBusinesses = data.businesses.filter((b) => b.status === 'approved');

    return {
      totalBusinesses: approvedBusinesses.length,
      pendingCount: data.pendingBusinesses.length,
      trendingCount: approvedBusinesses.filter((b) => b.trending).length,
      trendingRequestsCount: data.trendingRequests.length,
      usersCount: data.users.length,
      recentActivity: this.getRecentActivity(),
    };
  }

  /**
   * Get recent activity
   */
  getRecentActivity() {
    const data = this.getAllData();
    const activity = [
      ...data.pendingBusinesses.slice(-4).map((b) => ({
        name: b.name,
        type: 'New Business',
        status: 'pending',
        date: b.reg,
      })),
      ...data.trendingRequests.slice(-4).map((r) => ({
        name: r.biz,
        type: 'Trend Request',
        status: r.status,
        date: r.date,
      })),
    ];
    return activity;
  }

  /**
   * Get emoji for category
   */
  getCategoryEmoji(category) {
    const emojiMap = {
      Technology: '💻',
      'Food & Beverage': '🍽',
      'Fashion & Clothing': '👗',
      'Health & Beauty': '💊',
      Construction: '🏗',
      Agriculture: '🌾',
      'Transport & Logistics': '🚛',
      Education: '📚',
      Finance: '💰',
      Entertainment: '🎭',
    };
    return emojiMap[category] || '🏪';
  }

  /**
   * Add demo business (for testing)
   */
  addDemoBusiness() {
    const data = this.getAllData();
    const demoBusiness = {
      id: Date.now(),
      name: 'Demo Business ' + Math.floor(Math.random() * 100),
      cat: 'Technology',
      city: 'Lusaka',
      province: 'Lusaka Province',
      desc: 'A demo business for testing.',
      fullDesc: 'This is a demo business.',
      svc: 'Demo Service 1, Demo Service 2',
      emoji: '🏪',
      trending: false,
      verified: false,
      status: 'approved',
      owner: 'Demo Owner',
      nrc: '999999/99/9',
      phone: '+260 97 000 0000',
      wa: '260970000000',
      fb: 'DemoZM',
      ig: 'demo_zm',
      email: 'demo@zm.com',
      address: 'Demo Address, Lusaka',
      rating: 4.0,
      reg: new Date().toISOString().slice(0, 10),
    };
    data.businesses.push(demoBusiness);
    this.saveData(data);
    return demoBusiness;
  }

  /**
   * Clear all data and reset to defaults
   */
  reset() {
    const defaultData = {
      businesses: this.getDefaultBusinesses(),
      users: [],
      pendingBusinesses: [],
      trendingRequests: [],
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(this.storageKey, JSON.stringify(defaultData));
  }

  /**
   * Export data as JSON
   */
  exportData() {
    return this.getAllData();
  }

  /**
   * Import data from JSON
   */
  importData(jsonData) {
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      this.saveData(data);
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

// Create global instance
const db = new ZedMarketDB();
