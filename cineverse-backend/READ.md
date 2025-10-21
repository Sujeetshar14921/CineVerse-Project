🎬 CineVerse – OTT Platform

CineVerse is a full-stack OTT (Over-The-Top) streaming web platform that allows users to browse, search, and view information about movies and shows. The system includes user authentication, admin management, movie recommendations, and live TMDB API integration for real-time data.

🚀 Features
🎥 User Features

Browse trending and top-rated movies

Search movies in real-time (auto-suggestions as you type)

Personalized recommendations based on recent searches

Secure login and registration with OTP verification

Update profile and manage watch history

🧑‍💼 Admin Features

Admin authentication

Add / edit / delete movies

Manage user accounts

Rebuild movie recommendation jobs manually

🔄 Automated Features

Auto-refresh of movie data using cron jobs every 6 hours

Real-time movie updates from TMDB API

Backend synchronization with frontend through REST APIs

🧠 Tech Stack
🖥 Frontend

React.js

TailwindCSS

Axios (for API calls)

⚙️ Backend

Node.js + Express.js

MongoDB (Mongoose ORM)

JWT Authentication

Cron Jobs (Node Schedule)

TMDB API Integration

🧰 Other Tools

Nodemailer for OTP email verification

bcrypt.js for password hashing

dotenv for environment configuration

📂 Folder Structure
cineverse-backend/
│
├── backend/
│   ├── server.js               # Main server entry point
│   ├── .env                    # Environment variables
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # User authentication logic
│   │   ├── adminController.js  # Admin functionalities
│   │   ├── movieController.js  # Movie CRUD and fetch APIs
│   │   ├── tmdbController.js   # TMDB API integration
│   │   └── recommendationProxy.js  # Recommendation management
│   ├── middlewares/
│   │   ├── auth.js             # JWT middleware
│   │   └── adminAuth.js        # Admin route protection
│   ├── models/
│   │   ├── userModel.js        # User schema
│   │   ├── movieModel.js       # Movie schema
│   │   └── otpModel.js         # OTP verification schema
│   ├── jobs/
│   │   └── rebuildRecommendations.js  # Cron job script
│   └── package.json
│
└── frontend/
    ├── src/
    ├── components/
    ├── pages/
    ├── App.js
    ├── index.js
    └── package.json

⚡ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/cineverse-ott.git
cd cineverse-backend/backend

2️⃣ Install Dependencies
npm install

3️⃣ Create .env File
PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  
TMDB_API_KEY=your_tmdb_api_key  
EMAIL_USER=your_email@example.com  
EMAIL_PASS=your_email_password  

4️⃣ Start the Server
npm start

5️⃣ Run Frontend
cd ../frontend
npm install
npm run dev


Then open your browser at http://localhost:5173/

🧩 API Routes Summary
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
GET	/api/movies	Fetch all movies
GET	/api/movies/:id	Fetch single movie details
GET	/api/recommendations	Get recommended movies
POST	/api/admin/addMovie	Add new movie (Admin only)
GET	/api/tmdb/search	Fetch movies from TMDB API
🔄 Cron Jobs

rebuildRecommendations.js runs every 6 hours to refresh personalized recommendations and movie data.

🧑‍💻 Authors

Developed by: Sujeet Sharma
Project Type: Full Stack OTT Streaming Platform
Version: 1.0.0