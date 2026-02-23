import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import { createServer } from "http";
import { Server } from "socket.io";

// Initial Data
const initialServices = [
  {
    id: "periodic",
    title: "Periodic Services",
    description: "Comprehensive car service packages for complete peace of mind.",
    features: ["Oil Change", "Filter Replacement", "Brake Check", "Fluid Top-up"],
    price: "₹1999",
    basePrice: 1999,
    duration: "4-6 Hours",
    checks: ["Engine Oil Replacement", "Oil Filter Replacement", "Air Filter Cleaning", "Coolant Top-up", "Brake Fluid Top-up", "Battery Water Top-up", "Wiper Fluid Top-up", "Heater/Spark Plugs Checking", "Car Wash & Vacuuming", "Brake Pads & Shoes Cleaning"]
  },
  {
    id: "tyres",
    title: "Tyres & Wheels",
    description: "Expert tyre services including alignment and balancing.",
    features: ["Wheel Alignment", "Wheel Balancing", "Tyre Rotation", "Puncture Repair"],
    price: "₹999",
    basePrice: 999,
    duration: "1-2 Hours",
    checks: ["Automated Wheel Balancing", "Laser Wheel Alignment", "Tyre Rotation (4 Wheels)", "Tyre Health Inspection", "Air Pressure Check", "Steering Adjustment", "Suspension Check"]
  },
  {
    id: "batteries",
    title: "Batteries",
    description: "Battery health check and replacement services.",
    features: ["Battery Testing", "Charging System Check", "Terminal Cleaning", "Replacement"],
    price: "₹3499",
    basePrice: 3499,
    duration: "30-60 Minutes",
    checks: ["Battery Voltage Check", "Alternator Charging Check", "Terminal Cleaning & Greasing", "Distilled Water Top-up", "Battery Health Report", "Old Battery Buyback", "Warranty Registration"]
  },
  {
    id: "denting",
    title: "Denting & Painting",
    description: "Restore your car's look with our premium painting services.",
    features: ["Scratch Removal", "Dent Repair", "Full Body Paint", "Polishing"],
    price: "Custom",
    basePrice: 4999,
    duration: "2-5 Days",
    checks: ["Grade A Primer Application", "Premium Paint Matching", "3-Layer Painting Process", "Clear Coat Application", "Rubbing & Polishing", "Panel Dent Removal", "Rust Protection Coating"]
  },
  {
    id: "ac",
    title: "AC Service",
    description: "Keep your car cool with our AC maintenance packages.",
    features: ["Gas Refill", "Cooling Coil Cleaning", "Compressor Check", "Leak Test"],
    price: "₹1499",
    basePrice: 1499,
    duration: "2-3 Hours",
    checks: ["AC Gas Refill (up to 400g)", "Cooling Coil Cleaning", "Condenser Cleaning", "AC Vent Cleaning", "Compressor Oil Check", "Leakage Inspection", "Cabin Filter Cleaning"]
  },
  {
    id: "spa",
    title: "Car Spa & Cleaning",
    description: "Deep cleaning services for interior and exterior.",
    features: ["Interior Detailing", "Exterior Wash", "Waxing", "Upholstery Cleaning"],
    price: "₹1199",
    basePrice: 1199,
    duration: "3-4 Hours",
    checks: ["Complete Interior Vacuuming", "Dashboard Cleaning & Polishing", "Seats Dry Cleaning", "Roof & Floor Cleaning", "Exterior Foam Wash", "Tyre Dressing", "Glass Cleaning"]
  },
];

const initialCarMakes = [
  { name: "Toyota", multiplier: 1.1 },
  { name: "Honda", multiplier: 1.1 },
  { name: "Ford", multiplier: 1.1 },
  { name: "BMW", multiplier: 2.0 },
  { name: "Mercedes", multiplier: 2.0 },
  { name: "Audi", multiplier: 2.0 },
  { name: "Hyundai", multiplier: 1.0 },
  { name: "Kia", multiplier: 1.0 }
];

const initialCarModels = [
  { name: "Corolla", make: "Toyota", multiplier: 1.1 },
  { name: "Camry", make: "Toyota", multiplier: 1.2 },
  { name: "Fortuner", make: "Toyota", multiplier: 1.4 },
  { name: "City", make: "Honda", multiplier: 1.1 },
  { name: "Civic", make: "Honda", multiplier: 1.2 },
  { name: "Amaze", make: "Honda", multiplier: 1.0 },
  { name: "EcoSport", make: "Ford", multiplier: 1.1 },
  { name: "Endeavour", make: "Ford", multiplier: 1.4 },
  { name: "3 Series", make: "BMW", multiplier: 1.5 },
  { name: "5 Series", make: "BMW", multiplier: 1.6 },
  { name: "X5", make: "BMW", multiplier: 1.8 },
  { name: "C-Class", make: "Mercedes", multiplier: 1.5 },
  { name: "E-Class", make: "Mercedes", multiplier: 1.6 },
  { name: "A4", make: "Audi", multiplier: 1.5 },
  { name: "Q7", make: "Audi", multiplier: 1.8 },
  { name: "Creta", make: "Hyundai", multiplier: 1.1 },
  { name: "Verna", make: "Hyundai", multiplier: 1.1 },
  { name: "Seltos", make: "Kia", multiplier: 1.1 },
  { name: "Sonet", make: "Kia", multiplier: 1.0 }
];

