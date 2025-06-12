
# Obi-Wan-Shop: AI-Powered E-commerce Platform

Obi-Wan-Shop is a modern e-commerce application designed to provide a personalized shopping experience through AI-driven style recommendations. This project consists of a Next.js frontend and is intended to be powered by a Laravel REST API backend.

## Tech Stack

**Frontend:**
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI Library:** React
- **Component Library:** ShadCN UI
- **Styling:** Tailwind CSS
- **State Management:** React Context API (Auth, Cart, Favorites)
- **AI Integration (Planned):** Genkit for style recommendations (currently mocked, to be integrated with Laravel backend for AI logic).
- **Forms:** React Hook Form with Zod for validation
- **API Communication:** Fetch API (via a centralized service at `src/lib/api.ts`)

**Backend (Conceptual - to be built with Laravel):**
- **Framework:** Laravel
- **Language:** PHP
- **Database:** MySQL / PostgreSQL (or your preferred relational DB)
- **Authentication:** Laravel Sanctum (for SPA) or Passport (for API tokens)
- **API:** RESTful API design

## Frontend Setup & Key Next.js Features (This Application)

This Next.js application leverages several modern features to provide a robust and performant frontend experience:

### 1. Next.js App Router
The project uses the Next.js App Router, which offers:
- **Improved Performance:** Through features like Server Components and intelligent data fetching.
- **Nested Layouts:** Allowing for complex UI structures where sections of a page can have their own layouts and remain interactive while others re-render (e.g., `src/app/(app)/layout.tsx` for the main application, `src/app/(admin)/layout.tsx` for the admin panel).
- **Route Groups:** Used to organize routes without affecting the URL path (e.g., `(app)`, `(admin)`).
- **File-System Routing:** Pages are created by adding `page.tsx` files within directories under `src/app`. For example, `src/app/(app)/products/page.tsx` maps to the `/products` URL.

### 2. Server Components & Client Components
- **Server Components by Default:** Most components are Server Components, meaning they render on the server. This reduces the amount of JavaScript sent to the client, leading to faster initial page loads and better SEO.
- **Client Components (`"use client"`):** Components requiring interactivity (e.g., using `useState`, `useEffect`, event handlers like `onClick`) are explicitly marked with `"use client"`. These components are pre-rendered on the server and then hydrated on the client for interactivity. Examples include forms, interactive product cards, and context providers.

### 3. Server Actions (Conceptual for this project)
- While the primary data mutations are intended to go through the Laravel API, Next.js Server Actions offer a way to handle form submissions and data mutations directly from Server Components or Client Components without manually creating API endpoints within Next.js. This can be useful for frontend-specific actions or simpler mutations if not requiring complex backend logic. For this project, server-side logic is primarily delegated to the Laravel backend.

### 4. TypeScript Integration
- The project is written in TypeScript, providing:
  - **Type Safety:** Catching errors during development rather than at runtime.
  - **Improved Developer Experience:** Better autocompletion and code navigation.
  - **Maintainability:** Clearer code contracts and easier refactoring.
- Type imports (`import type { ... } from '...'`) are used to ensure types are only imported for type checking and don't add to the runtime bundle.

### 5. Image Optimization (`next/image`)
- The built-in `next/image` component is used for displaying images (e.g., in `ProductCard`, `HeroCarousel`). It provides:
  - **Automatic Optimization:** Resizing, optimizing, and serving images in modern formats like WebP.
  - **Lazy Loading:** Images are loaded only when they enter the viewport, improving initial page load performance.
  - **Preventing Layout Shift:** Ensures space is reserved for images before they load.
- Placeholder images are sourced from `https://placehold.co` and include `data-ai-hint` attributes for potential AI-driven image replacement.

## Installation

### Prerequisites
- Node.js (v18 or later recommended)
- npm, yarn, or pnpm

### Frontend (This Application)
1. **Clone the repository (if applicable):**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```
   If you are already in the project directory, skip this step.

2. **Install dependencies:**
   Choose your preferred package manager:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

### Environment Variables
Create a `.env.local` file in the root of the frontend project and add the following:

```env
NEXT_PUBLIC_LARAVEL_API_URL=http://your-laravel-api-url.test/api
# Example: http://localhost:8000/api if Laravel runs locally on port 8000
```
Replace `http://your-laravel-api-url.test/api` with the actual URL of your Laravel backend API.

### Running the Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```
The application will typically be available at `http://localhost:9002` (as per your `package.json`).

### Building for Production
```bash
npm run build
npm start
```

## Backend Setup (General Guidance for Laravel API)

This section provides general steps for setting up the conceptual Laravel backend.

### Prerequisites
- PHP (latest stable version recommended)
- Composer
- A database server (e.g., MySQL, PostgreSQL)

### Installation (Conceptual)
1. Create a new Laravel project or clone your existing one.
   ```bash
   composer create-project laravel/laravel obiwanshop-api
   cd obiwanshop-api
   ```
2. Install Laravel Sanctum (if using SPA authentication):
   ```bash
   composer require laravel/sanctum
   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
   ```
