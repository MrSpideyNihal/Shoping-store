# COD E-commerce Website

A simple, fully functional Cash on Delivery e-commerce website built with Vite + React, Tailwind CSS, and Netlify Serverless Functions with MongoDB Atlas.

## Features

### User Features
- Browse products with search functionality
- Add products to cart (stored in localStorage)
- Place COD orders with name, phone, and address
- Order confirmation page

### Admin Features
- Secure admin login
- Add, edit, and delete products
- View all orders
- Accept or reject orders
- Real-time updates

## Tech Stack

- **Frontend**: Vite + React
- **Styling**: Tailwind CSS
- **Backend**: Netlify Serverless Functions (Node.js)
- **Database**: MongoDB Atlas + Mongoose
- **Hosting**: Netlify (zero cost)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Locally

```bash
npm run dev
```

The app will run on `http://localhost:5173`

### 3. Deploy to Netlify

#### Option A: Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

#### Option B: Deploy via Netlify Dashboard

1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Netlify will auto-detect the settings from `netlify.toml`
6. Click "Deploy site"

## Admin Access

- **URL**: `/admin`
- **Email**: `admin@shop.com`
- **Password**: `admin123`

## Database

The app uses MongoDB Atlas with the following collections:

### Products Collection
```javascript
{
  name: String,
  price: Number,
  image: String
}
```

### Orders Collection
```javascript
{
  name: String,
  phone: String,
  address: String,
  items: Array,
  total: Number,
  status: String, // "pending", "accepted", "rejected"
  date: Date
}
```

## API Endpoints

All endpoints are Netlify serverless functions:

- `GET /.netlify/functions/products` - Get all products
- `POST /.netlify/functions/products` - Add new product (admin)
- `PUT /.netlify/functions/product-update?id=<id>` - Update product (admin)
- `DELETE /.netlify/functions/product-delete?id=<id>` - Delete product (admin)
- `POST /.netlify/functions/place-order` - Place new order
- `GET /.netlify/functions/orders` - Get all orders (admin)
- `POST /.netlify/functions/update-order` - Update order status (admin)
- `POST /.netlify/functions/admin-login` - Admin authentication

## Project Structure

```
Shoping-store/
├── netlify/
│   └── functions/
│       ├── utils/
│       │   └── db.js              # MongoDB connection & schemas
│       ├── products.js            # GET & POST products
│       ├── product-update.js      # PUT product
│       ├── product-delete.js      # DELETE product
│       ├── place-order.js         # POST order
│       ├── orders.js              # GET orders
│       ├── update-order.js        # POST update order status
│       └── admin-login.js         # POST admin login
├── public/
│   └── _redirects                 # SPA routing
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProductCard.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Cart.jsx
│   │   ├── Success.jsx
│   │   ├── AdminLogin.jsx
│   │   └── AdminDashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env.example
├── netlify.toml
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Adding Products

As an admin, you can add products by providing:
1. Product name
2. Price (in ₹)
3. Image URL (upload images to services like [imgbb.com](https://imgbb.com) and paste the direct URL)

## Notes

- Cart data is stored in browser's localStorage
- No user authentication required for placing orders
- Admin authentication uses hardcoded credentials (for production, implement proper auth)
- MongoDB connection string is embedded in serverless functions
- All serverless functions include CORS headers for cross-origin requests

## License

MIT
