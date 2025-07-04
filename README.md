# 🛒 ShopSync - Collaborative Shopping App

A real-time collaborative shopping list application that lets you create, share, and manage shopping lists with friends and family. Built with modern web technologies for seamless real-time collaboration.

![React](https://img.shields.io/badge/React-19.1.0-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)
![MongoDB](https://img.shields.io/badge/MongoDB-8.15.1-47a248)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8.1-010101)

## ✨ Features

- **Real-time Collaboration**: See changes instantly as your collaborators add or check off items
- **User Authentication**: Secure login/signup with JWT tokens
- **Shopping List Management**: Create, edit, and organize multiple shopping lists
- **Item Tracking**: Add quantities, mark items as purchased, and track progress
- **Collaborative Sharing**: Invite friends to your shopping lists
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean Material-UI interface with intuitive navigation

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **Material-UI (MUI)** - Professional UI components and theming
- **React Router** - Client-side routing and navigation
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API requests
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Socket.io** - Real-time bidirectional communication
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing and security

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ameyyy7303/Collaborative_Shopping_app.git
   cd Collaborative_Shopping_app
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

5. **Start the development servers**

   **Backend (Terminal 1):**
   ```bash
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 📱 How It Works

### User Flow
1. **Sign up/Login** - Create an account or sign in with existing credentials
2. **Create Lists** - Start a new shopping list from your dashboard
3. **Add Items** - Populate your list with items and quantities
4. **Share & Collaborate** - Invite friends to join your shopping lists
5. **Real-time Updates** - See changes instantly as everyone contributes
6. **Track Progress** - Mark items as purchased and monitor completion

### Key Features Explained

**Real-time Collaboration**: Using Socket.io, multiple users can simultaneously edit the same shopping list. When someone adds, removes, or checks off an item, all connected users see the change immediately.

**Authentication System**: JWT-based authentication ensures secure access to personal shopping lists while allowing controlled sharing with collaborators.

**Responsive Design**: The Material-UI components automatically adapt to different screen sizes, providing an optimal experience on both desktop and mobile devices.

## 🏗️ Project Structure

```
Collaborative_Shopping_app/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context for auth
│   │   └── api/            # API client configuration
│   └── package.json
├── models/                  # MongoDB schemas
├── routes/                  # Express API routes
├── middlewares/            # Custom middleware (auth)
├── server.js              # Main server file
└── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login

### Shopping Lists
- `GET /api/lists` - Get user's shopping lists
- `POST /api/lists` - Create new shopping list
- `GET /api/lists/:id` - Get specific list details
- `PATCH /api/lists/:id` - Update list (add/remove items)
- `DELETE /api/lists/:id` - Delete shopping list

## 🎯 Future Enhancements

- [ ] Push notifications for list updates
- [ ] Categories and tags for better organization
- [ ] Shopping history and analytics
- [ ] Offline support with sync
- [ ] Image uploads for items
- [ ] Shopping list templates
- [ ] Budget tracking features

## 🤝 Contributing

I'm always open to contributions! If you'd like to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 About the Developer

Hey there! I'm Amey, a passionate full-stack developer who loves building practical applications that solve real-world problems. This project was born from the need to coordinate grocery shopping with roommates - something I'm sure many of us can relate to!

I believe in writing clean, maintainable code and creating user experiences that just work. This project showcases my skills with modern web technologies and real-time applications.

Feel free to reach out if you have any questions or just want to chat about web development!

---

**Built with ❤️ and lots of coffee ☕**

*If you found this project helpful, consider giving it a ⭐ on GitHub!*