3. Install other necessary packages.
4. Configure your `.env` file in the Laravel project:
   - Database credentials (`DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`)
   - Application URL (`APP_URL`)
   - Session domain (important for Sanctum SPA cookies, e.g., `SESSION_DOMAIN=.yourdomain.test` if frontend is on `app.yourdomain.test` and backend on `api.yourdomain.test`)
   - CORS settings (`SANCTUM_STATEFUL_DOMAINS`, `CORS_ALLOWED_ORIGINS` - should include your Next.js frontend URL)
5. Run database migrations:
   ```bash
   php artisan migrate
   ```
6. (Optional) Seed the database:
   ```bash
   php artisan db:seed
   ```
7. Generate application key:
   ```bash
   php artisan key:generate
   ```

### Running the Laravel Development Server
```bash
php artisan serve
```
Typically available at `http://localhost:8000`.

### CORS Configuration
Ensure your Laravel `config/cors.php` is configured to accept requests from your Next.js frontend domain. For Sanctum SPA authentication, ensure `supports_credentials` is `true` and your frontend domain is in `allowed_origins`.

## Key Frontend Features

- **User Authentication:**
  - Sign In / Sign Up for regular users.
  - Separate Admin Sign In.
  - OTP verification and password reset flows (mocked).
- **Product Discovery:**
  - Product listing page with filtering (search, category, price) and sorting, fetching from Laravel API.
  - Product detail pages.
  - Category browsing page.
- **Shopping Experience:**
  - Shopping cart functionality.
  - Favorites/Wishlist.
- **Checkout Process:**
  - Shipping address form.
  - Order summary.
  - Payment processing (mocked).
  - Order confirmation.
- **User Profile Management:**
  - View and edit profile information.
  - Manage shipping addresses.
  - View order history and track orders.
  - Change password.
  - Notification preferences.
- **AI-Powered Features (Genkit - currently mocked, to be driven by Laravel backend):**
  - Style recommendations based on user behavior and history.
- **Admin Panel:**
  - Dashboard with summary statistics.
  - Product Management (CRUD operations - UI built, API integration pending).
  - User Management (CRUD operations - UI built, API integration pending).
  - Order Management (View, update status - UI built, API integration pending).
  - Application Settings (Site info, payment, shipping - UI built, API integration pending).
- **Static & Informational Pages:**
  - About Us, Contact Us, FAQs.
  - Privacy Policy, Terms of Service.
  - Button Style Guide.

## Key Backend API Endpoints (Conceptual Laravel API)

The Laravel backend should expose RESTful API endpoints to support the frontend features. Key groups of endpoints include:

- **Authentication:** `/api/register`, `/api/login`, `/api/logout`, `/api/user` (protected, to get current user).
- **Products:**
  - `GET /api/products` (with filtering, sorting, pagination).
  - `GET /api/products/{id}`
  - `GET /api/categories`
- **Cart (if backend-driven for persistence):**
  - `GET /api/cart`
  - `POST /api/cart`
  - `PUT /api/cart/{cartItemId}`
  - `DELETE /api/cart/{cartItemId}` or `/api/cart/{productId}`
- **Favorites (if backend-driven):**
  - `GET /api/favorites`
  - `POST /api/favorites`
  - `DELETE /api/favorites/{productId}`
- **Orders:**
  - `POST /api/orders` (handles order creation and payment intent).
  - `GET /api/orders` (for user's order history).
  - `GET /api/orders/{id}` (for specific order details and tracking).
- **Profile Management:**
  - `PUT /api/profile`
  - `POST /api/profile/change-password`
  - `GET, POST, PUT, DELETE /api/profile/addresses`
- **Admin Panel (prefixed with `/api/admin`, e.g., `/api/admin/products`):**
  - CRUD endpoints for Products, Users, Orders.
  - Endpoints for managing application settings.
  - Dashboard data endpoint (`/api/admin/dashboard-summary`).
- **AI/Style Recommendations (Conceptual):**
  - `POST /api/style-recommendations`: Takes user history/preferences, returns product suggestions. Logic can be implemented in Laravel, potentially calling external AI services or Genkit flows if Genkit is also used in the backend.

## Frontend-Backend Integration

- **API Service:** The Next.js frontend uses a centralized API service located at `src/lib/api.ts` to make requests to the Laravel backend. This service handles prepending the API base URL and setting default headers.
- **Authentication Context:** `src/contexts/auth-context.tsx` manages user authentication state and interacts with the Laravel auth endpoints. For SPA authentication with Sanctum, Laravel will manage session cookies (HttpOnly).
- **Data Fetching:** Components fetch data using the API service, typically within `useEffect` hooks for client-side rendering (`"use client"`) or directly in Server Components for initial data when appropriate. The `src/app/(app)/products/page.tsx` is an example of client-side fetching with filters.

## Further Development Considerations

- Implement actual payment gateway integration (e.g., Stripe, PayPal) in both frontend and backend.
- Fully implement and refine AI features for style recommendations, driven by the Laravel backend.
- Develop comprehensive database seeders for easier testing and development in Laravel.
- Implement robust unit and integration tests for both frontend and backend.
- Enhance admin panel functionality with real-time data, charts (e.g., using Recharts with data from Laravel), and advanced management tools.
- Set up proper file storage (e.g., AWS S3) for product images and other uploads, managed by Laravel.
- Implement activity logging in the admin panel (Laravel backend).
- Refine CSRF handling if not using a library like Axios that manages it automatically with Sanctum SPA.
- Implement full pagination for all list views in both frontend and backend.
