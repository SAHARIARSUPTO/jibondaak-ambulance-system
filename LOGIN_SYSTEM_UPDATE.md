# Login System Update - User Type Selection

## ✅ What's New

### Dropdown Menu System
Login and Registration pages e dropdown menu add kora hoyeche jate user select korte pare:
1. **User / Patient** - Ambulance book korbe
2. **Ambulance Service Provider** - Ambulance service manage korbe

---

## 🎯 Features Added

### 1. Login Page (`/login`)
- ✅ Dropdown menu with 2 options
- ✅ User type selector (User or Provider)
- ✅ Dynamic icon display
- ✅ Smooth dropdown animation
- ✅ User type validation on login
- ✅ Dynamic signup link based on selected type

### 2. Registration Page (`/register`)
- ✅ Dropdown menu with 2 options
- ✅ User type selector (User or Provider)
- ✅ Dynamic form fields based on user type
- ✅ Additional fields for providers:
  - Company/Organization Name
  - License Number
- ✅ URL parameter support (`?type=provider`)
- ✅ Dynamic submit button text

### 3. Backend API Updates

#### Login API (`/api/auth/login`)
- ✅ Accepts `userType` parameter
- ✅ Validates user type matches account type
- ✅ Returns error if wrong type selected

#### Register API (`/api/auth/register`)
- ✅ Accepts `userType`, `companyName`, `licenseNumber`
- ✅ Validates provider-specific fields
- ✅ Stores user type in database

### 4. Database Model Update
- ✅ User model updated with:
  - `role` field (user, provider, admin)
  - `companyName` field (for providers)
  - `licenseNumber` field (for providers)

---

## 🎨 UI/UX Features

### Dropdown Design
- Professional gradient background
- Smooth animations
- Icon-based selection
- Descriptive text for each option
- Active state highlighting
- Hover effects

### Form Behavior
- Dynamic field visibility
- Conditional validation
- Smart placeholder text
- Icon indicators
- Responsive design

---

## 🔄 User Flow

### For Users (Patients)
1. Visit `/login`
2. Select "User / Patient" from dropdown (default)
3. Enter email and password
4. Click Login
5. Redirect to dashboard

### For Providers
1. Visit `/login`
2. Select "Ambulance Service Provider" from dropdown
3. Enter email and password
4. Click Login
5. Redirect to dashboard (provider view)

### Registration Flow
1. Visit `/register` or click signup link
2. Select user type from dropdown
3. Fill required fields
   - User: Name, Email, Phone, Password
   - Provider: Name, Company, License, Email, Phone, Password
4. Submit form
5. Redirect to login

---

## 📝 Technical Details

### Login Page State
```javascript
const [userType, setUserType] = useState("user"); // user or provider
const [showDropdown, setShowDropdown] = useState(false);
```

### Registration Page State
```javascript
const [userType, setUserType] = useState('user');
const [showDropdown, setShowDropdown] = useState(false);
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  companyName: '', // For providers
  licenseNumber: '' // For providers
});
```

### API Request Format

**Login:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "userType": "user" // or "provider"
}
```

**Register:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "phone": "01712345678",
  "password": "password123",
  "userType": "user", // or "provider"
  "companyName": "ABC Ambulance", // provider only
  "licenseNumber": "LIC-12345" // provider only
}
```

---

## 🎯 Validation Rules

### User Registration
- Name: Required, min 2 characters
- Email: Required, valid format
- Phone: Required, Bangladesh format
- Password: Required, min 6 characters
- Confirm Password: Must match password

### Provider Registration
- All user fields +
- Company Name: Required
- License Number: Required

### Login Validation
- Email: Required, valid format
- Password: Required, min 6 characters
- User Type: Must match account type in database

---

## 🔒 Security Features

- Password validation (min 6 characters)
- Email format validation
- Phone number format validation
- User type verification on login
- Error messages for wrong account type
- Form state management
- Loading states during API calls

---

## 📱 Responsive Design

- Mobile-friendly dropdown
- Touch-optimized buttons
- Responsive form layout
- Adaptive spacing
- Mobile-first approach

---

## ✅ Testing Checklist

- [x] User can select user type from dropdown
- [x] Dropdown closes after selection
- [x] Form fields update based on user type
- [x] Provider fields show only for providers
- [x] Login validates user type
- [x] Registration saves user type
- [x] Signup link updates based on selection
- [x] Error messages display correctly
- [x] Success messages work
- [x] Redirect works after login/register
- [x] No console errors
- [x] Responsive on all devices

---

## 🚀 Status: COMPLETE

All features implemented and tested. Login system now supports both User and Provider accounts with proper validation and UI/UX.

**Files Updated:**
1. `app/login/page.jsx` - Added dropdown menu
2. `app/register/page.jsx` - Added dropdown and provider fields
3. `app/api/auth/login/route.js` - Added user type validation
4. `app/api/auth/register/route.js` - Added provider field handling
5. `models/User.js` - Added provider fields to schema
