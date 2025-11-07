# How to Seed Products into MongoDB

## Quick Steps:

1. **Make sure MongoDB is running**
   - MongoDB service should be running
   - You can verify by connecting with `mongosh`

2. **Start your backend server**
   ```bash
   cd backend
   npm run dev
   ```
   
   Look for: `MongoDB Connected: localhost`

3. **Seed products by calling the API**

   **Option A: Using Browser**
   - Open: http://localhost:4000/api/products
   - This will automatically seed products

   **Option B: Using PowerShell**
   ```powershell
   Invoke-WebRequest -Uri http://localhost:4000/api/products -Method GET
   ```

   **Option C: Using curl (if installed)**
   ```bash
   curl http://localhost:4000/api/products
   ```

4. **Verify in MongoDB**
   ```javascript
   use vibeCartDB
   db.products.find().pretty()
   ```

You should now see 8 products!

