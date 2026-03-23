import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.route.js";
import companyRoutes from "./routes/company.route.js";
import jobRoutes from "./routes/job.route.js";
import applicationRoutes from "./routes/application.route.js";
import "./models/application.model.js";
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// --- MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ FIXED CORS (robust version)
const allowedOrigins = [
  "http://localhost:5173",
  "https://takjob-1.onrender.com"
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// --- PORT ---
const PORT = process.env.PORT || 3000;

// --- API ROUTES ---
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/companies", companyRoutes);
app.use("/api/v1/jobs", jobRoutes);
app.use("/api/v1/applications", applicationRoutes);

// --- SERVE FRONTEND ---
app.use(express.static(path.join(__dirname, "frontend", "dist")));

// --- SPA CATCH-ALL (FIXED ROUTE) ---
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// --- START SERVER ---
app.listen(PORT, async () => {
  console.log(`Server is running at port ${PORT}`);
  await connectDB();
});