import { getDatabase } from './schema';
import * as Crypto from 'expo-crypto';
import { User, Provider, Customer } from '../types';

// Hash password using SHA-256
export const hashPassword = async (password: string): Promise<string> => {
  const hashed = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
  return hashed;
};

// User Authentication
export const authenticateUser = async (
  email: string,
  password: string
): Promise<Provider | Customer | null> => {
  try {
    const db = getDatabase();
    const hashedPassword = await hashPassword(password);

    const result = await db.getFirstAsync<any>(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, hashedPassword]
    );

    if (!result) {
      return null;
    }

    // Get additional info based on role
    if (result.role === 'provider') {
      const providerInfo = await db.getFirstAsync<any>(
        'SELECT * FROM providers WHERE userId = ?',
        [result.id]
      );

      if (providerInfo) {
        return {
          ...result,
          role: 'provider',
          businessName: providerInfo.businessName,
          services: JSON.parse(providerInfo.services),
          priceRange: {
            min: providerInfo.priceRangeMin,
            max: providerInfo.priceRangeMax,
          },
          rating: providerInfo.rating,
          reviewCount: providerInfo.reviewCount,
          level: providerInfo.level,
          isVerified: Boolean(providerInfo.isVerified),
          hasInsurance: Boolean(providerInfo.hasInsurance),
          portfolio: providerInfo.portfolio ? JSON.parse(providerInfo.portfolio) : [],
          bio: providerInfo.bio,
          experience: providerInfo.experience,
          subscriptionPlan: providerInfo.subscriptionPlan,
          availableLeads: providerInfo.availableLeads,
          completedJobs: providerInfo.completedJobs,
          bonusLeads: providerInfo.bonusLeads,
          customerRating: providerInfo.customerRating,
          backgroundCheckStatus: providerInfo.backgroundCheckStatus,
          backgroundCheckDate: providerInfo.backgroundCheckDate,
          profileActivated: Boolean(providerInfo.profileActivated),
        } as Provider;
      }
    } else if (result.role === 'customer') {
      const customerInfo = await db.getFirstAsync<any>(
        'SELECT * FROM customers WHERE userId = ?',
        [result.id]
      );

      if (customerInfo) {
        return {
          ...result,
          role: 'customer',
          requestsCount: customerInfo.requestsCount,
          rating: customerInfo.rating,
          reviewCount: customerInfo.reviewCount,
        } as Customer;
      }
    }

    return null;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

// Register new user
export const registerUser = async (
  userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'customer' | 'provider';
    zipCode: string;
    city: string;
    state: string;
    businessName?: string;
  }
): Promise<Provider | Customer> => {
  try {
    const db = getDatabase();

    // Check if email already exists
    const existingUser = await db.getFirstAsync<any>(
      'SELECT id FROM users WHERE email = ?',
      [userData.email]
    );

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const userId = `user_${Date.now()}`;
    const hashedPassword = await hashPassword(userData.password);

    // Insert into users table
    await db.runAsync(
      `INSERT INTO users (id, name, email, password, phone, role, zipCode, city, state, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        userData.name,
        userData.email,
        hashedPassword,
        userData.phone,
        userData.role,
        userData.zipCode,
        userData.city,
        userData.state,
        new Date().toISOString(),
      ]
    );

    // Insert role-specific data
    if (userData.role === 'provider') {
      await db.runAsync(
        `INSERT INTO providers (
          userId, businessName, services, priceRangeMin, priceRangeMax,
          bio, experience, portfolio
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          userData.businessName || userData.name,
          JSON.stringify([]),
          0,
          0,
          '',
          '',
          JSON.stringify([]),
        ]
      );

      // Return provider user
      return {
        id: userId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: 'provider',
        zipCode: userData.zipCode,
        city: userData.city,
        state: userData.state,
        createdAt: new Date().toISOString(),
        businessName: userData.businessName || userData.name,
        services: [],
        priceRange: { min: 0, max: 0 },
        rating: 0,
        reviewCount: 0,
        level: 1,
        isVerified: false,
        hasInsurance: false,
        portfolio: [],
        bio: '',
        experience: '',
        subscriptionPlan: 'none',
        availableLeads: 0,
        completedJobs: 0,
        bonusLeads: 0,
        backgroundCheckStatus: 'pending',
        profileActivated: false,
      } as Provider;
    } else {
      await db.runAsync(
        `INSERT INTO customers (userId) VALUES (?)`,
        [userId]
      );

      // Return customer user
      return {
        id: userId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: 'customer',
        zipCode: userData.zipCode,
        city: userData.city,
        state: userData.state,
        createdAt: new Date().toISOString(),
        requestsCount: 0,
      } as Customer;
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const db = getDatabase();
    const user = await db.getFirstAsync<any>(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      return null;
    }

    // Get additional info based on role
    if (user.role === 'provider') {
      const providerInfo = await db.getFirstAsync<any>(
        'SELECT * FROM providers WHERE userId = ?',
        [user.id]
      );

      if (providerInfo) {
        return {
          ...user,
          role: 'provider',
          businessName: providerInfo.businessName,
          services: JSON.parse(providerInfo.services),
          priceRange: {
            min: providerInfo.priceRangeMin,
            max: providerInfo.priceRangeMax,
          },
          rating: providerInfo.rating,
          reviewCount: providerInfo.reviewCount,
          level: providerInfo.level,
          isVerified: Boolean(providerInfo.isVerified),
          hasInsurance: Boolean(providerInfo.hasInsurance),
          portfolio: providerInfo.portfolio ? JSON.parse(providerInfo.portfolio) : [],
          bio: providerInfo.bio,
          experience: providerInfo.experience,
          subscriptionPlan: providerInfo.subscriptionPlan,
          availableLeads: providerInfo.availableLeads,
          completedJobs: providerInfo.completedJobs,
          bonusLeads: providerInfo.bonusLeads,
          customerRating: providerInfo.customerRating,
          backgroundCheckStatus: providerInfo.backgroundCheckStatus,
          backgroundCheckDate: providerInfo.backgroundCheckDate,
          profileActivated: Boolean(providerInfo.profileActivated),
        } as Provider;
      }
    } else if (user.role === 'customer') {
      const customerInfo = await db.getFirstAsync<any>(
        'SELECT * FROM customers WHERE userId = ?',
        [user.id]
      );

      if (customerInfo) {
        return {
          ...user,
          role: 'customer',
          requestsCount: customerInfo.requestsCount,
          rating: customerInfo.rating,
          reviewCount: customerInfo.reviewCount,
        } as Customer;
      }
    }

    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Update user profile
export const updateUser = async (
  userId: string,
  updates: Partial<User>
): Promise<void> => {
  try {
    const db = getDatabase();

    const fields = [];
    const values = [];

    if (updates.name) {
      fields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.phone) {
      fields.push('phone = ?');
      values.push(updates.phone);
    }
    if (updates.zipCode) {
      fields.push('zipCode = ?');
      values.push(updates.zipCode);
    }
    if (updates.city) {
      fields.push('city = ?');
      values.push(updates.city);
    }
    if (updates.state) {
      fields.push('state = ?');
      values.push(updates.state);
    }
    if (updates.profileImage) {
      fields.push('profileImage = ?');
      values.push(updates.profileImage);
    }

    if (fields.length > 0) {
      values.push(userId);
      await db.runAsync(
        `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
        values
      );
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// Update provider profile
export const updateProvider = async (
  userId: string,
  updates: Partial<Provider>
): Promise<void> => {
  try {
    const db = getDatabase();

    const fields = [];
    const values = [];

    if (updates.businessName) {
      fields.push('businessName = ?');
      values.push(updates.businessName);
    }
    if (updates.services) {
      fields.push('services = ?');
      values.push(JSON.stringify(updates.services));
    }
    if (updates.priceRange) {
      fields.push('priceRangeMin = ?');
      fields.push('priceRangeMax = ?');
      values.push(updates.priceRange.min);
      values.push(updates.priceRange.max);
    }
    if (updates.bio !== undefined) {
      fields.push('bio = ?');
      values.push(updates.bio);
    }
    if (updates.experience) {
      fields.push('experience = ?');
      values.push(updates.experience);
    }
    if (updates.portfolio) {
      fields.push('portfolio = ?');
      values.push(JSON.stringify(updates.portfolio));
    }
    if (updates.isVerified !== undefined) {
      fields.push('isVerified = ?');
      values.push(updates.isVerified ? 1 : 0);
    }
    if (updates.hasInsurance !== undefined) {
      fields.push('hasInsurance = ?');
      values.push(updates.hasInsurance ? 1 : 0);
    }
    if (updates.backgroundCheckStatus) {
      fields.push('backgroundCheckStatus = ?');
      values.push(updates.backgroundCheckStatus);
    }
    if (updates.backgroundCheckDate) {
      fields.push('backgroundCheckDate = ?');
      values.push(updates.backgroundCheckDate);
    }
    if (updates.profileActivated !== undefined) {
      fields.push('profileActivated = ?');
      values.push(updates.profileActivated ? 1 : 0);
    }

    if (fields.length > 0) {
      values.push(userId);
      await db.runAsync(
        `UPDATE providers SET ${fields.join(', ')} WHERE userId = ?`,
        values
      );
    }
  } catch (error) {
    console.error('Error updating provider:', error);
    throw error;
  }
};

// Get all providers with filters
export const getProviders = async (filters?: {
  city?: string;
  state?: string;
  minRating?: number;
  verifiedOnly?: boolean;
}): Promise<Provider[]> => {
  try {
    const db = getDatabase();

    let query = `
      SELECT u.*, p.*
      FROM users u
      INNER JOIN providers p ON u.id = p.userId
      WHERE u.role = 'provider'
    `;

    const params: any[] = [];

    if (filters?.city) {
      query += ' AND u.city = ?';
      params.push(filters.city);
    }
    if (filters?.state) {
      query += ' AND u.state = ?';
      params.push(filters.state);
    }
    if (filters?.minRating) {
      query += ' AND p.rating >= ?';
      params.push(filters.minRating);
    }
    if (filters?.verifiedOnly) {
      query += ' AND p.isVerified = 1';
    }

    const results = await db.getAllAsync<any>(query, params);

    return results.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      role: 'provider',
      zipCode: row.zipCode,
      city: row.city,
      state: row.state,
      profileImage: row.profileImage,
      createdAt: row.createdAt,
      businessName: row.businessName,
      services: JSON.parse(row.services),
      priceRange: {
        min: row.priceRangeMin,
        max: row.priceRangeMax,
      },
      rating: row.rating,
      reviewCount: row.reviewCount,
      level: row.level,
      isVerified: Boolean(row.isVerified),
      hasInsurance: Boolean(row.hasInsurance),
      portfolio: row.portfolio ? JSON.parse(row.portfolio) : [],
      bio: row.bio,
      experience: row.experience,
      subscriptionPlan: row.subscriptionPlan,
      availableLeads: row.availableLeads,
      completedJobs: row.completedJobs,
      bonusLeads: row.bonusLeads,
      customerRating: row.customerRating,
      backgroundCheckStatus: row.backgroundCheckStatus,
      backgroundCheckDate: row.backgroundCheckDate,
      profileActivated: Boolean(row.profileActivated),
    })) as Provider[];
  } catch (error) {
    console.error('Error getting providers:', error);
    throw error;
  }
};