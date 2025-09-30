import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync('marketplace.db');

  // Create Users table (base for both customers and providers)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      phone TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('customer', 'provider')),
      zipCode TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      profileImage TEXT,
      createdAt TEXT NOT NULL
    );
  `);

  // Create Providers table (extended info for service providers)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS providers (
      userId TEXT PRIMARY KEY,
      businessName TEXT NOT NULL,
      services TEXT NOT NULL,
      priceRangeMin REAL NOT NULL,
      priceRangeMax REAL NOT NULL,
      rating REAL DEFAULT 0,
      reviewCount INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1 CHECK(level IN (1, 2, 3)),
      isVerified INTEGER DEFAULT 0,
      hasInsurance INTEGER DEFAULT 0,
      portfolio TEXT,
      bio TEXT,
      experience TEXT,
      subscriptionPlan TEXT DEFAULT 'none' CHECK(subscriptionPlan IN ('none', 'bronze', 'silver', 'gold')),
      availableLeads INTEGER DEFAULT 0,
      completedJobs INTEGER DEFAULT 0,
      bonusLeads INTEGER DEFAULT 0,
      customerRating REAL,
      backgroundCheckStatus TEXT DEFAULT 'pending' CHECK(backgroundCheckStatus IN ('pending', 'in_progress', 'clear', 'flagged', 'rejected', 'expired')),
      backgroundCheckDate TEXT,
      profileActivated INTEGER DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create Customers table (extended info for customers)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS customers (
      userId TEXT PRIMARY KEY,
      requestsCount INTEGER DEFAULT 0,
      rating REAL,
      reviewCount INTEGER DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create Services table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      icon TEXT NOT NULL
    );
  `);

  // Create ServiceRequests table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS service_requests (
      id TEXT PRIMARY KEY,
      customerId TEXT NOT NULL,
      serviceId TEXT NOT NULL,
      serviceName TEXT NOT NULL,
      description TEXT NOT NULL,
      zipCode TEXT NOT NULL,
      city TEXT NOT NULL,
      state TEXT NOT NULL,
      budgetMin REAL,
      budgetMax REAL,
      status TEXT NOT NULL CHECK(status IN ('open', 'in_progress', 'completed', 'cancelled')),
      createdAt TEXT NOT NULL,
      scheduledDate TEXT,
      FOREIGN KEY (customerId) REFERENCES customers(userId) ON DELETE CASCADE,
      FOREIGN KEY (serviceId) REFERENCES services(id)
    );
  `);

  // Create Reviews table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      providerId TEXT NOT NULL,
      customerId TEXT NOT NULL,
      customerName TEXT NOT NULL,
      customerImage TEXT,
      rating REAL NOT NULL,
      comment TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      serviceType TEXT NOT NULL,
      providerResponse TEXT,
      disputed INTEGER DEFAULT 0,
      reviewerType TEXT NOT NULL CHECK(reviewerType IN ('customer', 'provider')),
      FOREIGN KEY (providerId) REFERENCES providers(userId) ON DELETE CASCADE,
      FOREIGN KEY (customerId) REFERENCES customers(userId) ON DELETE CASCADE
    );
  `);

  // Create DisputeEvidence table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS dispute_evidence (
      id TEXT PRIMARY KEY,
      reviewId TEXT NOT NULL,
      providerId TEXT NOT NULL,
      description TEXT NOT NULL,
      attachments TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      submittedAt TEXT NOT NULL,
      FOREIGN KEY (reviewId) REFERENCES reviews(id) ON DELETE CASCADE,
      FOREIGN KEY (providerId) REFERENCES providers(userId) ON DELETE CASCADE
    );
  `);

  // Create GamificationRewards table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS gamification_rewards (
      id TEXT PRIMARY KEY,
      providerId TEXT NOT NULL,
      rewardType TEXT NOT NULL CHECK(rewardType IN ('7reviews_4stars', '10reviews_5stars')),
      bonusLeads INTEGER NOT NULL,
      awardedAt TEXT NOT NULL,
      expiresAt TEXT,
      FOREIGN KEY (providerId) REFERENCES providers(userId) ON DELETE CASCADE
    );
  `);

  // Create Messages table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      senderId TEXT NOT NULL,
      receiverId TEXT NOT NULL,
      text TEXT NOT NULL,
      originalLanguage TEXT NOT NULL,
      translatedText TEXT,
      timestamp TEXT NOT NULL,
      read INTEGER DEFAULT 0,
      FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiverId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create Leads table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      serviceRequestId TEXT NOT NULL,
      customerId TEXT NOT NULL,
      price REAL NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('available', 'purchased', 'expired')),
      createdAt TEXT NOT NULL,
      FOREIGN KEY (serviceRequestId) REFERENCES service_requests(id) ON DELETE CASCADE,
      FOREIGN KEY (customerId) REFERENCES customers(userId) ON DELETE CASCADE
    );
  `);

  // Create LeadPackages table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS lead_packages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      leadsCount INTEGER NOT NULL,
      price REAL NOT NULL,
      duration TEXT NOT NULL CHECK(duration IN ('single', 'weekly', 'monthly')),
      savingsPercentage REAL
    );
  `);

  // Create LeadPurchases table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS lead_purchases (
      id TEXT PRIMARY KEY,
      providerId TEXT NOT NULL,
      packageId TEXT NOT NULL,
      leadsCount INTEGER NOT NULL,
      totalPrice REAL NOT NULL,
      purchasedAt TEXT NOT NULL,
      expiresAt TEXT,
      FOREIGN KEY (providerId) REFERENCES providers(userId) ON DELETE CASCADE,
      FOREIGN KEY (packageId) REFERENCES lead_packages(id)
    );
  `);

  // Create PaymentMethods table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS payment_methods (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('card', 'bank_account')),
      last4 TEXT NOT NULL,
      brand TEXT,
      expiryMonth INTEGER,
      expiryYear INTEGER,
      isDefault INTEGER DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
    );
  `);

  // Create PaymentTransactions table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS payment_transactions (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      type TEXT NOT NULL CHECK(type IN ('lead_purchase', 'subscription', 'verification')),
      status TEXT NOT NULL CHECK(status IN ('pending', 'completed', 'failed', 'refunded')),
      paymentMethodId TEXT NOT NULL,
      description TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (paymentMethodId) REFERENCES payment_methods(id)
    );
  `);

  // Create BackgroundChecks table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS background_checks (
      id TEXT PRIMARY KEY,
      providerId TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending', 'in_progress', 'clear', 'flagged', 'rejected', 'expired')),
      initiatedAt TEXT NOT NULL,
      completedAt TEXT,
      provider TEXT NOT NULL,
      results TEXT NOT NULL,
      FOREIGN KEY (providerId) REFERENCES providers(userId) ON DELETE CASCADE
    );
  `);

  // Create BackgroundCheckConsent table
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS background_check_consent (
      providerId TEXT PRIMARY KEY,
      consentGivenAt TEXT NOT NULL,
      ipAddress TEXT NOT NULL,
      fullLegalName TEXT NOT NULL,
      dateOfBirth TEXT NOT NULL,
      socialSecurityNumber TEXT NOT NULL,
      driversLicenseNumber TEXT,
      agreedToTerms INTEGER NOT NULL,
      FOREIGN KEY (providerId) REFERENCES providers(userId) ON DELETE CASCADE
    );
  `);

  // Create indexes for performance
  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_providers_city ON providers(userId);
    CREATE INDEX IF NOT EXISTS idx_service_requests_customer ON service_requests(customerId);
    CREATE INDEX IF NOT EXISTS idx_service_requests_status ON service_requests(status);
    CREATE INDEX IF NOT EXISTS idx_reviews_provider ON reviews(providerId);
    CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(senderId);
    CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiverId);
    CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
  `);

  console.log('Database initialized successfully');
  return db;
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.closeAsync();
    db = null;
  }
};