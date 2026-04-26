# MusicSaaS — Premium MERN Music Streaming App

MusicSaaS is a production-grade, Spotify-inspired music streaming application built with the MERN stack (MongoDB, Express, React, Node.js) and MySQL. It features a premium dark-themed UI, real-time playback, playlist management, and a robust "Liked Songs" system.

## 🌟 Features

-   **Premium UI/UX**: Immersive dark theme with glassmorphism, smooth animations (Tailwind CSS v4).
-   **Global Audio Player**: Persistent playback bar with real-time progress seek and volume controls.
-   **Liked Songs**: One-click liking system with dedicated Favorites section.
-   **Playlist Management**: Create custom playlists and organize your favorite tracks.
-   **Hybrid Database Architecture**: 
    -   **MySQL**: Securely handles User authentication and core profile data.
    -   **MongoDB**: Manages dynamic user-generated content like Likes and Playlists.
-   **Responsive Design**: Optimized for all screen sizes.

---

## 📁 Project Structure

```text
├── backend/                # Express & Node.js Server
│   ├── config/             # Database configurations (MySQL & MongoDB)
│   ├── controllers/        # Business logic for Auth, Songs, Playlists, etc.
│   ├── middleware/         # Error handling and Auth middleware
│   ├── models/             # MongoDB Schemas (Playlist, Like, History)
│   ├── routes/             # API Endpoints
│   ├── utils/              # Shared utilities (Dummy data, helpers)
│   └── server.js           # Main entry point
├── frontend/               # React & Vite Application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Sidebar, Navbar)
│   │   ├── layouts/        # Page wrappers (AuthLayout, DashboardLayout)
│   │   ├── pages/          # Main views (Songs, Playlists, Auth)
│   │   ├── services/       # Axios API client
│   │   └── utils/          # Storage and formatting helpers
│   └── tailwind.config.js  # Custom design tokens
```

---

## 🚀 Installation & Setup

### Prerequisites
-   **Node.js**: v20.19+ or v22.12+ (Required for Vite 6+)
-   **MySQL Server**: Running on localhost
-   **MongoDB Server**: Running on localhost

### 1. Database Setup

#### MySQL
Create a database named `music_app` and a `users` table:
```sql
CREATE DATABASE music_app;
USE music_app;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### MongoDB
The application will automatically create the `music_app` database and necessary collections upon connection.

### 2. How to Add More Songs
Currently, the application uses a centralized song list for demonstration purposes. To add more tracks to the library:
1.  Navigate to `backend/utils/songs.js`.
2.  Add a new song object to the `songs` array:
    ```javascript
    {
        id: 13,
        title: "Your Song Title",
        artist: "Artist Name",
        url: "https://link-to-your-mp3-file.mp3"
    }
    ```
3.  The UI will automatically reflect the new tracks after a page refresh.

### 2. Backend Configuration
1.  Navigate to the `backend` folder.
2.  Create a `.env` file:
    ```env
    PORT=5000
    DB_HOST=localhost
    DB_USER=your_mysql_user
    DB_PASSWORD=your_mysql_password
    DB_NAME=music_app
    JWT_SECRET=your_jwt_secret_key
    ```
3.  Install dependencies and start the server:
    ```bash
    npm install
    node server.js
    ```

### 3. Frontend Configuration
1.  Navigate to the `frontend` folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

---

## 🛠️ Tech Stack

-   **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React, Axios.
-   **Backend**: Node.js, Express.
-   **Database**: MySQL (Auth), MongoDB (Library).
-   **State Management**: React Outlet Context & Hooks.

## 🤝 Contributors
-   **Janii** (Lead Developer & UI/UX Expert)
-   **Team MusicSaaS**

---
Made with ❤️ for music lovers.
