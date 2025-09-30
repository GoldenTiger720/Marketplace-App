# Testing Guide: Database, Authentication & i18n

## Quick Start Testing

### 1. Start the App
```bash
cd /home/administrator/Documents/marketplace-app
npm start
```

The app will:
- Initialize the SQLite database automatically
- Seed mock data on first run
- Show a loading screen during initialization

---

## Testing Authentication

### Test Scenario 1: Login with Seeded User (Customer)
1. Launch the app
2. You should see the Login screen
3. Enter credentials:
   - **Email**: `sarah@example.com`
   - **Password**: `password123`
4. Tap "Sign In"
5. **Expected Result**: Successfully logged in, see Customer Dashboard with tabs (Search, Dashboard, Chat, Profile)

### Test Scenario 2: Login with Seeded User (Provider)
1. From Login screen, enter:
   - **Email**: `john@example.com`
   - **Password**: `password123`
2. Tap "Sign In"
3. **Expected Result**: Successfully logged in, see Provider Dashboard with tabs (Dashboard, Leads, Subscription, Chat, Profile)

### Test Scenario 3: Invalid Login
1. From Login screen, enter:
   - **Email**: `wrong@example.com`
   - **Password**: `wrongpassword`
2. Tap "Sign In"
3. **Expected Result**: Alert appears "Login Failed: Invalid email or password"

### Test Scenario 4: New User Registration (Customer)
1. From Login screen, tap "Sign Up"
2. Fill in the registration form:
   - **Full Name**: "Test Customer"
   - **Email**: "testcustomer@test.com"
   - **Password**: "test123"
   - **Phone**: "(555) 111-2222"
   - **Zip Code**: "90210"
   - **City**: "Los Angeles"
   - **State**: "CA"
   - **Role**: Select "Customer"
3. Tap "Sign Up"
4. **Expected Result**: Successfully registered and logged in, see Customer Dashboard

### Test Scenario 5: New Provider Registration + Background Check
1. From Login screen, tap "Sign Up"
2. Fill in the registration form:
   - **Full Name**: "Test Provider"
   - **Email**: "testprovider@test.com"
   - **Password**: "test123"
   - **Phone**: "(555) 333-4444"
   - **Zip Code**: "90210"
   - **City**: "Los Angeles"
   - **State**: "CA"
   - **Role**: Select "Service Provider"
   - **Business Name**: "Test Services Co"
3. Tap "Sign Up"
4. **Expected Result**:
   - Registration successful
   - Automatically redirected to Background Check Consent screen
5. Fill in consent form:
   - **Full Legal Name**: "Test Provider"
   - **Date of Birth**: "01/15/1990"
   - **SSN**: "123-45-6789"
   - Check both consent boxes
6. Tap "Submit for Background Check"
7. **Expected Result**: Confirmation alert appears
8. Tap "I Authorize"
9. **Expected Result**: Navigate to Background Check Status screen showing "In Progress"

### Test Scenario 6: Duplicate Email Registration
1. From Register screen, enter email that already exists: `john@example.com`
2. Fill in other fields
3. Tap "Sign Up"
4. **Expected Result**: Alert appears "Registration Error: Email already registered"

---

## Testing Internationalization (i18n)

### Available Languages
1. English (en)
2. Spanish (es)
3. Brazilian Portuguese (pt-BR)
4. European Portuguese (pt-PT)
5. Simplified Chinese (zh-CN)
6. Traditional Chinese (zh-HK)
7. Tagalog (tl)
8. Arabic (ar)
9. Vietnamese (vi)

### Test Scenario 7: Change Language to Spanish
1. Log in or register
2. Navigate to Profile tab
3. Find and tap Language Switcher (LanguageSwitcher component)
4. Select "Español (es)"
5. **Expected Result**:
   - All UI text changes to Spanish
   - Login screen: "Iniciar Sesión", "Correo", "Contraseña"
   - Background check screens fully translated

### Test Scenario 8: Background Check Screen in Different Languages
1. Register as a new provider (creates fresh background check flow)
2. Change language before or during background check process
3. Navigate through consent screen
4. **Expected Result**:
   - All labels translated: "Verificación de Antecedentes Penales" (Spanish)
   - Form labels translated: "Nombre Legal Completo", "Fecha de Nacimiento", "Número de Seguro Social"
   - Buttons translated: "Enviar para Verificación de Antecedentes"

### Test Scenario 9: Test All 9 Languages
For each language, verify:
1. Login screen text changes
2. Registration screen text changes
3. Background check consent screen text changes
4. Background check status screen text changes
5. Dashboard tab labels change
6. Navigation headers change

**Quick Language Test Checklist:**
- [ ] English - "Background Check" → stays "Background Check"
- [ ] Spanish - "Background Check" → "Verificación de Antecedentes"
- [ ] Portuguese (BR) - → "Verificação de Antecedentes"
- [ ] Portuguese (PT) - → "Verificação de Antecedentes"
- [ ] Chinese (CN) - → "背景调查"
- [ ] Chinese (HK) - → "背景調查"
- [ ] Tagalog - → "Pagsusuri ng Background"
- [ ] Arabic - → "فحص الخلفية" (verify RTL layout)
- [ ] Vietnamese - → "Kiểm tra lý lịch"

---

## Testing Database Persistence

### Test Scenario 10: Data Persistence Across Sessions
1. Register a new user: `persistent@test.com` / `testpass`
2. Close the app completely (force quit)
3. Reopen the app
4. Try to login with same credentials: `persistent@test.com` / `testpass`
5. **Expected Result**: Login successful (user data persisted in SQLite)

