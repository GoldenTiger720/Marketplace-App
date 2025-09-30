# Quick Start Guide

## 🚀 Run the App in 3 Steps

### Step 1: Navigate to Project
```bash
cd marketplace-app
```

### Step 2: Install Dependencies (if not already done)
```bash
npm install
```

### Step 3: Start the App
```bash
npm start
```

Then press:
- `w` for web browser
- `i` for iOS simulator (macOS only)
- `a` for Android emulator

## 🎭 Testing Different User Types

### As a Customer:
1. On login screen, enter any email WITHOUT "provider" (e.g., `customer@test.com`)
2. Enter any password
3. Click "Sign In"
4. You'll see the customer dashboard with search, requests, and messaging

### As a Service Provider:
1. On login screen, enter any email WITH "provider" (e.g., `provider@test.com`)
2. Enter any password
3. Click "Sign In"
4. You'll see the provider dashboard with leads, earnings, and statistics

## 📱 Key Features to Test

### Customer Flow:
1. **Search** → Browse providers by service type
2. **Filters** → Filter by rating, location, verified status
3. **Provider Profile** → View detailed provider info, portfolio, reviews
4. **Dashboard** → See your service requests
5. **Messages** → Chat with providers

### Provider Flow:
1. **Dashboard** → View stats, earnings, available leads
2. **Leads** → Browse available customer requests
3. **Subscription** → View and upgrade subscription plans
4. **Messages** → Chat with customers
5. **Profile** → View your public profile as customers see it

## 🌍 Changing Language

The app supports multiple languages. To change:
1. The language system is set up in `src/i18n/i18n.ts`
2. Currently defaults to English
3. Translations available for: English, Portuguese (BR/PT), Spanish, Chinese, Tagalog, Arabic, Vietnamese

## 🎨 App Theme

- Primary Color: Purple (#667eea)
- Accent Color: Purple (#764ba2)
- Design Style: Modern, clean, gradient-based

## 📊 Mock Data Highlights

- **6 Providers** with different ratings (1-5 stars), services, and subscription plans
- **30+ Service Categories** from cleaning to automotive
- **Real-looking Reviews** with customer feedback
- **Active Chat Messages** demonstrating the messaging system
- **Service Requests** showing customer needs
- **Available Leads** for providers to purchase

## 🐛 Troubleshooting

### Port Already in Use
If you get a port error, kill the existing Expo process:
```bash
killall node
npm start
```

### Clear Cache
If you see unexpected behavior:
```bash
npm start -- --clear
```

### Reset Everything
```bash
rm -rf node_modules
npm install
npm start
```

## 💡 Tips

1. **Switch between user types** by logging out and in with different emails
2. **Explore all tabs** - each tab has unique functionality
3. **Check the provider profile** - click any provider from the search results
4. **View subscription plans** - access from provider dashboard
5. **Test the chat** - messages tab shows real-time messaging UI

## 📱 Best Testing Experience

- **Web**: Best for quick testing and development
- **iOS Simulator**: Test iOS-specific features
- **Android Emulator**: Test Android-specific features
- **Physical Device**: Use Expo Go app for real device testing

## 🎯 What's Working

✅ Authentication (mock)
✅ User role switching (customer/provider)
✅ Provider search and filtering
✅ Provider profiles with portfolio and reviews
✅ Dashboard for both user types
✅ Messaging UI
✅ Subscription plans display
✅ Multilingual setup (i18n ready)
✅ Navigation between screens
✅ Responsive design

## 📝 Note

This is a **frontend prototype** with mock data. In production, you would need:
- Real backend API
- Database
- Authentication service
- Payment processing
- Real-time messaging
- Push notifications
- Image upload/storage
- And more...

Enjoy exploring the app! 🎉