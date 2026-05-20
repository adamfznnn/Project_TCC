const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const lapanganRoutes = require("./routes/lapanganRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Booking Futsal API is Running on Cloud Run!");
});

const User = require("./schema/User");
const Lapangan = require("./schema/Lapangan");
const Booking = require("./schema/Booking");

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/lapangan", lapanganRoutes);
app.use("/api/v1/booking", bookingRoutes);

const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log("------------------------------------------");
  console.log(`🚀 Server running and listening on port ${port}`);
  console.log("------------------------------------------");

  console.log("🔄 Connecting to database...");
  sequelize.sync({ alter: true })
    .then(() => {
      console.log("✅ Database Connected & Synced Successfully");
    })
    .catch(err => {
      console.error("❌ Unable to connect to Database:", err.message);
      console.log("⚠️ Aplikasi tetap jalan, tapi API yang butuh DB akan error sampai koneksi VM aman.");
    });
});