### Test Scenario 11: Verify Seeded Data
1. Login with any seeded provider (e.g., `john@example.com`)
2. Navigate to Provider Dashboard
3. **Expected Result**: See pre-populated data:
   - Profile has business name, services, portfolio images
   - Reviews are present
   - Subscription plan is set
   - Background check status is "clear"

---

## Testing Background Check Workflow

### Test Scenario 12: Complete Background Check Flow
1. Register as new provider
2. On Background Check Consent screen:
   - Verify all text is in selected language
   - Verify "What We Check" section shows 5 check types
   - Verify special focus on "Sex Offender Registry"
3. Fill form completely
4. Submit form
5. On Background Check Status screen:
   - Verify status banner shows "In Progress" (orange)
   - Verify provider name shows "Checkr" or "Sterling"
   - Verify 5 check result cards appear
   - Verify "Special focus: Sex crimes, pedophilia" warning on Sex Offender Registry card
6. **Expected Result**: All sections display correctly with proper translations

---

## Common Test Credentials

### Seeded Providers (all use password: `password123`)
1. **John Smith** - john@example.com
   - Business: Smith Cleaning Services
   - Status: Clear, Activated

2. **Maria Garcia** - maria@example.com
   - Business: Garcia Plumbing Pro
   - Status: Clear, Activated

3. **David Chen** - david@example.com
   - Business: Chen Electric Solutions
   - Status: Clear, Activated

### Seeded Customers (all use password: `password123`)
1. **Sarah Johnson** - sarah@example.com
2. **Michael Brown** - michael@example.com
3. **Emily Davis** - emily@example.com

---

## Debugging Tips

### View Console Logs
The app logs important database operations:
- "Initializing database..."
- "Database initialized"
- "Seeding database..."
- "Database seeding completed successfully"
- "Login error:" (if authentication fails)
- "Registration error:" (if registration fails)

### Check for Errors
If you see errors:
1. **"Database not initialized"**: App didn't wait for initialization
2. **"Email already registered"**: Trying to register duplicate email
3. **"Invalid email or password"**: Login credentials incorrect

### Reset Database
To completely reset and reseed:
1. Uninstall the app
2. Reinstall and relaunch
3. Database will be recreated with fresh mock data

### Language Not Changing?
1. Verify LanguageSwitcher component is accessible
2. Check console for i18n errors
3. Verify translation keys exist in all language files
4. Force refresh the app

---

## Performance Testing

### Test Scenario 13: Large Dataset Performance
1. Login with seeded user
2. Navigate through screens
3. **Expected Result**:
   - Database queries should be fast (<100ms)
   - No lag when switching screens
   - Smooth scrolling through lists

### Test Scenario 14: Multiple Language Switches
1. Switch between languages rapidly (5-10 times)
2. Navigate through different screens
3. **Expected Result**:
   - No memory leaks
   - No performance degradation
   - All text updates correctly

---

## Edge Cases to Test

### Test Scenario 15: Empty Fields
1. Try to submit login with empty email/password
2. Try to submit registration with missing required fields
3. Try to submit background check with missing SSN
4. **Expected Result**: Appropriate error messages appear

### Test Scenario 16: Invalid Data Format
1. Enter invalid email format: "notanemail"
2. Enter SSN with wrong length: "123"
3. Enter phone with letters: "abc-defg"
4. **Expected Result**: Validation prevents submission or shows error

### Test Scenario 17: Special Characters
1. Register with name containing special chars: "José María"
2. Register with email containing +: "test+alias@example.com"
3. **Expected Result**: Data saved correctly, login works

---

## Accessibility Testing

### Test Scenario 18: Screen Reader Support
1. Enable screen reader (TalkBack on Android, VoiceOver on iOS)
2. Navigate through login screen
3. Navigate through background check screens
4. **Expected Result**: All elements are properly labeled and readable

---

## Success Criteria Checklist

### Database ✓
- [ ] Database initializes on app start
- [ ] Mock data seeded successfully
- [ ] Users can register and data is saved
- [ ] Users can login with saved credentials
- [ ] User data persists across app restarts
- [ ] Proper error messages for duplicate emails

### Authentication ✓
- [ ] Login works with seeded credentials
- [ ] Login fails with wrong credentials
- [ ] Registration creates new user in database
- [ ] Password is hashed (not stored as plain text)
- [ ] Customer and Provider roles work correctly
- [ ] Background check flow triggers for new providers

### Internationalization ✓
- [ ] All 9 languages are selectable
- [ ] Login screen translates correctly
- [ ] Registration screen translates correctly
- [ ] Background check consent screen fully translated
- [ ] Background check status screen fully translated
- [ ] Language persists across navigation
- [ ] Special characters display correctly (Chinese, Arabic, etc.)
- [ ] RTL layout works for Arabic

---

## Reporting Issues

If you find any bugs, please report with:
1. **Steps to reproduce**
2. **Expected behavior**
3. **Actual behavior**
4. **Screenshots** (if applicable)
5. **Device/Platform** (iOS/Android, version)
6. **Language selected** (if i18n related)

---

## Next Steps After Testing

Once all tests pass:
1. Consider adding AsyncStorage for session persistence
2. Implement additional screens with i18n
3. Add more comprehensive error handling
4. Implement password reset functionality
5. Add biometric authentication (Face ID / Fingerprint)
6. Implement cloud database sync
7. Add data export/import functionality