# Loyalty Minimalist - Firebase MVP

A mobile-first loyalty system built with React, TypeScript, and Firebase. Supports stamps, points, and rewards with real-time synchronization.

## Features

- **Customer Features**:
  - Phone-based signup with E.164 validation
  - Real-time stamp and points tracking
  - Reward notifications and redemption
  - Token-based identification

- **Admin Features**:
  - Customer search and management
  - Quick actions (add stamps/points, issue rewards)
  - Business settings management
  - Data export capabilities
  - Live preview of customer experience

- **Technical Features**:
  - Real-time sync via Firestore
  - Atomic transactions for data integrity
  - Comprehensive audit logging
  - No demo data in production
  - Mobile-first responsive design

## Development Setup

### Prerequisites

- Node.js 18+
- Firebase CLI
- Firebase project with Firestore, Functions, and Hosting enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd loyalty-minimalist
```

2. Install dependencies:
```bash
npm install
cd functions && npm install && cd ..
```

3. Configure Firebase:
```bash
firebase login
firebase use <your-project-id>
```

4. Start development servers:
```bash
# Start Firebase emulators
firebase emulators:start

# In another terminal, start Vite dev server
npm run dev
```

### Environment Setup

The Firebase configuration is already included in `src/lib/firebase.ts`. For production, ensure your Firebase project has:

- Firestore database
- Cloud Functions
- Firebase Hosting
- Authentication (optional, for admin features)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run check-no-demo` - Verify no demo data in code
- `npm run seed-demo` - Seed demo data (requires ALLOW_DEMO_SEED=true)
- `npm run lint` - Run ESLint

## Deployment

### Deploy to Firebase

1. Build the project:
```bash
npm run build
```

2. Check for demo data:
```bash
npm run check-no-demo
```

3. Deploy:
```bash
firebase deploy
```

### Deploy Functions Only

```bash
firebase deploy --only functions
```

### Deploy Hosting Only

```bash
firebase deploy --only hosting
```

## Project Structure

```
src/
├── components/           # React components
│   ├── admin/           # Admin console components
│   └── ui/              # Reusable UI components
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── lib/                 # Firebase and utility functions
├── pages/               # Page components
└── types/               # TypeScript type definitions

functions/
├── src/
│   └── index.ts         # Cloud Functions
└── package.json

scripts/
├── check-no-demo.js     # Demo data checker
└── seed-demo.sh         # Demo data seeder
```

## Key Components

### Customer Flow

1. **Signup** (`/card`): Phone + name registration
2. **Loyalty Card** (`/card/:token`): View stamps, points, and rewards
3. **Rewards**: Real-time notifications when thresholds are met

### Admin Flow

1. **Dashboard**: KPIs and quick actions
2. **Customer Search**: Find and manage customers
3. **Settings**: Business information and configuration
4. **Data Export**: CSV exports for analysis

## Firebase Collections

- `users` - User profiles and tokens
- `customer_profile` - Preferences and onboarding state
- `customer_loyalty` - Stamps, points, and rewards
- `outlets` - Business settings and configuration
- `rewards` - Issued rewards and vouchers
- `modalEvents` - Real-time notification events
- `audit` - Comprehensive activity logging

## Security

- Firestore security rules prevent direct client writes to critical data
- All loyalty operations go through Cloud Functions
- Phone numbers validated and stored in E.164 format
- Audit logging for all actions

## Production Checklist

- [ ] Run `npm run check-no-demo` and ensure it passes
- [ ] Configure Firebase project settings
- [ ] Set up proper authentication for admin users
- [ ] Configure Firestore security rules
- [ ] Test all user flows end-to-end
- [ ] Verify real-time sync functionality
- [ ] Test export functionality

## Admin Access

To access admin features:

1. Open the hamburger menu
2. Click "Admin Login"
3. Navigate to `/admin`

In production, implement proper authentication for admin access.

## Support

For issues or questions, please check the Firebase documentation or create an issue in the repository.