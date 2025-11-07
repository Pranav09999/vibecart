# MongoDB Database Viewing Guide

## Step-by-Step Guide to View Your Database and Products

### Step 1: Connect to MongoDB Shell

Open a terminal/PowerShell and run:

```bash
mongosh
```

Or if that doesn't work, try:
```bash
mongo
```

You should see:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/...
Using MongoDB: 8.0.4
mongosh>
```

---

### Step 2: List All Databases

Once connected, type:

```javascript
show dbs
```

This will show all databases. You should see something like:
```
admin    40.00 KiB
config   72.00 KiB
local    72.00 KiB
vibeCartDB  40.00 KiB  ← This is your database
```

---

### Step 3: Switch to Your Database

Type:

```javascript
use vibeCartDB
```

You should see:
```
switched to db vibeCartDB
```

---

### Step 4: List All Collections (Tables)

In MongoDB, collections are like tables. Type:

```javascript
show collections
```

This will show:
```
products  ← Your products collection
carts     ← Your cart items collection
```

---

### Step 5: View All Products

To see all products in the database:

```javascript
db.products.find().pretty()
```

The `.pretty()` makes the output more readable.

**Example output:**
```json
{
  _id: ObjectId("..."),
  name: "Wireless Headphones",
  price: 99.99,
  image: "https://...",
  description: "High-quality wireless headphones...",
  createdAt: ISODate("2025-11-07T..."),
  updatedAt: ISODate("2025-11-07T...")
}
```

---

### Step 6: Count Products

To see how many products you have:

```javascript
db.products.countDocuments()
```

---

### Step 7: View Cart Items

To see all cart items:

```javascript
db.carts.find().pretty()
```

---

### Step 8: View Specific Product

To find a specific product by name:

```javascript
db.products.findOne({ name: "Wireless Headphones" })
```

Or by ID:
```javascript
db.products.findOne({ _id: ObjectId("YOUR_ID_HERE") })
```

---

### Step 9: View Products in a Table Format

For a cleaner view, you can use:

```javascript
db.products.find().forEach(function(product) {
  print("Name: " + product.name + " | Price: $" + product.price);
})
```

---

### Step 10: Exit MongoDB Shell

When done, type:

```javascript
exit
```

---

## Quick Reference Commands

| Command | Description |
|---------|-------------|
| `show dbs` | List all databases |
| `use vibeCartDB` | Switch to your database |
| `show collections` | List all collections (tables) |
| `db.products.find()` | View all products |
| `db.products.find().pretty()` | View all products (formatted) |
| `db.products.countDocuments()` | Count products |
| `db.carts.find().pretty()` | View all cart items |
| `db.products.findOne({ name: "..." })` | Find one product |
| `exit` | Exit MongoDB shell |

---

## If Your Database is Empty

If you don't see any products, it means:
1. MongoDB wasn't connected when you first ran the backend
2. Products haven't been seeded yet

**To seed products:**
1. Make sure your backend is running
2. Make sure MongoDB is connected
3. Visit: `http://localhost:4000/api/products` in your browser
4. This will automatically seed the products into the database
5. Then check MongoDB again using the commands above

---

## Using MongoDB Compass (GUI Tool)

If you prefer a visual interface:

1. Download MongoDB Compass: https://www.mongodb.com/try/download/compass
2. Install it
3. Open Compass
4. Connect to: `mongodb://localhost:27017`
5. Click on `vibeCartDB` database
6. Click on `products` collection
7. You'll see all products in a nice table format!

---

## Troubleshooting

**If `mongosh` command doesn't work:**
- MongoDB might not be in your PATH
- Try: `C:\Program Files\MongoDB\Server\8.0\bin\mongosh.exe`
- Or find where MongoDB is installed and use the full path

**If database doesn't exist:**
- It will be created automatically when you first add data
- Make sure your backend is running and connected to MongoDB
- Visit the products API endpoint to seed data

