# CivicConnect — Civic Issue Reporting & Community Transparency Platform

> **"Your Neighborhood. Your Voice. Real Change."**  
> *A full-stack civic-tech web application built with ReactJS, Node.js, Express.js, MongoDB, Leaflet, and Recharts.*

---

### 🔗 Project Links

- 🌐 **Live Web Application (Vercel)**: [https://civicconnect-gilt.vercel.app/](https://civicconnect-gilt.vercel.app/)
- 📦 **GitHub Repository**: [https://github.com/ramkolipakula/waf-theory-assignment.git](https://github.com/ramkolipakula/waf-theory-assignment.git)

---

## 1. Problem Statement

In municipal districts and residential neighborhoods worldwide, citizens regularly encounter urgent civic issues:
- **Hazardous potholes and broken road pavements** that threaten vehicular and pedestrian safety.
- **Uncollected garbage heaps and illegal commercial dumping** that create severe public health hazards and pest infestations.
- **Dark, non-functioning streetlights** that compromise nighttime safety, particularly for women, children, and elderly residents.
- **Burst potable water mains and distribution pipeline fractures** that squander precious treated drinking water while reducing household pressure.
- **Uncovered manholes and overflowing sewerage lines** that cause flooding, property damage, and waterborne disease outbreaks.
- **Dilapidated public infrastructure**, such as broken bus shelter roofs and damaged park facilities.

Traditional grievance redressal systems suffer from a critical lack of **transparency, community engagement, and verifiable audit trails**. Complaints disappear into bureaucratic silos without tracking reference numbers, timeline visibility, or departmental accountability. Citizens have no mechanism to know whether an issue was acknowledged, assigned to a contractor, or verified upon completion.

**CivicConnect** solves this fundamental civic challenge by delivering an open, transparent, community-driven civic issue reporting and municipal governance platform. Citizens can report issues with photographic evidence and GPS coordinates, track live milestone timelines, and endorse neighboring complaints. Simultaneously, municipal administrators can triage reports, reassign specialized municipal departments, append audit notes, and visualize neighborhood infrastructure bottlenecks through real-time analytics.

---

## 2. Project Objectives

1. **Citizen Empowerment & Active Civic Participation**: Enable residents to quickly document and report local problems directly from mobile or desktop devices.
2. **Transparent Lifecycle Tracking**: Replace opaque complaint filing with an interactive, timestamped status timeline (`Reported` &rarr; `Acknowledged` &rarr; `In Progress` &rarr; `Resolved` &rarr; `Rejected`).
3. **Community Visibility & Collective Endorsement**: Allow neighbors to support reported issues, elevating critical neighborhood priorities to municipal administrators.
4. **Accountable Municipal Governance**: Provide municipal administrators with dedicated triage consoles, category-to-department routing, and resolution note publishing.
5. **Data-Driven Urban Planning**: Deliver interactive visualizations to analyze issue frequencies by category, severity, and neighborhood density.

---

## 3. Screenshots

The following actual screenshots were captured directly from the running CivicConnect application using a real browser instance:

### Landing Page — Desktop
![CivicConnect Landing Page Desktop](docs/screenshots/home-desktop.png)

### Landing Page — Mobile Viewport
![CivicConnect Mobile Interface](docs/screenshots/home-mobile.png)

### User Authentication & Role Selection
![CivicConnect Authentication](docs/screenshots/login.png)

### Citizen Dashboard
![Citizen Dashboard with Live Metrics](docs/screenshots/citizen-dashboard.png)

### Report a Civic Issue
![Civic Issue Submission Form with Map](docs/screenshots/report-issue.png)

### Community Issue Discovery & Explorer
![Explore Community Issues](docs/screenshots/explore-issues.png)

### Civic Issue Detail & Status Timeline
![Issue Details with Status Audit Trail](docs/screenshots/issue-details.png)

### My Submitted Reports (Citizen Management)
![My Reports Management Console](docs/screenshots/my-reports.png)

### Municipal Admin Dashboard & Analytics
![Municipal Admin Dashboard with Recharts](docs/screenshots/admin-dashboard.png)

### Municipal Admin Issue Management & Triage
![Admin Issue Management](docs/screenshots/admin-issue-management.png)

---

## 4. Key Features

### For Citizens
- **Responsive Public Portal**: Discover community issues, browse categories, and inspect city-wide resolution statistics without requiring an account.
- **Secure Registration & Authentication**: JWT-based session security with bcrypt password hashing; registration restricted exclusively to citizen accounts.
- **Comprehensive Issue Reporting**:
  - File reports with title, category, severity, detailed description, and street address.
  - Image upload with live client-side preview, file type validation (JPEG/PNG/WebP), and size caps (5MB).
  - Optional GPS detection with one click, paired with an interactive OpenStreetMap coordinate pin selector.
  - Automatic unique Complaint Reference ID generation (e.g., `#CC-849102`).
- **Community Issue Explorer**:
  - Full-text search across titles, descriptions, reference IDs, and street landmarks.
  - Multi-criteria filtering by Category, Status, Neighborhood, and Severity.
  - Sorting by Newest, Oldest, and Most Supported.
  - Interactive Map View toggle powered by Leaflet and OpenStreetMap tiles.
- **Issue Details & Lifecycle Tracker**:
  - Step-by-step visual audit trail displaying status transitions, actor identities, and timestamped progress notes.
  - Interactive community support toggle with duplicate endorsement prevention.
  - Public discussion thread with real-time comments and author role badges.
- **My Reports Dashboard**:
  - Comprehensive overview of personal reports categorized by triage state.
  - Live editing and withdrawal capabilities strictly permitted while issues remain in `Reported` status.

### For Municipal Administrators
- **Role-Protected Operations Center**: Server-side role authorization protecting all administrative routes and APIs.
- **Interactive Operations Analytics**:
  - Real-time MongoDB aggregation metrics for total reports, critical alerts, active triage, and resolution rates.
  - Recharts visualizations: Category distribution bar charts, Status proportion donut charts, and Neighborhood density breakdowns.
- **Issue Triage & Management Console**:
  - Multi-parameter search and filtration across all municipal reports.
  - Status update modal supporting transition to `Acknowledged`, `In Progress`, `Resolved`, or `Rejected`.
  - Mandatory audit notes appended to the public issue history.
  - Official resolution summary recording upon marking an issue as `Resolved`.
- **Department Routing & Reassignment**:
  - Automatic departmental suggestion based on category mapping.
  - Administrative override to reassign issues across specialized departments (Sanitation, Public Works, Electrical, Water Board, Drainage, Infrastructure).

---

## 5. Technology Stack

| Layer | Technology | Role & Purpose |
|---|---|---|
| **Frontend Framework** | **ReactJS 19 + Vite** | High-performance component-based client application with fast HMR |
| **Routing** | **React Router DOM v7** | Declarative client-side routing, protected routes, and deep links |
| **State Management** | **React Context API** | Global authentication (`AuthContext`) and toast notifications (`ToastContext`) |
| **Styling & Design System**| **Vanilla CSS3** | Custom design system with CSS custom properties, responsive grids, and sleek civic aesthetics |
| **Icons** | **Lucide React** | Modern, accessible iconography across all components |
| **Interactive Maps** | **Leaflet & OpenStreetMap** | Open-source geo-mapping, custom marker rendering, and location selection without paid API keys |
| **Data Visualization** | **Recharts** | Declarative SVG charting for admin analytics (Bar charts, Donut charts) |
| **Backend Runtime** | **Node.js (v24 LTS)** | Scalable asynchronous JavaScript server runtime |
| **Web Framework** | **Express.js (v4.21)** | RESTful API server, middleware pipeline, and route controllers |
| **Database** | **MongoDB (v7+)** | Document-oriented NoSQL database for flexible, indexed data persistence |
| **ODM** | **Mongoose (v8.9)** | Schema validation, relationship modeling, pre-save hooks, and aggregation pipelines |
| **Authentication** | **JWT (jsonwebtoken)** | Stateless Bearer token generation and verification middleware |
| **Password Security** | **bcryptjs** | Salted cryptographic password hashing |
| **File Uploads** | **Multer** | Multipart form data parsing, disk storage, and file validation |
| **Security Headers** | **Helmet & CORS** | Cross-Origin Resource Policy and secure HTTP response headers |

---

## 6. System Architecture

CivicConnect employs a decoupled client-server architecture following RESTful principles:

```mermaid
graph TD
    subgraph Client ["Frontend (ReactJS + Vite)"]
        UI["Modern UI / Responsive CSS"]
        Router["React Router DOM"]
        AuthCtx["Auth & Toast Contexts"]
        LMap["Leaflet Maps"]
        Charts["Recharts Visualizations"]
    end

    subgraph Server ["Backend (Node.js + Express.js)"]
        Middleware["Auth & Upload Middleware (JWT / Multer)"]
        Controllers["Controllers (Issues, Auth, Admin, Dashboard)"]
        Mongoose["Mongoose ODM Models"]
    end

    subgraph Database ["Persistence Layer"]
        Mongo[("MongoDB Database\n(Users, Issues, Comments, Depts)")]
        Storage[("Local / Cloud Uploads\n(/uploads/...)")]
    end

    UI --> Router
    Router --> AuthCtx
    AuthCtx -->|"REST API Requests (Axios / Bearer Token)"| Middleware
    Middleware --> Controllers
    Controllers --> Mongoose
    Controllers --> Storage
    Mongoose --> Mongo
```

---

## 7. Project Structure

```text
theory-assignment/
├── api/
│   └── index.js                   # Vercel serverless function entrypoint
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/            # StatusBadge, SeverityBadge, CategoryBadge, ProtectedRoute
│   │   │   ├── issues/            # IssueCard, IssueMap, StatusTimeline, CommentsSection
│   │   │   └── layout/            # Navbar, Footer
│   │   ├── context/               # AuthContext, ToastContext
│   │   ├── pages/                 # Home, Login, Register, CitizenDashboard, ReportIssue,
│   │   │                          # ExploreIssues, IssueDetails, MyReports, AdminDashboard,
│   │   │                          # AdminIssues, NotFound
│   │   ├── services/              # Axios API service client
│   │   ├── App.jsx                # Router setup & layout wrapper
│   │   ├── index.css              # Custom CSS design system
│   │   └── main.jsx               # React entrypoint
│   ├── index.html                 # SEO metadata & font imports
│   ├── package.json               # Client dependencies
│   └── vite.config.js             # Vite proxy configuration
├── docs/
│   └── screenshots/               # 10 real application screenshots
├── server/
│   ├── scripts/
│   │   ├── captureScreenshots.js  # Automated real browser capture script
│   │   └── seed.js                # Database seeder (Departments, Users, Issues, Comments)
│   ├── src/
│   │   ├── config/                # MongoDB connection logic (db.js)
│   │   ├── controllers/           # Auth, Issues, Comments, Departments, Dashboard controllers
│   │   ├── middleware/            # JWT Auth, Role authorization, Multer upload, Error handler
│   │   ├── models/                # User, Issue, Department, Comment Mongoose models
│   │   ├── routes/                # API route definitions
│   │   ├── app.js                 # Express application configuration
│   │   └── server.js              # Server bootstrapper & listener
│   ├── uploads/                   # Local image storage directory
│   ├── .env.example               # Environment variables template
│   └── package.json               # Backend dependencies
├── package.json                   # Root monorepo orchestration scripts
├── vercel.json                    # Vercel deployment configuration
└── README.md                      # Comprehensive documentation
```

---

## 8. Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher (Tested on Node v24.20.0)
- **npm**: v9.0.0 or higher (Tested on npm 11.19.0)
- **MongoDB**: Local MongoDB Server running on port `27017` or a MongoDB Atlas connection URI

---

## 9. Environment Variables

Create a `.env` file in the `server/` directory based on `server/.env.example`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/civicconnect

# JWT Authentication
JWT_SECRET=civicconnect_dev_jwt_secret_key_849204918237
JWT_EXPIRES_IN=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Default Seed Administrator Credentials
ADMIN_DEFAULT_EMAIL=admin@civicconnect.org
ADMIN_DEFAULT_PASSWORD=Admin@Civic2025!

# Image Upload Directory
UPLOAD_PATH=uploads
```

---

## 10. Database Seeding & Administrator Setup

The project includes an idempotent, comprehensive database seed script that populates the database with realistic municipal departments, authenticated accounts, and multi-category issues.

To seed the database:

```bash
cd server
npm run seed
```

### Pre-Seeded Evaluation Accounts

| Role | Name | Email Address | Password |
|---|---|---|---|
| **Municipal Admin** | Commissioner Sarah Jenkins | `admin@civicconnect.org` | `Admin@Civic2025!` |
| **Citizen (Core)** | Aarav Sharma | `aarav.sharma@example.com` | `Citizen@123456` |
| **Citizen (Greenwood)**| Priya Patel | `priya.patel@example.com` | `Citizen@123456` |
| **Citizen (Heights)** | Rahul Verma | `rahul.verma@example.com` | `Citizen@123456` |
| **Citizen (Lakeside)**| Ananya Sen | `ananya.sen@example.com` | `Citizen@123456` |

> **Convenience Feature**: On the `/login` page, you can click the **"Demo Citizen"** or **"Demo Admin"** quick-fill buttons to automatically test either role with zero manual typing!

---

## 11. Running the Application Locally

### Step 1: Install Dependencies
From the project root:
```bash
npm run install-all
```
*(Or navigate to `server/` and `client/` individually and run `npm install`)*

### Step 2: Seed the Database
```bash
npm run seed
```

### Step 3: Start the Backend Server
```bash
npm run server
```
*The Express REST API will start at `http://localhost:5000` (Health check: `http://localhost:5000/api/health`)*

### Step 4: Start the Frontend Client
In a separate terminal window:
```bash
npm run client
```
*The React Vite client will launch at `http://localhost:5173` with automatic API proxying.*

---

## 12. REST API Documentation

All API endpoints reside under the `/api` prefix. Protected endpoints require the HTTP header:  
`Authorization: Bearer <JWT_TOKEN>`

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Purpose | Request Body |
|---|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new Citizen (strictly enforces `citizen` role) | `{ name, email, password, neighborhood, phone }` |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token | `{ email, password }` |
| `GET` | `/api/auth/me` | Protected | Retrieve profile of authenticated user | None |
| `PATCH`| `/api/auth/profile`| Protected | Update citizen profile details | `{ name, neighborhood, phone }` |

### Civic Issues Endpoints (`/api/issues`)

| Method | Endpoint | Access | Purpose | Parameters / Payload |
|---|---|---|---|---|
| `GET` | `/api/issues` | Public | Retrieve issues with pagination, search & filters | Query: `search, category, status, neighborhood, severity, sort, page, limit` |
| `GET` | `/api/issues/:id` | Public | Retrieve detailed issue report by ID or referenceId | Param: `:id` (`ObjectId` or `CC-XXXXXX`) |
| `POST` | `/api/issues` | Citizen/Admin | Create new civic issue report (multipart or JSON) | Form: `title, category, severity, description, location, neighborhood, latitude, longitude, image` |
| `PATCH`| `/api/issues/:id` | Owner/Admin | Update issue details (restricted to `Reported` status for citizens) | Form/JSON: `title, description, location, severity, image` |
| `DELETE`| `/api/issues/:id`| Owner/Admin | Withdraw issue report (restricted to `Reported` status for citizens) | None |
| `POST` | `/api/issues/:id/support` | Protected | Endorse an issue (prevents duplicate support) | None |
| `DELETE`| `/api/issues/:id/support`| Protected | Remove support endorsement from an issue | None |
| `GET` | `/api/issues/:id/comments` | Public | Retrieve discussion thread for an issue | None |
| `POST` | `/api/issues/:id/comments` | Protected | Post comment on an issue | `{ content }` |

### Citizen Endpoints (`/api/users`)

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/users/me/issues` | Citizen/Admin | Retrieve all reports submitted by the logged-in user |

### Dashboard & Analytics Endpoints (`/api/dashboard`)

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/dashboard/citizen` | Citizen | Retrieve personalized counts (submitted, review, in-progress, resolved) |
| `GET` | `/api/dashboard/admin` | Admin Only | Retrieve global operational KPIs, category stats, and triage feed |

### Municipal Administration Endpoints (`/api/admin`)

| Method | Endpoint | Access | Purpose | Payload |
|---|---|---|---|---|
| `GET` | `/api/admin/issues` | Admin Only | Administrative issue listing with full audit data | Query filters |
| `PATCH`| `/api/admin/issues/:id/status` | Admin Only | Update issue status with timeline note | `{ status, notes, resolutionNotes }` |
| `PATCH`| `/api/admin/issues/:id/department` | Admin Only | Assign or reassign municipal department | `{ departmentId, notes }` |
| `GET` | `/api/admin/analytics` | Admin Only | Detailed Recharts-formatted distribution data | None |

### Municipal Department Endpoints (`/api/departments`)

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `GET` | `/api/departments` | Public | Retrieve active municipal departments with issue counts |
| `POST` | `/api/admin/departments` | Admin Only | Create new municipal department |
| `PATCH`| `/api/admin/departments/:id` | Admin Only | Update department information |
| `DELETE`| `/api/admin/departments/:id`| Admin Only | Delete department and unassign issues |

---

## 13. Testing and Verification Summary

During development and pre-deployment quality inspection, comprehensive verification was performed:

1. **Frontend Production Build**: Executed `npm run build` using Vite. Output verified in `client/dist/` with 0 syntax errors or bundling warnings.
2. **Backend Server Startup**: Bootstrapped Express backend with Morgan and Helmet middleware on port `5000`. Health endpoint `/api/health` verified with HTTP 200.
3. **Database Seeding**: Successfully seeded 6 municipal departments, 5 users (1 admin, 4 citizens), 10 multi-category civic issues, and 6 comments into local MongoDB.
4. **Authentication & Authorization**:
   - Tested `/api/auth/register` to confirm only `citizen` accounts can be registered.
   - Tested `/api/auth/login` and confirmed JWT issuance and password verification.
   - Tested role-protected `/api/admin/*` routes to confirm 403 Forbidden responses when accessed by standard citizen tokens.
5. **Issue CRUD & Lifecycle Rules**:
   - Created civic issue reports via `POST /api/issues`.
   - Verified that citizens can only edit or delete reports while in `Reported` status. Once acknowledged by an admin, modification attempts return HTTP 400.
   - Verified community support toggle and duplicate prevention in MongoDB.
6. **Real Browser Verification & Screenshots**:
   - Executed automated browser verification using headless Google Chrome (`puppeteer-core`).
   - Successfully navigated through every core application view and captured all 10 verified screenshot artifacts in `docs/screenshots/`.

---

## 14. Vercel Deployment Guide

CivicConnect has been configured for deployment on Vercel:

### Deployment Architecture
- **Static Frontend**: React client is compiled by Vite into static assets served globally via Vercel CDN.
- **Serverless API**: Backend Express routes are routed via `vercel.json` rewrites to `/api/index.js`, executing Express as a Vercel serverless function.
- **Cloud Database**: MongoDB Atlas cluster provides hosted database persistence.

### Prerequisites for Production Deployment
1. A [Vercel](https://vercel.com) account.
2. A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster:
   - Create a database user with read/write privileges.
   - In Atlas **Network Access**, add `0.0.0.0/0` (Allow access from anywhere) so Vercel's dynamic serverless IP ranges can connect.
   - Copy the MongoDB connection string (e.g., `mongodb+srv://user:pass@cluster0.mongodb.net/civicconnect?retryWrites=true&w=majority`).

### Environment Variables on Vercel
In your Vercel Project Settings &rarr; **Environment Variables**, add:
- `MONGODB_URI`: Your MongoDB Atlas connection string.
- `JWT_SECRET`: A secure 64-character random string.
- `JWT_EXPIRES_IN`: `7d`
- `NODE_ENV`: `production`

### Deployment Steps
1. Push your repository to your private GitHub/GitLab account.
2. In Vercel, click **"Add New Project"** and import the repository.
3. Keep default build settings (configured in root `vercel.json`):
   - **Framework Preset**: Vite
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/dist`
4. Set the Environment Variables listed above.
5. Click **Deploy**. Vercel will build the frontend and configure the serverless API routes.

### Live Deployment & Repository Information
- **Live Production URL**: [https://civicconnect-gilt.vercel.app/](https://civicconnect-gilt.vercel.app/)
- **GitHub Repository**: [https://github.com/ramkolipakula/waf-theory-assignment.git](https://github.com/ramkolipakula/waf-theory-assignment.git)

---

## 15. Academic Assignment Mapping

| Course Requirement | CivicConnect Implementation Details |
|---|---|
| **HTML5 & Semantic Structure** | Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<article>`) across all views. |
| **CSS3 & Responsive Design** | Custom Vanilla CSS design system with CSS custom properties, responsive breakpoints, fluid typography, and clean cards. |
| **JavaScript (ES6+)** | Modern ES modules, async/await, arrow functions, destructuring, and closures throughout client and server. |
| **ReactJS Architecture** | Functional components, custom hooks (`useAuth`, `useToast`), Context API state management, and reusable UI components. |
| **React Router** | Declarative client-side routing, protected routes (`ProtectedRoute`), dynamic parameter routes (`/issues/:id`), and 404 fallback. |
| **Node.js Runtime** | Scalable asynchronous server runtime executing Express controllers and background scripts. |
| **Express.js REST API** | RESTful routing across Auth, Issues, Comments, Departments, and Dashboard modules with centralized error handling. |
| **MongoDB & Mongoose** | Schema definitions for Users, Issues, Departments, and Comments with field validation, indexes, and aggregation pipelines. |
| **CRUD Operations** | Complete Create, Read, Update, and Delete operations for civic issues, comments, departments, and user profiles. |
| **Authentication & RBAC** | Stateless JWT authentication, bcrypt password hashing, and role-based access control (`citizen` vs `admin`). |
| **Vercel Deployment** | Fully deployed and live at [https://civicconnect-gilt.vercel.app/](https://civicconnect-gilt.vercel.app/) with root serverless function configuration. |
| **GitHub Repository** | Source code managed and versioned at [https://github.com/ramkolipakula/waf-theory-assignment.git](https://github.com/ramkolipakula/waf-theory-assignment.git). |
| **Documentation & Evidence**| Comprehensive root `README.md` embedding 10 real browser screenshots captured from the running application. |

---

## 16. Future Enhancements

- **AI-Powered Image Categorization**: Integrate Google Gemini Vision API to automatically inspect uploaded photos and suggest category/severity.
- **SMS & WhatsApp Alerts**: Integrate Twilio or municipal SMS gateways to notify citizens when an issue transitions to `Resolved`.
- **Municipal Work-Order Dispatch**: Direct integration with municipal ERPs for automatic contractor dispatch.
- **Offline PWA Support**: Progressive Web App service worker for logging complaints in low-connectivity areas.
- **Multilingual Support**: Real-time localization in regional languages to maximize citizen accessibility.

---

## License & Attribution

This project was built for academic evaluation demonstrating full-stack engineering proficiency in React, Node.js, Express, and MongoDB. Open-source imagery courtesy of Unsplash. OpenStreetMap tiles provided under the Open Database License (ODbL).
