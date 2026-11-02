# Student Records RESTful API (Practical 6)

A production-ready RESTful API for managing student records in a database, built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**, ready for deployment on **Render** and verification via **Postman**.

---

##  Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your MongoDB Atlas connection string if you want to connect to a cloud database:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/student_records_db?retryWrites=true&w=majority
```
*(Note: If no MongoDB URI is supplied, the server runs in fail-safe in-memory mode so you can test all CRUD operations instantly without setting up a local database!)*

### 3. Start the Server
```bash
npm start
```
Or for auto-reloading development:
```bash
npm run dev
```

Visit [http://localhost:5000](http://localhost:5000) to view the interactive dashboard and documentation!

### 4. Run Automated Test Suite
```bash
node test_api.js
```

---

## 📬 Postman Testing

1. Open Postman.
2. Click **Import** (top left).
3. Select the file: `Practical_6_Postman_Collection.json`.
4. The collection is pre-configured with:
   - `{{baseUrl}}` variable set to `http://localhost:5000` (or your Render URL)
   - Dynamic `{{studentId}}` saving on `POST /api/students`
   - Automated assertions for status codes (201, 200, 404, etc.)
5. Click **Run collection** to run all tests in sequence.

---

## 🚀 Cloud Deployment to Render (Step-by-Step)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: Practical 6 RESTful API"
   git branch -M main
   git remote add origin https://github.com/<your-username>/student-records-api.git
   git push -u origin main
   ```

2. **Deploy on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com) and click **New +** -> **Web Service**.
   - Select your GitHub repository.
   - Set:
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free
   - Add Environment Variable:
     - `MONGODB_URI`: `<Your MongoDB Atlas connection URI>`
   - Click **Deploy Web Service**.

3. **Verify Public URL**:
   - Once live, your API will be available at: `https://<your-service-name>.onrender.com`
   - Update `{{baseUrl}}` in Postman to `https://<your-service-name>.onrender.com` and run the tests!

---

## 📑 Practical Report for Moodle
A complete, pre-formatted academic practical report is ready in `PRACTICAL_6_REPORT.md`. Simply fill in your name and roll number, insert your Postman screenshots, and submit!
