# Bhausri Bezawada — Personal Portfolio Platform

A dynamic, production-ready personal portfolio platform architected and developed for **Bhausri Bezawada**. The application blends modern engineering accomplishments, digital marketing leadership, and technical capabilities into a database-driven digital identity with Firebase authentication, Firestore data persistence, Cloudinary media management, and an administration console at `/admin`.

---

## 🌟 Key Platform Features

- **Mobile-First Luxury UI/UX**:
  - Refined typography via Google Fonts (Plus Jakarta Sans).
  - Centralized design tokens with dark mode, light mode, and system preference detection.
  - Interactive glassmorphic cards, smooth anchor navigation, and responsive touch targets.
  - Verified hero portrait asset preserved from original photograph with ambient glow framing.
  - Zero hardcoded presentation records; 100% database-driven via Cloud Firestore.

- **Dynamic Public Portfolio**:
  - **Smart Header & Navigation**: Sticky navigation, active section indicators, theme switcher, and mobile drawer.
  - **Hero Section**: Verified portrait, professional headline, availability status pill, resume download, and contact CTAs.
  - **About Section**: Factual introduction, career objective from resume, and strengths.
  - **Skills Section**: Categorized toolkit (Programming, Web Development, Digital Marketing, Creative & Productivity, Technical Tools).
  - **Education Section**: Verified academic timeline with CGPA records (SRGEC B.Tech EEE - 7.8, Narayana Jr College MPC - 8.0, SSC - 9.3).
  - **Experience & Internships**: Verified experience as Social Media Manager, Machine Learning Internship at Smart Bridge, and Energy Audit & Management Internship at BIGETA Energy Solutions.
  - **Projects Showcase**: Engineering prototypes (*Ultracapacitor-Based EV Charging Prototype*, *LED Distance Indicator*, *Solar Tracker*) with search, category filters, and detailed specification modals.
  - **Adaptive Media Gallery**: Multi-category media showcase with full-screen lightbox viewing.
  - **Resume Portal**: Direct preview and download of the official curriculum vitae (`Bhanu _ resume 1.pdf`, 218 KB).
  - **Secured Contact Portal**: Inquiry form with spam protection, storing messages directly in Firestore, plus click-to-email, WhatsApp, and phone links.
  - **Footer**: Verified social links and dynamic copyright.

- **Firebase Authentication & Authorization**:
  - Email/Password login & registration.
  - One-click Google sign-in.
  - Password reset delivery.
  - Role-based route guard preventing unauthorized visitors from accessing `/admin`.
  - Configured for verified admin UID `rcbd1D9HHRPjSVMFrwnCNy0frYm1` and email `bhanubezawada1@gmail.com`.

- **Protected Admin Console (`/admin`)**:
  - **Live Metrics**: Real database counts for published/draft projects, academic records, internships, gallery assets, and inquiries.
  - **One-Click Data Seeder**: Initializes Firestore with verified resume records without overwriting customized live entries.
  - **Full CRUD Management**: Create, edit, publish/unpublish, and delete projects, skills, education, internships, and gallery assets.
  - **Inquiry Management**: Inbox to read incoming inquiries, toggle read/resolved states, reply via email, and delete spam.
  - **Website Settings**: Real-time control over branding, contact details, social URLs, and section visibility toggles.
  - **Cloudinary Media Manager**: Direct file upload with progress tracking and secure delivery URL extraction.

- **Security & Infrastructure**:
  - Production `firestore.rules` enforcing least privilege (public read on published records, admin-only writes, validated contact form submissions).
  - `firestore.indexes.json` configured for query ordering and filtering.
  - `firebase.json` preconfigured with SPA rewrites and asset caching headers.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, React Router DOM |
| **Backend & Identity** | Firebase Authentication, Cloud Firestore |
| **Media Delivery** | Cloudinary (Direct unsigned upload preset) |
| **Testing** | Node test runner (`node --test`), TypeScript type checking (`tsc -b`) |
| **Hosting** | Firebase Hosting |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or later (v24 recommended)
- **npm**: v9.0.0 or later

### 2. Installation
```bash
# Clone or navigate to the repository directory
cd portfolio

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure your `.env` contains:
```env
VITE_FIREBASE_API_KEY=AIzaSyCk74217K7n1nx2p0GRYhZfZFKrsRB5iT0
VITE_FIREBASE_AUTH_DOMAIN=portfolio-814e4.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=portfolio-814e4
VITE_FIREBASE_STORAGE_BUCKET=portfolio-814e4.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=25324015481
VITE_FIREBASE_APP_ID=1:25324015481:web
VITE_FIREBASE_MEASUREMENT_ID=G-11GJ5GQP07

VITE_CLOUDINARY_CLOUD_NAME=dw1a87ipd
VITE_CLOUDINARY_UPLOAD_PRESET=portfolio

VITE_ADMIN_UID=rcbd1D9HHRPjSVMFrwnCNy0frYm1
VITE_ADMIN_EMAIL=bhanubezawada1@gmail.com
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Running the Automated Tests
```bash
npm test
```

### 6. Building for Production
```bash
npm run build
```
Generates an optimized bundle in `dist/` with code-split chunks for high Core Web Vitals performance.

---

## 🔒 Administration & Initial Database Seeding

1. Start the application and visit `/login`.
2. Sign in with the administrator Google account or register using `bhanubezawada1@gmail.com`.
3. Navigate to `/admin`.
4. On the **Overview** tab, click **"Seed Verified Records"**.
   - This writes the verified records (education, internships, projects, skills, and site settings) into your Firestore database.
   - If records already exist, seeding safely preserves your modifications without overwriting.

---

## 🛡️ Firebase Security Rules Deployment

To deploy the security rules to your Firebase project:
```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules and indexes
firebase deploy --only firestore:rules,firestore:indexes
```

---

## ☁️ Cloudinary Upload Configuration

- **Cloud Name**: `dw1a87ipd`
- **Upload Preset**: `portfolio`
- In your Cloudinary console (**Settings > Upload > Upload presets**), verify that `portfolio` is set to **Unsigned** mode for direct frontend media uploads.

---

## 📁 Repository Structure

```
portfolio/
├── dist/                      # Production build output
├── public/
│   └── assets/
│       ├── bhausri_portrait.jpg  # Verified portrait image
│       └── bhanu_resume.pdf     # Official resume PDF (218 KB)
├── src/
│   ├── app/                   # App root
│   ├── components/
│   │   ├── admin/             # Admin console modules (CRUD, Inquiries, Media)
│   │   ├── common/            # Buttons, Modals, Badges, Skeletons, EmptyStates
│   │   ├── layout/            # Navbar, Footer, ProtectedRoute
│   │   └── portfolio/         # Hero, About, Skills, Education, Projects, etc.
│   ├── config/                # Firebase and Cloudinary configuration
│   ├── context/               # AuthContext, ThemeContext
│   ├── data/                  # Verified initial seed datasets
│   ├── pages/                 # HomePage, LoginPage, AdminPage
│   ├── repositories/          # Firestore data access layer
│   ├── services/              # Cloudinary upload and Auth services
│   ├── styles/                # index.css with design tokens & Tailwind
│   └── types/                 # Shared TypeScript models
├── test/                      # Automated domain integrity tests
├── .env                       # Environment configuration
├── .env.example               # Template environment configuration
├── firebase.json              # Firebase Hosting SPA rewrite & caching
├── firestore.indexes.json     # Firestore composite query indexes
├── firestore.rules            # Production Firestore security rules
├── package.json
├── tsconfig.json
└── vite.config.ts
```
