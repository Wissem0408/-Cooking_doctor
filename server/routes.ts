import type { Express } from "express";
import { createServer, type Server } from "http";
import { validateOrderData, sanitizeInput } from "./security";

export async function registerRoutes(app: Express): Promise<Server> {
  // Webhook endpoint for order submissions
  app.post("/api/webhook/order", async (req, res) => {
    try {
      const orderData = req.body;

      // Validate input data
      const validation = validateOrderData(orderData);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid order data",
          errors: validation.errors,
        });
      }

      // Sanitize string inputs
      const sanitizedOrder = {
        ...orderData,
        fullName: sanitizeInput(orderData.fullName),
        email: sanitizeInput(orderData.email),
        phoneNumber: sanitizeInput(orderData.phoneNumber),
        deliveryAddress: sanitizeInput(orderData.deliveryAddress),
        notes: orderData.notes ? sanitizeInput(orderData.notes) : "",
      };

      // Log the sanitized order for debugging (remove in production)
      if (process.env.NODE_ENV === "development") {
        console.log("Order received:", JSON.stringify(sanitizedOrder, null, 2));
      }

      // In a real implementation, you would forward this to Make.com/Zapier
      // or process it according to your webhook configuration

      // For now, we'll just acknowledge receipt
      res.status(200).json({
        success: true,
        message: "Order received successfully",
        orderId: `ORDER_${Date.now()}`,
      });
    } catch (error) {
      console.error("Order processing error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process order",
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
