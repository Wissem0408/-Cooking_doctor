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
  const isDevelopment = process.env.NODE_ENV === "development";

  // CORS configuration
  const corsOptions = {
    origin: isDevelopment
      ? ["http://localhost:5000", "http://localhost:3000", "http://localhost:4173"]
      : ["https://your-domain.com"], // Replace with your actual production domain
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  // Helmet for security headers with development-friendly settings
  if (isDevelopment) {
    // More relaxed CSP for development (Vite needs these permissions)
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
          fontSrc: ["'self'", "https:", "http:", "data:"],
          imgSrc: ["'self'", "data:", "https:", "http:", "blob:"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
          connectSrc: ["'self'", "https:", "http:", "wss:", "ws:"],
          frameSrc: ["'self'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));
  } else {
    // Stricter CSP for production
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
          connectSrc: ["'self'", "https:"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    }));
  }

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
