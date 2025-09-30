import { getDatabase } from './schema';
import { hashPassword } from './userService';
import {
  MOCK_PROVIDERS,
  MOCK_CUSTOMERS,
  MOCK_REVIEWS,
  MOCK_SERVICE_REQUESTS,
  MOCK_MESSAGES,
  MOCK_GAMIFICATION_REWARDS,
  MOCK_LEAD_PURCHASES,
  MOCK_PAYMENT_METHODS,
  MOCK_PAYMENT_TRANSACTIONS,
  MOCK_BACKGROUND_CHECKS,
  MOCK_LEADS,
} from '../data/mockData';

// Define services directly since they may not be in mockData
const SERVICES = [
  { id: 's1', name: 'House Cleaning', category: 'Cleaning', icon: 'home' },
  { id: 's2', name: 'Carpet Cleaning', category: 'Cleaning', icon: 'water' },
  { id: 's3', name: 'Window Cleaning', category: 'Cleaning', icon: 'desktop' },
  { id: 's4', name: 'Plumbing', category: 'Home Repair', icon: 'water' },
  { id: 's5', name: 'Bathroom Remodeling', category: 'Home Improvement', icon: 'hammer' },
  { id: 's6', name: 'Electrical Work', category: 'Home Repair', icon: 'flash' },
  { id: 's7', name: 'Landscaping', category: 'Outdoor', icon: 'leaf' },
  { id: 's8', name: 'Lawn Care', category: 'Outdoor', icon: 'leaf' },
  { id: 's9', name: 'Carpentry', category: 'Home Improvement', icon: 'hammer' },
  { id: 's10', name: 'Dog Walking', category: 'Pet Care', icon: 'paw' },
  { id: 's11', name: 'Dog Training', category: 'Pet Care', icon: 'paw' },
  { id: 's12', name: 'Painting', category: 'Home Improvement', icon: 'color-palette' },
  { id: 's13', name: 'Roofing', category: 'Home Repair', icon: 'home' },
  { id: 's14', name: 'HVAC Services', category: 'Home Repair', icon: 'snow' },
];

// Define lead packages
const LEAD_PACKAGES = [
  { id: 'pkg1', name: 'Single Lead', leadsCount: 1, price: 10.00, duration: 'single' as const },
  { id: 'pkg2', name: 'Weekly Pack', leadsCount: 5, price: 45.00, duration: 'weekly' as const, savingsPercentage: 10 },
  { id: 'pkg3', name: 'Monthly Pack', leadsCount: 20, price: 160.00, duration: 'monthly' as const, savingsPercentage: 20 },
];

