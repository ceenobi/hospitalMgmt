import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import {
  catchNotFound,
  globalErrorHandler,
} from "./src/middelwares/errorHandler.js";
//routes
import authRoutes from "./src/routes/authRoutes.js";
import doctorRoutes from "./src/routes/doctorRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import patientRoutes from "./src/routes/patientRoutes.js";
import roomRoutes from "./src/routes/roomRoutes.js";
import appointmentRoutes from "./src/routes/appointment.js";
import paymentRoutes from "./src/routes/paymentRoutes.js";

// Initialize Express app
const app = express();

// Trust first proxy (important for rate limiting behind proxies)
app.set("trust proxy", 1);

const corsOptions = {
  origin: ["http://localhost:4400", "https://hospital-mgmt-care.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Credentials",
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));

// Add headers before the routes are defined
// app.use(function (req, res, next) {
//   // Set CORS headers
//   if (allowedOrigins.includes(req.headers.origin)) {
//     res.header("Access-Control-Allow-Origin", req.headers.origin);
//   }
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, DELETE, OPTIONS"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Credentials", "true");

//   // Handle preflight
//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }

//   next();
// });
app.use(compression());
app.use(cookieParser());
app.use(helmet());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ extended: true, limit: "25mb" }));
app.disable("x-powered-by");

// Logging middleware in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(`Request at ${req.requestTime}`);
  next();
});

// Mount routes
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
    environment: process.env.NODE_ENV,
    timestamp: req.requestTime,
  });
});

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/room", roomRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Handle 404 - Must be after all other routes
app.use(catchNotFound);

// Global error handling middleware
app.use(globalErrorHandler);

// Database connection
const connectDB = async () => {
  const connectionOptions = {
    dbName: process.env.MONGO_DB,
    serverSelectionTimeoutMS: 45000,
    socketTimeoutMS: 5000,
    retryWrites: true,
    retryReads: true,
    maxPoolSize: 50,
    minPoolSize: 1,
  };

  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI,
      connectionOptions
    );
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Connection event handlers
    mongoose.connection.on("error", (err) =>
      console.error("❌ MongoDB connection error:", err)
    );

    mongoose.connection.on("disconnected", () =>
      console.log("ℹ️  MongoDB disconnected")
    );

    // Handle graceful shutdown
    const gracefulShutdown = async () => {
      await mongoose.connection.close();
      console.log("ℹ️  MongoDB connection closed through app termination");
      process.exit(0);
    };

    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);

    return conn;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Server configuration
const PORT = process.env.PORT || 7500;

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(
        `\n✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
      console.log(`🌐 http://localhost:${PORT}\n`);
    });

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err) => {
      console.error("\n❌ UNHANDLED REJECTION! Shutting down...");
      console.error(err.name, err.message);

      // Close server gracefully
      server.close(() => {
        console.log("💥 Process terminated due to unhandled rejection");
        process.exit(1);
      });
    });

    // Handle graceful shutdown
    const shutdown = async () => {
      console.log("\n🛑 Received shutdown signal. Closing server...");
      server.close(() => {
        console.log("✅ Server closed");
        process.exit(0);
      });

      // Force close if server doesn't close in time
      setTimeout(() => {
        console.error("⚠️ Forcing server shutdown");
        process.exit(1);
      }, 10000);
    };

    // Handle termination signals
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error(`\n❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
startServer();
