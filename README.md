# CloudVault - Secure Cloud Storage Application

A professional, production-ready cloud storage application built with React, Firebase, and modern web technologies.

## 🌟 Overview

CloudVault is a complete cloud storage solution featuring enterprise-grade security, intuitive interface, and comprehensive file management capabilities. The application includes user authentication, file operations, sharing, and account management all with a modern, professional design.

## ✨ Key Features

### User Management
- **Registration**: Create new accounts with email and password
- **Authentication**: Secure login with Firebase Authentication
- **Password Reset**: Email-based password recovery
- **Account Settings**: Manage password and user token
- **Account Deletion**: Permanently delete account and all files

### File Management
- **Upload**: Support for files up to 5GB
- **Download**: Direct file downloads to your device
- **Delete**: Permanent file deletion with confirmation
- **List**: View all uploaded files with metadata (size, date)
- **Storage Tracking**: Real-time storage usage display

### File Sharing
- **Share Links**: Generate expirable share links for files
- **Public Access**: Access shared files without login
- **Token-based**: Secure tokens for share links
- **Expiration Control**: Set custom link expiry times (1 hour to 1 month)

### Security
- ✅ Email/Password Authentication (Firebase Auth)
- ✅ Strict Firestore Security Rules
- ✅ User Data Isolation
- ✅ Cloud Storage Access Control
- ✅ No SQL Injection (NoSQL only)
- ✅ XSS Protection (React built-in)
- ✅ CSRF Protection (Firebase built-in)
- ✅ Secure Password Hashing (Firebase managed)
- ✅ Encrypted Data Transmission (HTTPS)

## 📁 Project Structure

```
client/
├── pages/
│   ├── Index.tsx              # Landing page with hero section
│   ├── Login.tsx              # Login authentication page
│   ├── Register.tsx           # Account registration page
│   ├── Dashboard.tsx          # Main cloud storage dashboard
│   ├── Settings.tsx           # Account settings & management
│   ├── ResetPassword.tsx      # Password reset page
│   ├── SharedFile.tsx         # Public shared file view
│   └── NotFound.tsx           # 404 Not Found page
│
├── components/
│   ├── ProtectedRoute.tsx     # Authentication guard for routes
│   ├── Header.tsx             # Navigation header & user menu
│   ├── FileCard.tsx           # File card with actions
│   └── ShareModal.tsx         # File sharing modal
│
├── lib/
│   ├── firebase.ts            # Firebase configuration
│   ├── authContext.tsx        # Authentication context & hooks
│   └── fileUtils.ts           # File operations utilities
│
├── components/ui/             # Pre-built shadcn components
├── hooks/                     # Custom React hooks
├── App.tsx                    # Main app & routing
├── global.css                 # Professional color scheme
└── vite-env.d.ts             # Vite environment types

firestore.rules               # Firestore security rules
SETUP.md                      # Setup & installation guide
README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- pnpm (recommended) or npm
- Firebase account

### Installation

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Configure Firebase** (See SETUP.md for detailed instructions)
   - Create Firebase project
   - Enable Authentication, Firestore, Storage
   - Update `client/lib/firebase.ts` with your config

3. **Set Up Security Rules** (See firestore.rules)
   - Configure Firestore rules
   - Configure Cloud Storage rules

### Development

```bash
pnpm dev
```

App will be available at `http://localhost:5173`

### Production Build

```bash
pnpm build
pnpm start
```

## 🏗️ Technology Stack

- **Frontend**: React 18, React Router 6, TypeScript
- **Styling**: Tailwind CSS 3, Professional color scheme
- **Backend**: Firebase (Auth, Firestore, Storage)
- **Build Tool**: Vite
- **UI Components**: Radix UI, Lucide Icons
- **State Management**: React Context API
- **HTTP Client**: Fetch API

## 📖 User Flow

### Registration & Login
1. User visits landing page
2. Click "Sign Up" to create account
3. Enter email and password
4. Account created, automatically logged in
5. Redirected to Dashboard

### File Upload
1. User in Dashboard clicks upload area
2. Select one or multiple files
3. Files uploaded to Cloud Storage
4. Progress bar shows upload status
5. Files appear in file list immediately

