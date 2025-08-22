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

  // CORS configuration - more permissive for development
  if (isDevelopment) {
    app.use(cors({
      origin: true, // Allow all origins in development
      credentials: true,
      optionsSuccessStatus: 200,
    }));
  } else {
    app.use(cors({
      origin: ["https://your-domain.com"], // Replace with your actual production domain
      credentials: true,
      optionsSuccessStatus: 200,
    }));
  }

  // Helmet for security headers with development-friendly settings
  if (isDevelopment) {
    // Disable CSP in development to avoid conflicts with Vite
    app.use(helmet({
      contentSecurityPolicy: false,
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

  // Apply rate limiting only in production or when explicitly needed
  if (!isDevelopment) {
    // Apply general rate limiting to all requests
    app.use(generalLimiter);

    // Apply stricter rate limiting to API routes
    app.use("/api", apiLimiter);

    // Apply very strict rate limiting to order submissions
    app.use("/api/webhook/order", orderLimiter);
  } else {
    console.log("Rate limiting disabled in development mode");
  }

  // Additional security headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    next();
  });

  // Security monitoring middleware
  app.use((req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Log suspicious activity
    if (req.path.includes('..') || req.path.includes('<script>') || req.path.includes('SELECT')) {
      console.warn(`🚨 Suspicious request from ${clientIP}: ${req.method} ${req.path}`, {
        userAgent,
        body: req.body,
        query: req.query
      });
    }

    // Log API requests in production for monitoring
    if (process.env.NODE_ENV === "production" && req.path.startsWith('/api/')) {
      console.log(`API Request: ${req.method} ${req.path} from ${clientIP}`);
    }

    next();
  });
}

// Input validation helpers
export function validateOrderData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Required fields validation
  if (!data.fullName || typeof data.fullName !== 'string' || data.fullName.trim().length === 0) {
    errors.push("Full name is required");
  }

  if (!data.email || typeof data.email !== 'string' || !isValidEmail(data.email)) {
    errors.push("Valid email is required");
  }

  if (!data.phoneNumber || typeof data.phoneNumber !== 'string' || data.phoneNumber.trim().length === 0) {
    errors.push("Phone number is required");
  }

  if (!data.deliveryAddress || typeof data.deliveryAddress !== 'string' || data.deliveryAddress.trim().length === 0) {
    errors.push("Delivery address is required");
  }

  if (!data.deliveryDate || typeof data.deliveryDate !== 'string') {
    errors.push("Delivery date is required");
  }

  if (!data.deliveryTime || typeof data.deliveryTime !== 'string') {
    errors.push("Delivery time is required");
  }

  if (!data.products || !Array.isArray(data.products) || data.products.length === 0) {
    errors.push("At least one product is required");
  }

  // String length limits
  if (data.fullName && data.fullName.length > 100) {
    errors.push("Full name too long");
  }

  if (data.phoneNumber && data.phoneNumber.length > 20) {
    errors.push("Phone number too long");
  }

  if (data.notes && data.notes.length > 500) {
    errors.push("Notes too long");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>\"']/g, '') // Remove potential XSS characters
    .trim()
    .slice(0, 1000); // Limit length
}
