# 🛒 বাজার দর — BazarDor

BazarDor is a responsive market-price tracking application for everyday essentials in Bangladesh. Users can explore current product prices, compare prices across markets, browse categories, and see which products have increased or decreased in price.

## 🔗 Project Links

Live Website:


## 🛠️ Technologies Used

- **Next.js** — Application framework with App Router
- **React** — Interactive user interfaces
- **JavaScript** — Application logic
- **Tailwind CSS** — Styling and responsive layouts
- **DaisyUI** — UI components
- **HeroUI** — UI components and styles
- **Better Auth** — Email/password, Google, and GitHub authentication
- **MongoDB Atlas** — Authentication data storage
- **React Hot Toast** — Success, error, and validation notifications
- **Vercel** — Deployment and hosting

## ✨ Key Features

### 1. Live Product Prices
Browse everyday essentials with product images or emojis, Bengali product names, units, current prices, and price-change indicators.

### 2. Price Movement Highlights
View the top six products with rising prices and the top six products with falling prices. An animated price ticker displays current prices below the navbar.

### 3. Category Browsing and Sorting
Explore products by category and sort them by default order, lowest price, or highest price. Sorting uses numeric values and supports Bengali numerals.

### 4. Protected Product Details
Product details require login. Each details page displays the product summary, category, unit, minimum price, maximum price, average price, and market-specific prices.

### 5. Multiple Authentication Options
Register and sign in using email/password, Google, or GitHub. Authentication actions display relevant toast notifications.

### 6. Profile Management
View your profile and visit a separate update page to change your name using Better Auth.

### 7. Responsive Design
Layouts adapt to mobile, tablet, and desktop screens.

### 8. Loading and Error States
Skeleton loaders appear while fetching data. Friendly not-found pages provide a “হোম পেজে ফিরে যান” button for unavailable pages.

## 📄 Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Home page |
| `/category/[slug]` | Category products and sorting |
| `/product/[slug]` | Protected product details |
| `/sign-in` | Sign in |
| `/sign-up` | Registration |
| `/profile` | User profile |
| `/profile/update` | Update profile information |

## 🌐 Product API

**Base URL:**

https://openapi.programming-hero.com/api/bazardor

| Endpoint | Purpose |
| --- | --- |
| `/products` | Retrieve all products |
| `/products?category=chal` | Retrieve products by category |
| `/products/1` | Retrieve a single product |
| `/categories` | Retrieve all categories |
| `/categories/chal` | Retrieve a single category |

## 🚀 Run Locally

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd bazar-dor
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
BETTER_AUTH_SECRET=your_secure_random_secret
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URL=your_mongodb_connection_string

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Configure the following local callback URLs in the respective OAuth applications:

```text
Google: http://localhost:3000/api/auth/callback/google
GitHub: http://localhost:3000/api/auth/callback/github
```

Allow your current IP address in MongoDB Atlas Network Access.

### 4. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📦 Production Build

```bash
npm run build
npm run start
```

## ☁️ Deployment

The application is hosted on Vercel.

For production, configure the environment variables in Vercel and set:

```env
BETTER_AUTH_URL=https://bazar-dor-ten-livid.vercel.app
```

Configure the production OAuth callback URLs:

```text
Google: https://bazar-dor-ten-livid.vercel.app/api/auth/callback/google
GitHub: https://bazar-dor-ten-livid.vercel.app/api/auth/callback/github
```

Keep database credentials and authentication secrets out of the repository.

## ⚠️ Price Disclaimer

সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।



<!-- 
…or create a new repository on the command line
echo "# bazar-dor" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Habiba22Akter/bazar-dor.git
git push -u origin main
…or push an existing repository from the command line
git remote add origin https://github.com/Habiba22Akter/bazar-dor.git
git branch -M main
git push -u origin main -->