export const seedDatabase = async (): Promise<void> => {
  try {
    const db = getDatabase();

    // Check if data already exists
    const existingUsers = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM users'
    );

    if (existingUsers && existingUsers.count > 0) {
      console.log('Database already seeded');
      return;
    }

    console.log('Seeding database with mock data...');

    const defaultPassword = await hashPassword('password123');

    // 1. Seed Services
    console.log('Seeding services...');
    for (const service of SERVICES) {
      await db.runAsync(
        `INSERT INTO services (id, name, category, icon) VALUES (?, ?, ?, ?)`,
        [service.id, service.name, service.category, service.icon]
      );
    }

    // 2. Seed Providers
    console.log('Seeding providers...');
    for (const provider of MOCK_PROVIDERS) {
      // Insert user
      await db.runAsync(
        `INSERT INTO users (id, name, email, password, phone, role, zipCode, city, state, profileImage, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          provider.id,
          provider.name,
          provider.email,
          defaultPassword,
          provider.phone,
          'provider',
          provider.zipCode,
          provider.city,
          provider.state,
          provider.profileImage || null,
          provider.createdAt,
        ]
      );

      // Insert provider
      await db.runAsync(
        `INSERT INTO providers (
          userId, businessName, services, priceRangeMin, priceRangeMax,
          rating, reviewCount, level, isVerified, hasInsurance, portfolio,
          bio, experience, subscriptionPlan, availableLeads, completedJobs,
          bonusLeads, customerRating, backgroundCheckStatus, backgroundCheckDate,
          profileActivated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          provider.id,
          provider.businessName,
          JSON.stringify(provider.services),
          provider.priceRange.min,
          provider.priceRange.max,
          provider.rating,
          provider.reviewCount,
          provider.level,
          provider.isVerified ? 1 : 0,
          provider.hasInsurance ? 1 : 0,
          JSON.stringify(provider.portfolio),
          provider.bio,
          provider.experience,
          provider.subscriptionPlan,
          provider.availableLeads,
          provider.completedJobs,
          provider.bonusLeads,
          provider.customerRating || null,
          provider.backgroundCheckStatus,
          provider.backgroundCheckDate || null,
          provider.profileActivated ? 1 : 0,
        ]
      );
    }

    // 3. Seed Customers
    console.log('Seeding customers...');
    for (const customer of MOCK_CUSTOMERS) {
      // Insert user
      await db.runAsync(
        `INSERT INTO users (id, name, email, password, phone, role, zipCode, city, state, profileImage, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          customer.id,
          customer.name,
          customer.email,
          defaultPassword,
          customer.phone,
          'customer',
          customer.zipCode,
          customer.city,
          customer.state,
          customer.profileImage || null,
          customer.createdAt,
        ]
      );

      // Insert customer
      await db.runAsync(
        `INSERT INTO customers (userId, requestsCount, rating, reviewCount)
         VALUES (?, ?, ?, ?)`,
        [
          customer.id,
          customer.requestsCount,
          customer.rating || null,
          customer.reviewCount || 0,
        ]
      );
    }

    // 4. Seed Reviews
    console.log('Seeding reviews...');
    for (const review of MOCK_REVIEWS) {
      await db.runAsync(
        `INSERT INTO reviews (
          id, providerId, customerId, customerName, customerImage,
          rating, comment, createdAt, serviceType, providerResponse,
          disputed, reviewerType
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          review.id,
          review.providerId,
          review.customerId,
          review.customerName,
          review.customerImage || null,
          review.rating,
          review.comment,
          review.createdAt,
          review.serviceType,
          review.providerResponse || null,
          review.disputed ? 1 : 0,
          review.reviewerType,
        ]
      );
    }

    // 5. Seed Service Requests
    console.log('Seeding service requests...');
    for (const request of MOCK_SERVICE_REQUESTS) {
      await db.runAsync(
        `INSERT INTO service_requests (
          id, customerId, serviceId, serviceName, description,
          zipCode, city, state, budgetMin, budgetMax,
          status, createdAt, scheduledDate
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          request.id,
          request.customerId,
          request.serviceId,
          request.serviceName,
          request.description,
          request.zipCode,
          request.city,
          request.state,
          request.budget?.min || null,
          request.budget?.max || null,
          request.status,
          request.createdAt,
          request.scheduledDate || null,
        ]
      );
    }

    // 6. Seed Messages
    console.log('Seeding messages...');
    for (const message of MOCK_MESSAGES) {
      await db.runAsync(
        `INSERT INTO messages (
          id, senderId, receiverId, text, originalLanguage,
          translatedText, timestamp, read
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          message.id,
          message.senderId,
          message.receiverId,
          message.text,
          message.originalLanguage,
          message.translatedText || null,
          message.timestamp,
          message.read ? 1 : 0,
        ]
      );
    }

    // 7. Seed Gamification Rewards
    console.log('Seeding gamification rewards...');
    for (const reward of MOCK_GAMIFICATION_REWARDS) {
      await db.runAsync(
        `INSERT INTO gamification_rewards (
          id, providerId, rewardType, bonusLeads, awardedAt, expiresAt
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          reward.id,
          reward.providerId,
          reward.rewardType,
          reward.bonusLeads,
          reward.awardedAt,
          reward.expiresAt || null,
        ]
      );
    }

    // 8. Seed Lead Packages
    console.log('Seeding lead packages...');
    for (const pkg of LEAD_PACKAGES) {
      await db.runAsync(
        `INSERT INTO lead_packages (
          id, name, leadsCount, price, duration, savingsPercentage
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          pkg.id,
          pkg.name,
          pkg.leadsCount,
          pkg.price,
          pkg.duration,
          pkg.savingsPercentage || null,
        ]
      );
    }

    // 9. Seed Lead Purchases
    console.log('Seeding lead purchases...');
    for (const purchase of MOCK_LEAD_PURCHASES) {
      await db.runAsync(
        `INSERT INTO lead_purchases (
          id, providerId, packageId, leadsCount, totalPrice,
          purchasedAt, expiresAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          purchase.id,
          purchase.providerId,
          purchase.packageId,
          purchase.leadsCount,
          purchase.totalPrice,
          purchase.purchasedAt,
          purchase.expiresAt || null,
        ]
      );
    }

    // 10. Seed Payment Methods
    console.log('Seeding payment methods...');
    for (const method of MOCK_PAYMENT_METHODS) {
      // Extract userId from the method (assuming it has one, or use first provider)
      const userId = 'p1'; // Default to first provider for demo
      await db.runAsync(
        `INSERT INTO payment_methods (
          id, userId, type, last4, brand, expiryMonth, expiryYear, isDefault
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          method.id,
          userId,
          method.type,
          method.last4,
          method.brand || null,
          method.expiryMonth || null,
          method.expiryYear || null,
          method.isDefault ? 1 : 0,
        ]
      );
    }

    // 11. Seed Payment Transactions
    console.log('Seeding payment transactions...');
    for (const transaction of MOCK_PAYMENT_TRANSACTIONS) {
      await db.runAsync(
        `INSERT INTO payment_transactions (
          id, userId, amount, currency, type, status,
          paymentMethodId, description, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          transaction.id,
          transaction.userId,
          transaction.amount,
          transaction.currency,
          transaction.type,
          transaction.status,
          transaction.paymentMethodId,
          transaction.description,
          transaction.createdAt,
        ]
      );
    }

    // 12. Seed Background Checks
    console.log('Seeding background checks...');
    for (const check of MOCK_BACKGROUND_CHECKS) {
      await db.runAsync(
        `INSERT INTO background_checks (
          id, providerId, status, initiatedAt, completedAt,
          provider, results
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          check.id,
          check.providerId,
          check.status,
          check.initiatedAt,
          check.completedAt || null,
          check.provider,
          JSON.stringify(check.results),
        ]
      );
    }

    // 13. Seed Leads
    console.log('Seeding leads...');
    for (const lead of MOCK_LEADS) {
      await db.runAsync(
        `INSERT INTO leads (
          id, serviceRequestId, customerId, price, status, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          lead.id,
          lead.serviceRequest.id,
          lead.customer.id,
          lead.price,
          lead.status,
          lead.createdAt,
        ]
      );
    }

    console.log('Database seeding completed successfully!');
    console.log('- Seeded', SERVICES.length, 'services');
    console.log('- Seeded', MOCK_PROVIDERS.length, 'providers');
    console.log('- Seeded', MOCK_CUSTOMERS.length, 'customers');
    console.log('- Seeded', MOCK_REVIEWS.length, 'reviews');
    console.log('- Seeded', MOCK_SERVICE_REQUESTS.length, 'service requests');
    console.log('- Seeded', MOCK_MESSAGES.length, 'messages');
    console.log('- Seeded', MOCK_GAMIFICATION_REWARDS.length, 'gamification rewards');
    console.log('- Seeded', LEAD_PACKAGES.length, 'lead packages');
    console.log('- Seeded', MOCK_LEAD_PURCHASES.length, 'lead purchases');
    console.log('- Seeded', MOCK_PAYMENT_METHODS.length, 'payment methods');
    console.log('- Seeded', MOCK_PAYMENT_TRANSACTIONS.length, 'payment transactions');
    console.log('- Seeded', MOCK_BACKGROUND_CHECKS.length, 'background checks');
    console.log('- Seeded', MOCK_LEADS.length, 'leads');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export const clearDatabase = async (): Promise<void> => {
  try {
    const db = getDatabase();

    // Delete all data (in reverse order of foreign key dependencies)
    await db.execAsync(`
      DELETE FROM background_check_consent;
      DELETE FROM background_checks;
      DELETE FROM payment_transactions;
      DELETE FROM payment_methods;
      DELETE FROM lead_purchases;
      DELETE FROM lead_packages;
      DELETE FROM leads;
      DELETE FROM messages;
      DELETE FROM gamification_rewards;
      DELETE FROM dispute_evidence;
      DELETE FROM reviews;
      DELETE FROM service_requests;
      DELETE FROM services;
      DELETE FROM customers;
      DELETE FROM providers;
      DELETE FROM users;
    `);

    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};