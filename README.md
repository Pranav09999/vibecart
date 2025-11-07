# VibeCart Full-Stack Demo

VibeCart is a mock e-commerce experience composed of a Node.js/Express backend and a Vite + React frontend styled with Tailwind CSS. The project demonstrates a complete flow from product browsing to cart management and checkout backed by MongoDB.

## Project Layout

```
.
├── backend/                # Express API
│   ├── config/             # Database connection helpers
│   ├── controllers/        # Route handlers (products, cart, checkout)
│   ├── models/             # Mongoose models (Product, Cart)
│   ├── routes/             # API routes
│   ├── scripts/            # Utility scripts (e.g., product seed)
│   ├── utils/              # Shared utilities (in-memory cart fallback)
│   └── server.js           # API entry point
├── frontend/               # React SPA (Vite + Tailwind)
│   ├── src/
│   │   ├── components/     # Shared UI components
│   │   ├── pages/          # Products, Cart, Checkout
│   │   ├── App.jsx         # Router & layout shell
│   │   └── main.jsx        # React entry point
│   └── vite.config.js      # Vite configuration (port 3000)
├── MONGODB_GUIDE.md        # Detailed MongoDB shell instructions
└── seed-products.md        # Quick reference for seeding products
```

## Prerequisites

- Node.js 18+ (tested with Node 22)
- npm 9+
- MongoDB 6+ running locally or a MongoDB Atlas connection string

> Tip: If MongoDB is not available, the backend falls back to in-memory storage for cart items and serves mock products. Connect MongoDB for full persistence.

## Environment Variables

Create `backend/.env` (already included) with:

```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/vibeCartDB
```

Adjust `MONGO_URI` if you are using a remote cluster or MongoDB Atlas.

## Backend Setup & Scripts

```bash
cd backend
npm install
npm run dev        # Start API with nodemon on http://localhost:4000
npm run start      # Start API with node
npm run seed       # Seed products into MongoDB
```

### API Endpoints

| Method | Endpoint              | Description                                  |
|--------|-----------------------|----------------------------------------------|
| GET    | `/api/products`       | Returns products (seeds DB if empty)         |
| POST   | `/api/cart`           | Add or update a cart item `{ productId, qty }` |
| GET    | `/api/cart`           | Retrieve cart items with totals              |
| DELETE | `/api/cart/:id`       | Remove an item by cart document id           |
| POST   | `/api/checkout`       | Calculates total and returns receipt details |

All responses are JSON and include success flags plus helpful messages on failure.

### MongoDB Notes

- When MongoDB is connected, cart and products persist in the database.
- When MongoDB is unavailable, the backend uses an in-memory cart fallback and mock products so the UI remains functional.
- See `MONGODB_GUIDE.md` for shell commands (`show dbs`, `db.products.find().pretty()`, etc.) and `seed-products.md` for seeding shortcuts.

## Frontend Setup & Scripts

```bash
cd frontend
npm install
npm run dev        # Start Vite dev server on http://localhost:3000
npm run build      # Production build
npm run preview    # Preview the production build
```

### Frontend Features

- Axios-driven data fetching from the backend (`http://localhost:4000`).
- React Router navigation:
  - `/` → Product grid with “Add to Cart”.
  - `/cart` → Cart table with subtotals and removal.
  - `/checkout` → Checkout form, receipt modal on success.
- Tailwind CSS provides responsive styling.
- Loading and error states for all API requests.

## Development Workflow

1. **Start MongoDB** (local service or Atlas connection).
2. **Backend**: `npm run dev` inside `backend/`.
3. **Seed products** (first run): `npm run seed` inside `backend/`.
4. **Frontend**: `npm run dev` inside `frontend/`.
5. Visit `http://localhost:3000` for the UI and interact with the mock shop.

## Troubleshooting

- **MongoDB Connection Error (`ECONNREFUSED`)**: Ensure MongoDB is running and the URI uses `127.0.0.1` instead of `localhost` when necessary.
- **Products not appearing in MongoDB**: Run `npm run seed` after verifying the connection message `MongoDB Connected: 127.0.0.1` in the backend console.
- **Cart Not Persisting**: Without MongoDB the cart operates in-memory; connect MongoDB for persistence.

For deeper MongoDB instructions and command examples, consult `MONGODB_GUIDE.md` in the project root.