const initialFuelTypes = [
  { name: "Petrol", multiplier: 1.0 },
  { name: "Diesel", multiplier: 1.15 },
  { name: "CNG", multiplier: 1.1 },
  { name: "Electric", multiplier: 1.2 }
];

const initialSettings = {
  logoText: "CarMechs",
  email: "assist@carmechs.in",
  phone: "+91-70034-35356",
  address: "Newtown, Kolkata 700156",
  whatsapp: "+917003435356",
};

const initialUsers = [
  { id: "1", name: "Admin User", email: "admin@carmechs.in", phone: "1234567890", role: "admin", verified: true },
  { id: "2", name: "Test Viewer", email: "viewer@carmechs.in", phone: "0987654321", role: "viewer", verified: true },
];

const initialUiSettings = {
  heroTitle: "Expert Car Service at Your Doorstep",
  heroSubtitle: "Professional mechanics, transparent pricing, and guaranteed satisfaction.",
  primaryColor: "#0f172a", // slate-900
};

const initialApiKeys = {
  googleClientId: "",
  firebaseApiKey: "",
};

// In-memory state
let state = {
  services: initialServices,
  carMakes: initialCarMakes,
  carModels: initialCarModels,
  fuelTypes: initialFuelTypes,
  settings: initialSettings,
  appointments: [] as any[],
  users: initialUsers,
  uiSettings: initialUiSettings,
  apiKeys: initialApiKeys,
};

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    // Send initial state to the newly connected client
    socket.emit("initial_state", state);

    // Handle updates from clients
    socket.on("update_services", (services) => {
      state.services = services;
      socket.broadcast.emit("services_updated", services);
    });

    socket.on("update_car_makes", (makes) => {
      state.carMakes = makes;
      socket.broadcast.emit("car_makes_updated", makes);
    });

    socket.on("update_car_models", (models) => {
      state.carModels = models;
      socket.broadcast.emit("car_models_updated", models);
    });

    socket.on("update_fuel_types", (fuels) => {
      state.fuelTypes = fuels;
      socket.broadcast.emit("fuel_types_updated", fuels);
    });

    socket.on("update_settings", (settings) => {
      state.settings = settings;
      socket.broadcast.emit("settings_updated", settings);
    });

    socket.on("update_appointments", (appointments) => {
      state.appointments = appointments;
      socket.broadcast.emit("appointments_updated", appointments);
    });

    socket.on("add_appointment", (appointment) => {
      state.appointments = [appointment, ...state.appointments];
      io.emit("appointments_updated", state.appointments); // Broadcast to all, including sender, or just broadcast and let sender update locally
    });

    socket.on("update_users", (users) => {
      state.users = users;
      socket.broadcast.emit("users_updated", users);
    });

    socket.on("update_ui_settings", (uiSettings) => {
      state.uiSettings = uiSettings;
      socket.broadcast.emit("ui_settings_updated", uiSettings);
    });

    socket.on("update_api_keys", (apiKeys) => {
      state.apiKeys = apiKeys;
      socket.broadcast.emit("api_keys_updated", apiKeys);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/send-confirmation", async (req, res) => {
    const { email, name, date, time, serviceTitle, make, model, fuel } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      // Create a test account if no credentials are provided
      // In a real app, you would use environment variables for SMTP credentials
      let transporter;
      
      if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      } else {
        // Fallback to Ethereal Email for testing if no SMTP credentials are provided
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: "smtp.ethereal.email",
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
      }

      const info = await transporter.sendMail({
        from: '"Car Service Center" <noreply@carservice.com>',
        to: email,
        subject: "Booking Confirmation - Car Service Center",
        text: `Hello ${name},\n\nYour appointment for ${serviceTitle} has been confirmed.\n\nDetails:\nVehicle: ${make} ${model} (${fuel})\nDate: ${date}\nTime: ${time}\n\nThank you for choosing us!`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Booking Confirmation</h2>
            <p>Hello <strong>${name}</strong>,</p>
            <p>Your appointment has been successfully confirmed. Here are the details:</p>
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Service:</strong> ${serviceTitle}</p>
              <p><strong>Vehicle:</strong> ${make} ${model} (${fuel})</p>
              <p><strong>Date:</strong> ${date}</p>
              <p><strong>Time:</strong> ${time}</p>
            </div>
            <p>If you need to reschedule or cancel, please contact us.</p>
            <p>Thank you for choosing Car Service Center!</p>
          </div>
        `,
      });

      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("Preview URL: %s", previewUrl);
      }

      res.json({ success: true, previewUrl });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
