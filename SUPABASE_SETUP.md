# Supabase Authentication Setup Guide

## ⚠️ Important: Production-Ready Setup

This authentication system now uses **Supabase for BOTH login and registration** (unified approach).

**What changed from hybrid approach:**
- ✅ Login → Supabase
- ✅ Register → Supabase  
- ❌ No local auth fallback (production-ready)

This ensures all users are in one system and prevents the "two separate user databases" problem.

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (or create account)
4. Click "New Project"
5. Fill in:
   - **Name**: onepacifichub
   - **Database Password**: (generate a strong password - save it!)
   - **Region**: Choose closest to your users
6. Click "Create new project" (takes ~2 minutes)

### Step 2: Get API Keys

1. In your Supabase dashboard, go to **Settings** (gear icon)
2. Click **API** in the sidebar
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

⚠️ **Security Note**: The `anon` key is safe for frontend. Never use `service_role` key in client code.

### Step 3: Configure Your App

1. Create a `.env` file in your project root:

```bash
# In the root folder (same level as package.json)
touch .env
```

2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**⚠️ Important**: Replace the values with your actual Supabase credentials!

### Step 4: Configure Email Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider (should be enabled by default)
3. **For Testing**: Disable email confirmation
   - Go to **Authentication** → **Settings**
   - Uncheck "Enable email confirmations"
   - Click **Save**
4. **For Production**: Re-enable email confirmations

### Step 5: Test Your Setup

1. Restart your development server:

```bash
npm run dev
```

2. Go to `/register` and create a test account
3. Try logging in at `/login`
4. Verify session persists on page reload

---

## 🚨 CRITICAL: Vercel Deployment Setup

**⚠️ Authentication will NOT work on Vercel without this step!**

### Add Environment Variables to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add both variables:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

5. Set for: **Production**, **Preview**, and **Development**
6. Click **Save**
7. **Redeploy** your application

**Important**: Environment variables in `.env` are only for local development. Vercel needs them configured separately.

---

## ✅ What's Working Now

- ✅ **Unified Authentication** - Both login and register use Supabase
- ✅ **Session Management** - Automatic token refresh
- ✅ **Persistent Sessions** - Users stay logged in
- ✅ **Logout** - Properly clears Supabase session
- ✅ **Password Security** - Passwords hashed by Supabase (never stored locally)
- ✅ **Error Handling** - Clear error messages

---

## 🔧 How It Works

### Login Flow

1. User enters email/password
2. System authenticates with Supabase
3. Supabase validates credentials and returns JWT token
4. Token stored in localStorage
5. User is redirected to intended page
6. Session automatically restored on page reload

### Registration Flow

1. User provides firstName, lastName, email, password
2. System creates account in Supabase
3. Password automatically hashed by Supabase (bcrypt)
4. User metadata (firstName, lastName) stored
5. JWT token returned and stored
6. User logged in automatically

### Session Persistence

- Supabase automatically manages session tokens
- Tokens are stored in localStorage
- Auto-refresh before expiration
- Session restored on page reload
- Logout clears both Supabase session and localStorage

### Security Features

- ✅ Passwords never stored locally
- ✅ Passwords hashed with bcrypt by Supabase
- ✅ JWT tokens with expiration
- ✅ Automatic token refresh
- ✅ Rate limiting on auth endpoints

---

## 📝 User Management in Supabase

### View Users

1. Go to **Authentication** → **Users** in Supabase dashboard
2. See all registered users
3. Manually verify users if needed
4. Delete or ban users

### User Metadata

When users register, we store:
- `firstName`
- `lastName`
- `email` (automatic)
- `id` (automatic)

Access in your app:
```javascript
const { user } = useAuth()
console.log(user.firstName, user.lastName)
```

---

## 🔐 Security Features

### Built-in Security

- ✅ Password hashing (automatic)
- ✅ JWT tokens with expiration
- ✅ Row Level Security (RLS) ready
- ✅ Rate limiting on auth endpoints
- ✅ Email verification (optional)
- ✅ Password reset flow

### Enable Email Verification

1. Go to **Authentication** → **Settings**
2. Enable "Enable email confirmations"
3. Users must verify email before login

### Configure Password Requirements

1. Go to **Authentication** → **Settings**
2. Set minimum password length
3. Configure password strength requirements

---

## 🎨 Customize Email Templates

### Confirmation Email

1. Go to **Authentication** → **Email Templates**
2. Click "Confirm signup"
3. Customize the template:

```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

### Password Reset Email

1. Click "Reset password"
2. Customize:

```html
<h2>Reset Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset password</a></p>
```

---

## 🚨 Troubleshooting

### "Supabase is not configured" Error

**Solution**: Make sure your `.env` file has the correct values:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

Restart your dev server after adding `.env` file.

### "Invalid login credentials" Error

**Possible causes**:
1. Wrong email/password
2. Email not verified (if verification is enabled)
3. User doesn't exist in Supabase

**Solution**: 
- Check Supabase dashboard → Authentication → Users
- Verify the user exists
- Manually verify email if needed

### Users Not Appearing in Supabase

**Cause**: Registration might be using local auth instead of Supabase

**Solution**: The current setup uses Supabase for **login only**. To use Supabase for registration too:

1. Update `src/context/AuthContext.jsx`
2. Change the `register` function to use `supabaseAuthService.registerWithSupabase()`

### Session Not Persisting

**Solution**:
1. Check browser localStorage (DevTools → Application → Local Storage)
2. Should see `sb-xxxxx-auth-token`
3. Clear localStorage and try again
4. Check browser console for errors

---

## 🔄 Migration from Local Auth

If you have existing users in local storage:

### Option 1: Manual Migration

1. Export users from localStorage
2. Create accounts in Supabase dashboard
3. Send password reset emails

### Option 2: Keep Both Systems

Current setup supports both:
- Supabase users → Login with Supabase
- Local users → Login with local auth (fallback)

---

## 📊 Database Setup (Optional)

### Create User Profiles Table

If you want to store additional user data:

1. Go to **SQL Editor** in Supabase
2. Run this SQL:

```sql
-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policy: Users can view their own profile
create policy "Users can view own profile"
  on profiles for select
  using ( auth.uid() = id );

-- Create policy: Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Create function to handle new user
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data->>'firstName',
    new.raw_user_meta_data->>'lastName'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 🌐 Production Deployment

### Environment Variables

Add to your hosting platform (Vercel, Netlify, etc.):

```
VITE_SUPABASE_URL=your-production-url
VITE_SUPABASE_ANON_KEY=your-production-key
```

### Update Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your production domain
3. Add **Redirect URLs** for OAuth callbacks

### Enable Production Mode

1. Go to **Settings** → **API**
2. Review rate limits
3. Enable additional security features

---

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [OAuth Providers](https://supabase.com/docs/guides/auth/social-login)

---

## 🎯 Next Steps

1. ✅ Set up Supabase project
2. ✅ Configure `.env` file
3. ✅ Test login flow
4. ⏳ Enable email verification (optional)
5. ⏳ Customize email templates
6. ⏳ Add OAuth providers (Google, GitHub)
7. ⏳ Set up user profiles table
8. ⏳ Configure Row Level Security

---

## 💡 Tips

- **Free Tier**: 50,000 monthly active users
- **Auto-scaling**: Handles traffic spikes automatically
- **Backup**: Automatic daily backups (paid plans)
- **Monitoring**: Built-in analytics dashboard
- **Support**: Active Discord community

---

**Your authentication is now powered by Supabase!** 🎉
