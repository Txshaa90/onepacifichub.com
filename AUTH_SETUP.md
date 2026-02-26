# Authentication Setup Guide

## Quick Start (Frontend-Only Auth)

### 1. Install Dependencies (Optional but Recommended)

```bash
npm install js-cookie
npm install react-hook-form
npm install zod
```

### 2. Features Included

✅ User Registration with validation
✅ User Login with JWT simulation
✅ Protected Routes
✅ Persistent Sessions (localStorage)
✅ Password strength validation
✅ Email validation
✅ User profile management
✅ Logout functionality
✅ Remember me option

### 3. Current Implementation

The authentication system uses:
- **AuthContext** for global auth state
- **localStorage** for session persistence
- **Protected Routes** for secure pages
- **Form validation** with proper error handling

### 4. Upgrade to Production (Backend Required)

To make this production-ready, you'll need:

#### Backend Options:

**A. Node.js + Express + MongoDB**
```bash
# Backend setup
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv
```

**B. Firebase Authentication**
```bash
npm install firebase
```

**C. Supabase (Recommended - Easy Setup)**
```bash
npm install @supabase/supabase-js
```

**D. Auth0 (Enterprise)**
```bash
npm install @auth0/auth0-react
```

---

## 🔧 Backend Integration Guide

### Option A: Node.js + Express Backend

#### 1. Create Backend Server

**File: `server/server.js`**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Register Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Token Middleware
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get Current User
app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**File: `.env`**
```
MONGODB_URI=mongodb://localhost:27017/onepacifichub
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

---

### Option B: Supabase (Easiest - Recommended)

#### 1. Setup Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get your API keys from Settings > API

#### 2. Install Supabase

```bash
npm install @supabase/supabase-js
```

#### 3. Create Supabase Client

**File: `src/lib/supabase.js`**
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

#### 4. Update AuthContext for Supabase

```javascript
import { supabase } from '../lib/supabase'

// Register
const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

// Login
const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

// Logout
const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}
```

**File: `.env`**
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

### Option C: Firebase Authentication

#### 1. Setup Firebase

```bash
npm install firebase
```

#### 2. Create Firebase Config

**File: `src/lib/firebase.js`**
```javascript
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
```

---

## 🔒 Security Best Practices

1. **Never store passwords in plain text**
2. **Use HTTPS in production**
3. **Implement rate limiting**
4. **Add CSRF protection**
5. **Validate all inputs**
6. **Use secure JWT secrets**
7. **Implement refresh tokens**
8. **Add email verification**
9. **Enable 2FA (optional)**
10. **Log authentication attempts**

---

## 📝 Next Steps

1. Choose your backend option (Supabase recommended for quick setup)
2. Update the AuthContext with real API calls
3. Add email verification
4. Implement password reset
5. Add OAuth providers (Google, GitHub)
6. Set up proper error handling
7. Add loading states
8. Implement refresh tokens
9. Add user profile editing
10. Set up proper session management

---

## 🎯 Current Status

✅ Frontend authentication UI complete
✅ Form validation implemented
✅ Protected routes working
✅ Session persistence active
⏳ Backend integration needed
⏳ Email verification pending
⏳ Password reset pending
⏳ OAuth integration pending

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [JWT Best Practices](https://jwt.io/introduction)
- [OWASP Auth Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
