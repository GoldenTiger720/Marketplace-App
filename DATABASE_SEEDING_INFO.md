# Database Seeding Information

## Overview
The SQLite database is automatically created and seeded with all mock data when the app starts for the first time.

## What Gets Seeded

### 13 Tables with Complete Mock Data:

1. **Services** (14 services)
   - House Cleaning, Plumbing, Electrical Work, etc.
   - Categories: Cleaning, Home Repair, Home Improvement, Outdoor, Pet Care

2. **Providers** (6 providers)
   - John Smith (Smith Cleaning Services)
   - Maria Garcia (Garcia Plumbing Pro)
   - David Chen (Chen Electric Solutions)
   - Jennifer Martinez (Martinez Landscaping)
   - Robert Wilson (Wilson Carpentry)
   - Lisa Anderson (Anderson Pet Care)
   - All with password: `password123`

3. **Customers** (2 customers)
   - Emily Wilson
   - Robert Taylor
   - All with password: `password123`

4. **Reviews** (All reviews from MOCK_REVIEWS)
   - Customer reviews for providers
   - Star ratings and comments
   - Provider responses

5. **Service Requests** (All from MOCK_SERVICE_REQUESTS)
   - Open requests from customers
   - Service details, budgets, locations

6. **Messages** (All from MOCK_MESSAGES)
   - Chat conversations between customers and providers
   - Multilingual support with translations

7. **Gamification Rewards** (All from MOCK_GAMIFICATION_REWARDS)
   - Bonus leads awarded to providers
   - Achievement tracking

8. **Lead Packages** (3 packages)
   - Single Lead ($10)
   - Weekly Pack (5 leads, $45, 10% savings)
   - Monthly Pack (20 leads, $160, 20% savings)

9. **Lead Purchases** (All from MOCK_LEAD_PURCHASES)
   - Provider purchase history
   - Package details and expiration dates

10. **Payment Methods** (All from MOCK_PAYMENT_METHODS)
    - Credit cards and bank accounts
    - Associated with providers for billing

11. **Payment Transactions** (All from MOCK_PAYMENT_TRANSACTIONS)
    - Lead purchases, subscriptions, verification fees
    - Transaction history with statuses

12. **Background Checks** (All from MOCK_BACKGROUND_CHECKS)
    - Complete check results for providers
    - Criminal records, sex offender registry, identity verification
    - Status tracking (clear, in_progress, pending, etc.)

13. **Leads** (All from MOCK_LEADS)
    - Available leads for providers to purchase
    - Linked to service requests and customers

## Database File Location

The database file `marketplace.db` is created at runtime in the app's document directory:
- **iOS**: `Library/LocalDatabase/marketplace.db`
- **Android**: `/data/data/<package_name>/databases/marketplace.db`

## When Does Seeding Happen?

The database is seeded **automatically** when:
1. The app starts for the first time
2. The `users` table is empty (no existing data)

The seeding process:
1. Checks if users exist
2. If no users exist, seeds all 13 tables in order
3. Logs detailed progress to console
4. Shows loading screen during initialization

## Console Output During Seeding

When the app seeds the database, you'll see:
```
Initializing database...
Database initialized
Seeding database with mock data...
Seeding services...
Seeding providers...
Seeding customers...
Seeding reviews...
Seeding service requests...
Seeding messages...
Seeding gamification rewards...
Seeding lead packages...
Seeding lead purchases...
Seeding payment methods...
Seeding payment transactions...
Seeding background checks...
Seeding leads...
Database seeding completed successfully!
- Seeded 14 services
- Seeded 6 providers
- Seeded 2 customers
- Seeded [X] reviews
- Seeded [X] service requests
- Seeded [X] messages
... etc.
```

## Test Credentials

### All Seeded Users (Password: `password123`)

**Providers:**
- `john@example.com` - Smith Cleaning Services (Clear, Activated)
- `maria@example.com` - Garcia Plumbing Pro (Clear, Activated)
- `david@example.com` - Chen Electric Solutions (Clear, Activated)
- `jennifer@example.com` - Martinez Landscaping (Clear, Activated)
- `robert@example.com` - Wilson Carpentry (Clear, Activated)
- `lisa@example.com` - Anderson Pet Care (In Progress, Not Activated)

