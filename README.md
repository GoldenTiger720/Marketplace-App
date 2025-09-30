# ServiceHub - Marketplace App for Service Providers

A comprehensive React Native marketplace app built with Expo that connects customers with local service providers across the United States.

## 🎯 Project Overview

ServiceHub is similar to Thumbtack, featuring:
- Multi-platform support (iOS, Android, Web)
- Customer and Service Provider roles
- Advanced search and filtering
- Real-time multilingual chat
- Provider verification and rating system
- Subscription-based monetization
- Pay-per-lead model

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Navigate to the project directory:
```bash
cd marketplace-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
npm run ios      # iOS Simulator (macOS only)
npm run android  # Android Emulator
npm run web      # Web Browser
```

## 📱 Demo Credentials

To test the app, you can use the following demo accounts:

### Customer Account
- Email: `customer@example.com`
- Password: `any password`

### Service Provider Account
- Email: `provider@example.com`
- Password: `any password`

**Note:** The app uses mock authentication. Any email containing "provider" will log you in as a provider, otherwise as a customer.

## 🏗️ Project Structure

```
marketplace-app/
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React Context (AppContext)
│   ├── data/              # Mock data (services, providers, customers)
│   ├── i18n/              # Internationalization (translations)
│   ├── navigation/        # Navigation setup (tabs, stacks)
│   ├── screens/           # All app screens
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ProviderProfileScreen.tsx
│   │   ├── CustomerDashboardScreen.tsx
│   │   ├── ProviderDashboardScreen.tsx
│   │   ├── ChatScreen.tsx
│   │   └── SubscriptionScreen.tsx
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── assets/                # Images, fonts, etc.
├── App.tsx               # Main app entry point
└── package.json
```

## ✨ Key Features

### 1. User & Provider Profiles
- **Customer Profile**: Post service requests, manage contracts, track reviews
- **Provider Profile**: Detailed profiles with experience, portfolio (up to 20 photos), price ranges
- **Geographic Data**: Zip code-based location services

### 2. Multilingual Support
- **Supported Languages**:
  - English (American)
  - Portuguese (Brazilian & Portugal)
  - Spanish
  - Chinese (Mandarin & Cantonese)
  - Tagalog
  - Arabic
  - Vietnamese
- **Auto-Translation**: Real-time chat translation between users

### 3. Provider Categorization & Verification
- **Level 1 (1-3 Stars)**: Basic providers
- **Level 2 (4-5 Stars)**: Highly-rated providers
- **Verified Badge**: Providers with liability insurance (monthly subscription)

### 4. Search & Discovery
Advanced filtering by:
- Star Rating
- Service Type
- Distance/Proximity
- City & State
- Price Range
- Verified Status

### 5. Rating & Reviews
- Customer ratings (1-5 stars with public reviews)
- Provider ratings of customers (1-5 stars, no comments)
- Review dispute system
- Gamified incentives:
  - 2 free leads for 7 reviews averaging 4+ stars
  - 5 free leads for 10 perfect 5-star reviews in 30 days

### 6. Monetization
- **Pay-per-Lead**: Primary revenue model
- **Subscription Plans**:
  - Bronze: Featured twice/week
  - Silver: Featured 4 times/week
  - Gold: Featured daily
- **Verification Fee**: $25/month for verified badge

### 7. Messaging System
- Real-time chat between customers and providers
- Automatic language translation
- Message history and notifications

## 🎨 Screens Overview

### Authentication
- **Login Screen**: Email/password authentication with language selection
- **Register Screen**: Sign up as customer or service provider

### Customer Screens
- **Home/Search**: Browse and filter service providers
- **Dashboard**: View service requests and activity
- **Messages**: Chat with providers
- **Profile**: Manage account settings

### Provider Screens
- **Dashboard**: Stats, earnings, available leads
- **Leads**: Browse and purchase customer leads
- **Messages**: Chat with customers
- **Profile**: Manage business profile and portfolio
- **Subscription**: Upgrade subscription plan

### Shared Screens
- **Provider Profile**: Detailed view with portfolio, reviews, about section
- **Chat**: One-on-one messaging with translation support

## 🛠️ Technologies Used

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform and tooling
- **TypeScript**: Type-safe JavaScript
- **React Navigation**: Navigation library (Stack & Tab)
- **i18next**: Internationalization framework
- **Expo Linear Gradient**: Gradient backgrounds
- **Expo Vector Icons**: Icon library (Ionicons)

## 📊 Mock Data

The app includes comprehensive mock data:
- 6 Service Providers (various ratings, services, locations)
- 2 Customers
- 30+ Service Categories
- Service Requests
- Reviews
- Messages
- Leads

All data is in `src/data/mockData.ts` and `src/data/services.ts`

## 🌐 Internationalization

To change the app language:
1. Use the language selector in the profile settings
2. Supported language codes: `en`, `pt-BR`, `pt-PT`, `es`, `zh-CN`, `zh-HK`, `tl`, `ar`, `vi`

Translation files are in `src/i18n/translations.ts`

## 🎯 Service Categories

The app supports 70+ service categories including:
- Cleaning Services
- Home Repair & Improvement
- Plumbing & Electrical
- Landscaping & Lawn Care
- Moving Services
- Pet Services
- Automotive Services
- And many more...

## 📝 Notes

### Current Implementation
This is a **frontend-only demo** with:
- Mock authentication (no real backend)
- Static mock data (no database)
- Simulated features (payments, background checks, etc.)

### For Production
To make this production-ready, you would need:
1. Backend API (Node.js, Python, etc.)
2. Database (PostgreSQL, MongoDB, etc.)
3. Real authentication (Firebase, Auth0, JWT)
4. Payment gateway integration (Stripe, Braintree)
5. Real-time messaging (Socket.io, Firebase)
6. Push notifications
7. Image upload and storage (AWS S3, Cloudinary)
8. Background check API integration
9. Geolocation services
10. Email/SMS services

## 🤝 Contributing

This is a demo project. For production use, consider:
- Adding comprehensive unit tests
- Implementing E2E testing
- Setting up CI/CD pipeline
- Adding error boundaries
- Implementing analytics
- Adding performance monitoring

## 📄 License

This project is for demonstration purposes.

## 🎨 Design Credits

- Color scheme: Purple gradient (#667eea to #764ba2)
- Icons: Ionicons
- Images: Using placeholder services (pravatar.cc, unsplash.com)

---

Built with ❤️ using React Native & Expo