### File Download
1. In Dashboard, find file
2. Click three-dot menu
3. Select "Download"
4. File downloads to device

### File Sharing
1. Click three-dot menu on file
2. Select "Share"
3. Choose link expiry time
4. Copy generated share link
5. Share link with others
6. Others can download without login

### Account Management
1. Click profile in header
2. Select "Settings"
3. Change password or regenerate token
4. Or delete entire account

## 🔐 Security Details

### Authentication
- Firebase Authentication handles user registration & login
- Passwords never stored in Firestore
- Automatic session management
- Secure token generation for sharing

### Data Protection
- Firestore rules enforce user-level isolation
- Users can only read/write their own data
- Cloud Storage rules prevent cross-user access
- All data encrypted in transit (HTTPS)

### File Storage
- Files stored in user-specific directories
- Unique file IDs prevent collision
- File metadata tracked in Firestore
- Storage size tracking per user

### Share Links
- Random token generation (36-bit strings)
- Expiry time enforcement
- Single-use link generation per file
- No user enumeration possible

## 📊 API Endpoints (Future Backend)

```
POST   /auth/register          # Create account
POST   /auth/login             # Login user
GET    /auth/refresh-token     # Refresh auth token
POST   /user/token/regenerate  # Generate new share token
POST   /files/upload           # Upload file
GET    /files/list             # List user files
GET    /files/download/:id     # Download file
DELETE /files/delete/:id       # Delete file
POST   /files/share/create     # Create share link
GET    /files/share/resolve    # Access shared file
```

## 🎨 Design System

### Color Palette
- **Primary**: Professional Blue (#1D4ED8)
- **Background**: Clean White (#FFFFFF)
- **Text**: Dark Gray (#1F2937)
- **Borders**: Light Gray (#E5E7EB)
- **Destructive**: Red (#DC2626)

### Typography
- **Font**: Inter (system-ui fallback)
- **Headings**: Bold, tight tracking
- **Body**: 400-500 weight, readable line-height

### Components
- Rounded corners (0.5rem radius)
- Subtle shadows for depth
- Smooth transitions (0.2s ease)
- Responsive grid layouts

## 📱 Responsive Design

- **Mobile**: Single column, touch-friendly
- **Tablet**: Two columns, optimized spacing
- **Desktop**: Three-column grid, full features

All pages are fully responsive and tested on various screen sizes.

## 🔄 State Management

Uses React Context API for:
- Authentication state
- User profile data
- File list management
- Error handling
- Loading states

No Redux needed for this application size.

## 🚀 Deployment Options

### Netlify
```bash
pnpm build
netlify deploy --prod
```

### Vercel
```bash
pnpm build
vercel --prod
```

### Self-Hosted
```bash
pnpm build
pnpm start
```

## 📝 Configuration Files

- `tailwind.config.ts` - Tailwind CSS customization
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `firestore.rules` - Security rules
- `.env` - Environment variables (if needed)

## 🐛 Troubleshooting

### Upload fails
- Check Cloud Storage rules are configured
- Verify file size < 5GB
- Check Firebase quota

### Login doesn't work
- Ensure Authentication is enabled in Firebase
- Check email exists in Firebase Console
- Try password reset

### Files not visible
- Check Firestore rules are deployed
- Verify user is authenticated
- Check browser console for errors

## 📚 Documentation

- [Firebase Docs](https://firebase.google.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- See SETUP.md for detailed setup instructions

## 🔄 Future Enhancements

- [ ] Two-factor authentication
- [ ] File versioning / trash
- [ ] Advanced sharing (view-only, edit permissions)
- [ ] File preview (images, PDFs)
- [ ] Drag-and-drop folders
- [ ] Bulk operations
- [ ] Activity logs
- [ ] Bandwidth tracking
- [ ] API access tokens
- [ ] SAML/OAuth integration

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Support

For issues or questions:
1. Check SETUP.md for configuration help
2. Review Firebase documentation
3. Check browser console for errors
4. Verify all security rules are deployed

---

**CloudVault v1.0** - Built with ❤️ for secure file storage
