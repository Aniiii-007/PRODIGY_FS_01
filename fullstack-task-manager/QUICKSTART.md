# TaskFlow - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Extract the Project
```bash
tar -xzf fullstack-task-manager.tar.gz
cd fullstack-task-manager
```

### Step 2: Setup Backend
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the server
npm run dev
```

### Step 3: Setup Frontend (Open New Terminal)
```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Step 4: Access the Application
Open your browser and go to: **http://localhost:3000**

---

## 📝 Default Configuration

### Backend (Port 5000)
- MongoDB: `mongodb://localhost:27017/taskmanager`
- JWT expiry: 7 days
- Password hashing: bcrypt with 10 salt rounds

### Frontend (Port 3000)
- API Proxy: Configured to backend
- Theme: Dark mode with orange gradient accents

---

## 🎯 First Steps After Login

1. **Create Your First Task**
   - Click "Tasks" in the sidebar
   - Click "New Task" button
   - Fill in details and save

2. **Add a Schedule**
   - Click "Schedules" in the sidebar
   - Click "New Schedule"
   - Set date, time, and location

3. **Quick Todos**
   - Click "Todos" in the sidebar
   - Add quick tasks that need completion

4. **Shopping Lists**
   - Click "Shopping" in the sidebar
   - Create a list and add items with quantities

---

## 🔐 Security Notes

- Change `JWT_SECRET` in `.env` before production
- Never commit `.env` file to version control
- Use strong passwords (min 6 characters)
- Usernames must be at least 3 characters

---

## 🛠️ Troubleshooting

**Problem: Can't connect to MongoDB**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or if using Docker
docker run -d -p 27017:27017 mongo
```

**Problem: Port already in use**
- Backend: Change `PORT` in `.env`
- Frontend: Change port in `vite.config.js`

**Problem: JWT authentication fails**
- Clear browser localStorage
- Check if `JWT_SECRET` is set in `.env`
- Restart the backend server

---

## 📱 Features Overview

### ✅ Authentication
- Secure signup with username, email, password
- JWT-based session management
- Protected routes

### 📋 Task Management
- Priority levels: Low, Medium, High
- Status tracking: Pending, In-Progress, Completed
- Due dates and descriptions

### 📅 Scheduling
- Event planning with start/end times
- Location tracking
- Event descriptions

### ✓ Todo Lists
- Quick task creation
- Category organization
- Completion tracking

### 🛒 Shopping Lists
- Multiple lists support
- Item quantities
- Purchase tracking
- Progress visualization

---

## 🎨 UI Features

- 🌙 Dark mode interface
- 📱 Fully responsive design
- 🎯 Sidebar navigation
- ✨ Smooth animations
- 🎨 Custom color scheme
- 🔔 Toast notifications

---

## 📦 Technology Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt Password Hashing

**Frontend:**
- React 18
- React Router v6
- Tailwind CSS
- Axios
- React Icons
- React Toastify

---

## 🔄 Development Workflow

1. Make changes to your code
2. Backend auto-reloads with `nodemon`
3. Frontend hot-reloads with Vite
4. Test your changes in browser
5. Check API responses in browser DevTools

---

## 📚 API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"userName":"testuser","email":"test@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Create Task (with auth token)
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"My First Task","priority":"high","status":"pending"}'
```

---

## 🎓 Learning Resources

- **MongoDB:** https://docs.mongodb.com/
- **Express:** https://expressjs.com/
- **React:** https://react.dev/
- **Tailwind CSS:** https://tailwindcss.com/
- **JWT:** https://jwt.io/

---

## 💡 Tips

- Use the Dashboard for a quick overview
- Sidebar is collapsible on mobile
- All forms have validation
- Delete actions require confirmation
- Progress is shown for shopping lists

---

## 🚀 Production Deployment

### Backend
1. Update `.env` with production values
2. Set `NODE_ENV=production`
3. Use MongoDB Atlas for database
4. Deploy to Heroku, Railway, or VPS

### Frontend
1. Run `npm run build`
2. Deploy `dist` folder to Vercel, Netlify, or similar
3. Update API endpoint URLs

---

Happy Task Managing! 🎉
