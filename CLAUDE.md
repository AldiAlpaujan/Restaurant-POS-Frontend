# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development server with HMR
npm run dev

# Type-check and build for production
npm run build

# Lint all files
npm run lint

# Preview production build
npm run preview
```

## Project Overview

This is an e-procurement system built with React, TypeScript, and Vite. The application supports two main user roles: **Employee** (internal procurement staff) and **Vendor** (external suppliers). Currently uses mock JSON data for development.

**Key Technologies:**
- **React 19** with React Compiler enabled (babel-plugin-react-compiler)
- **TypeScript** with strict mode
- **Vite 7** for build tooling
- **Mantine** UI component library
- **Tailwind CSS** for styling
- **ag-Grid** for data tables
- **React Router v7** with lazy loading
- **i18next** for internationalization (Indonesian as default)
- **Valibot** for form validation
- **Axios** for HTTP client

## Architecture

### Path Alias

The project uses `@/` as an alias for `./src/`:
```typescript
import { Component } from '@/components/...'
```

### Directory Structure

- **`/components`** - Reusable UI components
  - `AppLayout/` - Header, Sidebar, Wrapper components
  - `AppDataGrid/` - ag-Grid wrapper components
  - `AppTabs/` - Tab interface components
  - `Shared/` - Generic components (Modal, Combobox, FileView, Timeline, etc.)

- **`/pages`** - Page components organized by user role
  - `Auth/` - Login and password reset pages
  - `Employee/` - Employee features (ItemRequest, RFQ, FinalQuotation, MasterData, Settings, Profile)
  - `Vendor/` - Vendor portal (structure exists, not fully implemented)

- **`/routes`** - Route configuration
  - `routes.tsx` - Main router with lazy loading
  - `employee_routes.tsx` - Employee navigation
  - `vendor_routes.tsx` - Vendor navigation
  - `auth_routes.tsx` - Authentication flows

- **`/layouts`** - Layout wrappers and menu configuration
  - `AppLayout.tsx` - Main layout with sidebar
  - `AuthLayout.tsx` - Auth page layout
  - `AppPage.tsx` - Page header and breadcrumb wrapper
  - `AppViewState.tsx` - Loading/error state wrapper
  - `menu.ts` - Sidebar menu structure

- **`/stores`** - React Context-based state management
  - `ModalContext.tsx` - Global modal state
  - `AppLayoutContext.tsx` - Layout state (sidebar toggle)
  - Feature-specific contexts (e.g., `RFQContext.tsx`, `ItemRequestDetailContext.tsx`)

- **`/types`** - TypeScript type definitions
  - `employee/` - Domain types (RFQ, ItemRequest, FinalQuotation, etc.)
  - `submit-type.ts` - Form submission types
  - `grid-action.ts` - Grid action types

- **`/lib`** - Utility functions and configurations
  - `http-client.ts` - Axios instance with auth headers
  - `http-handlers.ts` - Error handling and response parsing
  - `modal-utlis.tsx` - Modal helpers
  - `toast-utils.tsx` - Toast notification helpers
  - `formatters.tsx` - Data formatting utilities
  - `variable.ts` - Constants (column widths, status options, grid types)
  - `auth-token.ts` - Token management
  - `function.tsx` - Common utility functions

- **`/hooks`** - Custom React hooks
  - `useDataGrid.tsx` - ag-Grid configuration hook
  - `useDataGridSource.tsx` - Data fetching for grids
  - `useFormGrid.tsx` - Form with embedded grid
  - `useActiveMenu.tsx` - Active menu tracking
  - `useIsMobile.tsx` - Responsive detection

- **`/data/mock-data`** - Mock JSON files for development
  - All API endpoints currently point to static JSON files
  - See `src/lib/http-client.ts` for endpoint mappings

- **`/themes`** - UI theme configuration
  - `theme.tsx` - Mantine theme setup
  - `grid-theme.ts` - ag-Grid theming
  - `variant-color-resolver.tsx` - Custom color variants

- **`/i18n`** - Internationalization setup
  - `i18n.ts` - i18next configuration
  - Translation files for Indonesian (default language)

### State Management

This project uses **React Context API** instead of Redux:
- Global state managed via Context providers in `/stores`
- Local state uses `use-immer` for immutable updates
- Form state managed by Mantine's `useForm` hook

### Form Handling Pattern

Forms use **Mantine Form** + **Valibot** for validation:
```typescript
import { useForm } from '@mantine/form';
import { valibotResolver } from 'mantine-form-valibot-resolver';
import { formValidator } from './validator/form-validator';

