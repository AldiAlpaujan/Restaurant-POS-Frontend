# Restaurant POS — Frontend

Frontend application for a Restaurant Point of Sale (POS) system built with React 19, TypeScript, and Vite.

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| UI Library | Mantine v8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Form & Validation | Mantine Form + Valibot |
| Icons | Tabler Icons |
| Date Handling | Day.js |

---

## Features

- **Guest Dashboard** — view table status without login
- **Authentication** — login with role-based access (Waiter / Cashier)
- **Dashboard** — floor plan & list view of tables with real-time status (Available, Occupied, Reserved, Inactive)
- **Order Management** — create, view, and add items to orders; close orders and download receipt PDF
- **Master Food** — CRUD for food/drink menu items with category management
- **Profile** — view logged-in user info
- **Receipt Download** — auto-download PDF receipt on order close

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- Backend API running (see backend repository)

---

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd restaurant-pos-fe
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy the example env file and fill in your backend URL:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

---

## Development

```bash
npm run dev
```

App runs at `http://localhost:5173` by default.

---

## Production Build

### 1. Create production env file

```bash
cp .env.example .env.production
```

Edit `.env.production`:

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

### 2. Build

```bash
npm run build
```

Output is in the `dist/` folder. Deploy it to any static hosting (Nginx, Vercel, Netlify, etc.).

### 3. Preview build locally

```bash
npm run preview
```

---

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API | `http://127.0.0.1:8000/api` |

> All env files (`.env`, `.env.*`) are gitignored. Use `.env.example` as a reference.

---

## Project Structure

```
src/
├── assets/          # Static assets (images, icons)
├── components/      # Reusable UI components
│   ├── AppLayout/   # Header, Sidebar, Wrapper
│   └── Shared/      # Generic components (Modal, KeyValue, etc.)
├── data/            # API service classes (OrderService, FoodItemService, etc.)
├── hooks/           # Custom React hooks
├── layouts/         # Page layout wrappers (AppLayout, AuthLayout, AppPage)
├── lib/             # Utilities (http-client, formatters, auth-token, etc.)
├── pages/           # Feature pages
│   ├── auth/        # Login
│   ├── dashboard/   # Table management dashboard
│   ├── master-food/ # Food CRUD
│   ├── order/       # Order list, create, detail
│   └── profile/     # User profile
├── routes/          # Router configuration
├── stores/          # React Context providers
├── themes/          # Mantine theme config
└── types/           # TypeScript type definitions
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run build-only` | Build without type-checking |
| `npm run lint` | Lint all files with ESLint |
| `npm run preview` | Preview production build locally |

---

## Deployment Notes

- The app is a fully static SPA — serve the `dist/` folder from any web server
- Configure your web server to redirect all routes to `index.html` for client-side routing

**Nginx example:**

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```