**Customers:**
- `emily@example.com` - Emily Wilson
- `robert@example.com` - Robert Taylor

## Resetting the Database

To completely reset and reseed the database:

### Method 1: Uninstall/Reinstall
1. Uninstall the app from device/emulator
2. Reinstall and launch
3. Database will be recreated and reseeded automatically

### Method 2: Programmatic Clear (Development Only)
Add this to a debug screen:
```typescript
import { clearDatabase, seedDatabase } from './src/database/dataMigration';

const resetDatabase = async () => {
  await clearDatabase();
  await seedDatabase();
  console.log('Database reset complete!');
};
```

## Verifying Database Contents

### Check if Data Exists
```typescript
import { getDatabase } from './src/database/schema';

const db = getDatabase();
const users = await db.getAllAsync('SELECT * FROM users');
console.log('Total users:', users.length);

const providers = await db.getAllAsync('SELECT * FROM providers');
console.log('Total providers:', providers.length);
```

### Query Specific Data
```typescript
// Get all services
const services = await db.getAllAsync('SELECT * FROM services');

// Get provider by email
const provider = await db.getFirstAsync(
  'SELECT * FROM users WHERE email = ?',
  ['john@example.com']
);

// Get all reviews for a provider
const reviews = await db.getAllAsync(
  'SELECT * FROM reviews WHERE providerId = ?',
  ['p1']
);
```

## Database Schema Summary

### User Authentication
- Users table with hashed passwords (SHA-256)
- Separate providers and customers tables
- Email uniqueness enforced

### Relationships
- Foreign keys properly defined
- ON DELETE CASCADE for data integrity
- Indexes on frequently queried fields

### JSON Storage
- Services array stored as JSON in providers
- Portfolio URLs stored as JSON array
- Background check results stored as JSON

## Seeding Process Details

### Order of Operations (Important!)
1. **Services** - Must be first (referenced by service requests)
2. **Users (Providers & Customers)** - Base user accounts
3. **Extended User Data** - Provider and customer specific data
4. **Reviews** - Requires users to exist
5. **Service Requests** - Requires customers and services
6. **Messages** - Requires users
7. **Gamification Rewards** - Requires providers
8. **Lead Packages** - Independent
9. **Lead Purchases** - Requires providers and packages
10. **Payment Methods** - Requires users
11. **Payment Transactions** - Requires users and payment methods
12. **Background Checks** - Requires providers
13. **Leads** - Requires service requests and customers

### Data Integrity
- All foreign key relationships respected
- NULL values handled appropriately
- JSON serialization for complex objects
- Boolean values converted to integers (SQLite standard)

## Troubleshooting

### "Database already seeded" Message
- **Meaning**: Database already has data
- **Action**: Normal operation, no action needed
- **To Force Reseed**: Uninstall and reinstall app

### Seeding Errors
If you see seeding errors:
1. Check console for specific error message
2. Verify all mock data imports are correct
3. Check foreign key relationships
4. Ensure database schema is created first

### Missing Data
If data appears to be missing:
1. Check console logs for seeding success messages
2. Query the database directly to verify
3. Check if app was force-closed during seeding

### Performance Issues
Database initialization typically takes:
- **First launch**: 2-5 seconds (schema creation + seeding)
- **Subsequent launches**: <1 second (database already exists)

## Advanced: Custom Seeding

To add your own test data:

1. Edit `/src/database/dataMigration.ts`
2. Add your custom data to the seeding function
3. Uninstall/reinstall to trigger reseed

Example:
```typescript
// Add custom provider
const customProvider = {
  id: 'p7',
  name: 'Custom Provider',
  email: 'custom@example.com',
  // ... other fields
};

// In seedDatabase function, after existing providers:
await db.runAsync(
  `INSERT INTO users (...) VALUES (...)`,
  [customProvider.id, ...]
);
```

## Production Considerations

For production deployment:
1. Remove or gate the `clearDatabase()` function
2. Implement proper database migrations
3. Consider remote data sync
4. Add database backup functionality
5. Implement data export/import
6. Add database encryption for sensitive data

## Next Steps

After seeding is complete:
1. Login with any seeded user credentials
2. Explore the app with real data
3. Test authentication flows
4. Test multilingual support
5. Register new users to see database writes
6. Verify data persistence across app restarts