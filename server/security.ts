import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { type Express } from "express";

// Rate limiting configurations
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 API requests per windowMs
  message: {
    error: "Too many API requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 order submissions per hour
  message: {
    error: "Too many order submissions from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export function setupSecurity(app: Express) {
  // CORS configuration
  const corsOptions = {
    origin: process.env.NODE_ENV === "production" 
      ? ["https://your-domain.com"] // Replace with your actual production domain
      : ["http://localhost:5000", "http://localhost:3000"],
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  // Helmet for security headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:", "http:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Note: 'unsafe-eval' needed for Vite in dev
        connectSrc: ["'self'", "https:", "wss:", "ws:"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Disable for better compatibility
  }));

  // Apply general rate limiting to all requests
  app.use(generalLimiter);

  // Apply stricter rate limiting to API routes
  app.use("/api", apiLimiter);

  // Apply very strict rate limiting to order submissions
  app.use("/api/webhook/order", orderLimiter);

  // Additional security headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });
}

// Input validation helpers
export const validateOrderInput = [
  // Add validation rules here if needed
];