const form = useForm({
  validate: valibotResolver(formValidator),
  initialValues: { ... }
});
```

Validators are defined in feature-specific `validator/` directories using Valibot schemas.

### Data Grid Pattern

ag-Grid integration follows this flow:
1. `useDataGridSource` - Handles data fetching, pagination, filtering
2. `useDataGrid` - Configures grid settings and event handlers
3. `AppDataGrid` - Renders the grid component

Column definitions are stored in feature-specific `grid-column/` directories.

### Page Structure Convention

Feature pages follow this structure:
```
/pages/Employee/[Feature]/
  ├── [Feature]Page.tsx          # Main list/grid page
  ├── Create[Feature]Page.tsx    # Create form page
  ├── [Feature]DetailPage.tsx    # Detail view page
  ├── components/
  │   ├── Modal/                 # Feature-specific modals
  │   ├── [ComponentName].tsx    # Feature components
  ├── grid-column/               # ag-Grid column definitions
  ├── views/                     # Tab views for detail pages
  └── validator/                 # Valibot form validators
```

### Multi-Tab Detail Pages

Complex features (ItemRequest, RFQ) use `AppTabs` to organize detail views:
- General information tab
- Related data tabs (Required Items, Vendor List, etc.)
- Each tab is a separate component in the `views/` directory
- State is shared via feature-specific Context providers

### Modal Management

Global modal system via `ModalContext`:
- `openModal(id, options)` - Open modal with tracking ID
- `closeModal(id)` - Close specific modal
- `closeAllModal()` - Close all open modals
- Modal manager singleton (`src/lib/modal-manager.ts`) allows opening modals from non-React code

### API Communication

Currently using mock data:
- All endpoints defined in `src/lib/http-client.ts` in the `api` object
- Paths point to JSON files in `src/data/mock-data/`
- HTTP client configured with Bearer token authentication
- Error handling centralized in `src/lib/http-handlers.ts`

When integrating real APIs, update the `api` object endpoint URLs while keeping the same keys.

### Error Handling

The `http-handlers.ts` module provides centralized error handling:
- 401: Session expired → redirects to login
- 403: Permission denied → shows error modal
- 400/500: Server errors → displays error message
- All errors can trigger modals or callbacks

### View State Pattern

Use `AppViewState` component to handle loading/error states:
```typescript
<AppViewState viewState={viewState} callBackError={refetch}>
  {/* content renders when viewState === 'success' */}
</AppViewState>
```

### Utility Constants

`src/lib/variable.ts` contains centralized constants:
- **Column widths** for different data types (date, currency, status, etc.)
- **ag-Grid column types** (dateColumn, currencyColumn, statusColumn, etc.)
- **Status options** with colors for different features (ItemRequest, RFQ, etc.)
- Use these constants to maintain consistency across the application

## Important Conventions

1. **Route Lazy Loading**: All page components use the `lazyPage()` helper in `routes.tsx`
2. **Imports**: Use `@/` path alias for all internal imports
3. **Icons**: Use Tabler Icons via `@tabler/icons-react`
4. **Date Handling**: Use `dayjs` for date manipulation
5. **Styling**: Combine Mantine components with Tailwind utility classes
6. **Authentication**: Token stored and managed via `src/lib/auth-token.ts`
7. **Password Hashing**: Uses SHA256 via `crypto-js`

## React Compiler

This project has the React Compiler (babel-plugin-react-compiler) enabled, which automatically optimizes React components. This may impact Vite dev and build performance but improves runtime performance.
