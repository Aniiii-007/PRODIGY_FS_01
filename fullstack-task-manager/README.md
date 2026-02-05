# TaskFlow - Secure Task Manager

A fullstack MERN application with secure JWT authentication, featuring task management, scheduling, todos, and shopping lists.

## Features

✅ **Secure Authentication**
- User signup with username, email, and password
- Password hashing using bcrypt
- JWT token-based authentication
- Protected routes on both frontend and backend

✅ **Task Management**
- Create, read, update, and delete tasks
- Set priority levels (low, medium, high)
- Track status (pending, in-progress, completed)
- Add due dates and descriptions

✅ **Schedules**
- Create and manage scheduled events
- Set start and end times
- Add locations and descriptions

✅ **Todos**
- Quick todo list functionality
- Mark items as complete/incomplete
- Categorize todos

✅ **Shopping Lists**
- Create multiple shopping lists
- Add items with quantities
- Track purchased items
- Visual progress indicators

✅ **Modern UI/UX**
- Beautiful dark theme with custom design
- Responsive sidebar navigation
- Smooth animations and transitions
- Mobile-friendly interface

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React** - UI library
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icons

## Project Structure

```
fullstack-task-manager/
├── backend/
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── server.js         # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── context/      # React context
    │   ├── App.jsx       # Main app component
    │   └── main.jsx      # Entry point
    ├── index.html
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Log In**: Use your credentials to access the dashboard
3. **Dashboard**: View overview of all your items
4. **Manage Items**: 
   - Click on Tasks, Schedules, Todos, or Shopping from the sidebar
   - Create new items using the "New" button
   - Edit items by clicking the edit icon
   - Delete items by clicking the trash icon
   - Toggle completion status (for todos and shopping items)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Tasks
- `GET /api/tasks` - Get all tasks (protected)
- `POST /api/tasks` - Create task (protected)
- `GET /api/tasks/:id` - Get single task (protected)
- `PUT /api/tasks/:id` - Update task (protected)
- `DELETE /api/tasks/:id` - Delete task (protected)

### Schedules
- `GET /api/schedules` - Get all schedules (protected)
- `POST /api/schedules` - Create schedule (protected)
- `PUT /api/schedules/:id` - Update schedule (protected)
- `DELETE /api/schedules/:id` - Delete schedule (protected)

### Todos
- `GET /api/todos` - Get all todos (protected)
- `POST /api/todos` - Create todo (protected)
- `PUT /api/todos/:id` - Update todo (protected)
- `DELETE /api/todos/:id` - Delete todo (protected)

### Shopping Lists
- `GET /api/shopping` - Get all shopping lists (protected)
- `POST /api/shopping` - Create shopping list (protected)
- `PUT /api/shopping/:id` - Update shopping list (protected)
- `DELETE /api/shopping/:id` - Delete shopping list (protected)

## Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token authentication
- ✅ Protected routes (middleware checks)
- ✅ Input validation
- ✅ User-specific data access
- ✅ CORS configuration
- ✅ Environment variables for sensitive data

## Customization

### Changing Colors
Edit `frontend/tailwind.config.js` to modify the color scheme:

```javascript
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Modifying Authentication
Update `backend/middleware/auth.js` to customize JWT verification logic.

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in your environment
2. Use a secure `JWT_SECRET`
3. Connect to a production MongoDB instance
4. Enable HTTPS
5. Set up proper CORS origins

### Frontend
1. Build the production version:
```bash
npm run build
```
2. Deploy the `dist` folder to your hosting service
3. Update API endpoints if necessary

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check the connection string in `.env`
- Verify firewall settings

**JWT Errors:**
- Make sure JWT_SECRET is set in `.env`
- Check token expiration settings
- Verify the token is being sent in headers

**Port Already in Use:**
- Change the PORT in `.env` (backend)
- Change the port in `vite.config.js` (frontend)

## License

MIT License - feel free to use this project for learning or commercial purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using the MERN stack
