require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cron = require("node-cron");
const axios = require("axios");

const tmdbRoutes = require("./routes/tmdbRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes"); // ✅ Ensure movies route is added
const recommendRoutes = require("./routes/recommendRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// ✅ Simple, safe JSON parser
app.use(express.json({ limit: "10mb" }));

// ✅ Enable CORS for frontend
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend origin
    credentials: true,
  })
);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

// ✅ Mount API Routes
app.use("/api/tmdb", tmdbRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes); // ✅ Add missing movie route
app.use("/api/movies/recommend", recommendRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Root Health Check
app.get("/", (req, res) => {
  res.send("🎬 CineVerse Backend Running Successfully!");
});

// ✅ Global Error Handler (prevents crashes)
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// ✅ Start Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ Auto Refresh Cron (Every 5 Minutes)
cron.schedule(
  "*/5 * * * *", // 🔁 Every 5 minutes
  async () => {
    try {
      const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
      console.log(`🕒 Auto-update triggered at: ${now}`);
      console.log("🔁 Auto-refresh started — Fetching new movies from TMDB...");
      const response = await axios.get(`http://localhost:${PORT}/api/tmdb/update`);
      console.log("✅ Auto-refresh completed:", response.data.message);
    } catch (err) {
      console.error("❌ Auto-refresh failed:", err.message);
    }
  },
  { timezone: "Asia/Kolkata" }
);
