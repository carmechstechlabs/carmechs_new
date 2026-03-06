import "dotenv/config";
import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import { createServer } from "http";
import { Server } from "socket.io";
import multer from "multer";
import path from "path";
import fs from "fs";
import { supabase, getInitialState, updateTable, updateConfig, addAppointment } from "./src/services/supabaseService";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

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
  { name: "Toyota", price: 500 },
  { name: "Honda", price: 500 },
  { name: "Ford", price: 500 },
  { name: "BMW", price: 2000 },
  { name: "Mercedes", price: 2000 },
  { name: "Audi", price: 2000 },
  { name: "Hyundai", price: 0 },
  { name: "Kia", price: 0 }
];

const initialCarModels = [
  { name: "Corolla", make: "Toyota", price: 200 },
  { name: "Camry", make: "Toyota", price: 500 },
  { name: "Fortuner", make: "Toyota", price: 1000 },
  { name: "City", make: "Honda", price: 200 },
  { name: "Civic", make: "Honda", price: 400 },
  { name: "Amaze", make: "Honda", price: 0 },
  { name: "EcoSport", make: "Ford", price: 300 },
  { name: "Endeavour", make: "Ford", price: 1200 },
  { name: "3 Series", make: "BMW", price: 1500 },
  { name: "5 Series", make: "BMW", price: 2500 },
  { name: "X5", make: "BMW", price: 3500 },
  { name: "C-Class", make: "Mercedes", price: 1500 },
  { name: "E-Class", make: "Mercedes", price: 2500 },
  { name: "A4", make: "Audi", price: 1500 },
  { name: "Q7", make: "Audi", price: 3500 },
  { name: "Creta", make: "Hyundai", price: 300 },
  { name: "Verna", make: "Hyundai", price: 300 },
  { name: "Seltos", make: "Kia", price: 300 },
  { name: "Sonet", make: "Kia", price: 0 }
];

const initialFuelTypes = [
  { name: "Petrol", price: 0 },
  { name: "Diesel", price: 400 },
  { name: "CNG", price: 200 },
  { name: "Electric", price: 600 }
];

const initialSettings = {
  logoText: "CarMechs",
  logoUrl: "",
  email: "assist@carmechs.in",
  phone: "+91-70034-35356",
  address: "Newtown, Kolkata 700156",
  whatsapp: "+917003435356",
  referralRewardAmount: 500,
  facebook: "https://facebook.com/carmechs",
  instagram: "https://instagram.com/carmechs",
  twitter: "https://twitter.com/carmechs",
  footerDescription: "Premium car service at your doorstep. We provide expert care for your vehicle with free pickup and drop facility.",
  privacyPolicyUrl: "/privacy",
  termsOfServiceUrl: "/terms",
};

const initialUsers = [
  { 
    id: "1", 
    name: "Admin User", 
    email: "admin@carmechs.in", 
    phone: "1234567890", 
    password: "admin",
    role: "admin", 
    verified: true,
    blocked: false,
    walletBalance: 1000,
    referralCode: "ADMIN123",
    referralsCount: 0
  },
  { 
    id: "2", 
    name: "Test Viewer", 
    email: "viewer@carmechs.in", 
    phone: "0987654321", 
    password: "viewer",
    role: "viewer", 
    verified: true,
    blocked: false,
    walletBalance: 250,
    referralCode: "VIEWER456",
    referralsCount: 0
  },
];

const initialUiSettings = {
  heroTitle: "Expert Car Service at Your Doorstep",
  heroSubtitle: "Professional mechanics, transparent pricing, and guaranteed satisfaction.",
  heroBgImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000&auto=format&fit=crop",
  heroBgOpacity: 0.6,
  primaryColor: "#0f172a", // slate-900
  whyChooseTitle: "Why Choose CarMechs?",
  whyChooseDescription: "We are committed to providing the best car service experience. With our team of expert mechanics and state-of-the-art workshops, your car is in safe hands.",
  whyChooseImage: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  features: [
    { title: "Genuine Parts", description: "We use only 100% genuine OEM/OES spare parts.", iconName: "ShieldCheck" },
    { title: "Timely Delivery", description: "We value your time and ensure on-time delivery.", iconName: "Clock" },
    { title: "Transparent Pricing", description: "Upfront pricing with no hidden charges.", iconName: "IndianRupee" },
    { title: "Expert Mechanics", description: "Highly trained and certified mechanics.", iconName: "Wrench" }
  ],
  testimonialText: "Best service I've ever had! My car runs smoother than ever.",
  testimonialAuthor: "Alex Johnson",
  testimonialRating: 4.9,
  adminLogin: {
    loginTitle: "Terminal 01",
    loginSubtitle: "Security Clearance Required",
    loginBgColor: "#050505",
    loginAccentColor: "#fc9c0a",
    loginTerminalId: "ID_REQ_001"
  },
  userLogin: {
    loginTitle: "Welcome back",
    loginSubtitle: "Enter your details to access your account",
    loginBgColor: "#050505",
    loginAccentColor: "#3b82f6",
    showGoogleLogin: true,
    showPhoneLogin: true
  }
};

const initialApiKeys = {
  googleClientId: "",
  firebaseApiKey: "",
  firebaseAuthDomain: "",
  firebaseProjectId: "",
  firebaseStorageBucket: "",
  firebaseMessagingSenderId: "",
  firebaseAppId: "",
  razorpayKeyId: "",
  razorpayKeySecret: "",
  paytmMid: "",
  paytmMerchantKey: "",
};

const initialBrands = [
  { id: "1", name: "Toyota", imageUrl: "https://picsum.photos/seed/toyota/200/100" },
  { id: "2", name: "Honda", imageUrl: "https://picsum.photos/seed/honda/200/100" },
  { id: "3", name: "Ford", imageUrl: "https://picsum.photos/seed/ford/200/100" },
  { id: "4", name: "BMW", imageUrl: "https://picsum.photos/seed/bmw/200/100" },
  { id: "5", name: "Mercedes", imageUrl: "https://picsum.photos/seed/mercedes/200/100" },
  { id: "6", name: "Audi", imageUrl: "https://picsum.photos/seed/audi/200/100" },
];

const initialLocations = [
  { id: "1", name: "New Delhi", isPopular: true },
  { id: "2", name: "Mumbai", isPopular: true },
  { id: "3", name: "Bangalore", isPopular: true },
  { id: "4", name: "Hyderabad", isPopular: true },
  { id: "5", name: "Chennai", isPopular: true },
  { id: "6", name: "Kolkata", isPopular: true },
  { id: "7", name: "Pune", isPopular: false },
  { id: "8", name: "Ahmedabad", isPopular: false },
  { id: "9", name: "Gurgaon", isPopular: false },
  { id: "10", name: "Noida", isPopular: false },
];

const initialServicePackages = [
  {
    id: "basic-maint",
    title: "Basic Maintenance",
    description: "Essential services to keep your car running smoothly.",
    serviceIds: ["periodic", "spa"],
    discountPercentage: 10,
    basePrice: 2878,
    features: ["Oil Change", "Full Wash", "Interior Vacuuming"],
    isPopular: true,
    imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=800&auto=format&fit=crop"
  }
];

const initialAppointments = [
  {
    id: "apt-1",
    name: "John Doe",
    phone: "9876543210",
    email: "john@example.com",
    service: "periodic",
    make: "Toyota",
    model: "Corolla",
    fuel: "Petrol",
    date: new Date().toISOString(),
    time: "10:00 AM",
    status: "confirmed",
    amount: 1999,
    technicianId: "1",
    createdAt: new Date().toISOString()
  },
  {
    id: "apt-2",
    name: "Jane Smith",
    phone: "8765432109",
    email: "jane@example.com",
    service: "spa",
    make: "Honda",
    model: "City",
    fuel: "Diesel",
    date: new Date().toISOString(),
    time: "02:00 PM",
    status: "pending",
    amount: 1200,
    createdAt: new Date().toISOString()
  }
];

const initialInventory = [
  { id: "inv-1", name: "Synthetic Engine Oil", sku: "OIL-5W30-SYN", category: "Consumables", quantity: 12, minQuantity: 15, price: 850, status: "low_stock" },
  { id: "inv-2", name: "Oil Filter - Type A", sku: "FLT-TYP-A", category: "Spare Parts", quantity: 45, minQuantity: 10, price: 350, status: "in_stock" },
  { id: "inv-3", name: "Brake Pads - Front", sku: "BRK-FR-01", category: "Spare Parts", quantity: 2, minQuantity: 5, price: 1200, status: "low_stock" },
  { id: "inv-4", name: "Coolant - 1L", sku: "CLT-GRN-1L", category: "Consumables", quantity: 0, minQuantity: 5, price: 450, status: "out_of_stock" },
];

const initialReviews = [
  { id: "rev-1", userId: "user-1", userName: "Rahul Sharma", rating: 5, comment: "Excellent service! The technician was very professional and the pickup/drop was seamless.", createdAt: new Date().toISOString(), isPublished: true },
  { id: "rev-2", userId: "user-2", userName: "Priya Singh", rating: 4, comment: "Good experience overall. The car feels much smoother now.", createdAt: new Date().toISOString(), isPublished: true },
];

// In-memory state
let state = {
  services: initialServices,
  carMakes: initialCarMakes,
  carModels: initialCarModels,
  fuelTypes: initialFuelTypes,
  settings: initialSettings,
  appointments: initialAppointments,
  users: initialUsers,
  uiSettings: initialUiSettings,
  apiKeys: initialApiKeys,
  brands: initialBrands,
  locations: initialLocations,
  inventory: initialInventory,
  categories: [] as any[],
  coupons: [] as any[],
  reviews: initialReviews,
  notifications: [] as any[],
  servicePackages: initialServicePackages,
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

  // Try to load state from Supabase, fallback to initial data if it fails or not configured
  let currentState = { ...state };
  try {
    if (supabase) {
      console.log("Supabase client initialized, fetching initial state...");
      const dbState = await getInitialState();
      if (dbState) {
        // Merge with initial state to ensure all keys exist
        currentState = {
          ...state,
          ...dbState,
        };

        // Check if we need to seed any tables that are empty
        const tablesToSeed = [
          { name: 'services', data: state.services, dbData: dbState.services },
          { name: 'car_makes', data: state.carMakes, dbData: dbState.carMakes },
          { name: 'car_models', data: state.carModels, dbData: dbState.carModels },
          { name: 'fuel_types', data: state.fuelTypes, dbData: dbState.fuelTypes },
          { name: 'settings', data: state.settings, dbData: dbState.settings, isConfig: true },
          { name: 'ui_settings', data: state.uiSettings, dbData: dbState.uiSettings, isConfig: true },
          { name: 'brands', data: state.brands, dbData: dbState.brands },
          { name: 'locations', data: state.locations, dbData: dbState.locations },
          { name: 'service_packages', data: state.servicePackages, dbData: dbState.servicePackages },
          { name: 'appointments', data: state.appointments, dbData: dbState.appointments },
          { name: 'inventory', data: state.inventory, dbData: dbState.inventory },
          { name: 'reviews', data: state.reviews, dbData: dbState.reviews },
        ];

        for (const table of tablesToSeed) {
          const isEmpty = table.isConfig 
            ? Object.keys(table.dbData || {}).length === 0 
            : (table.dbData || []).length === 0;
          
          if (isEmpty && table.data) {
            console.log(`Seeding table ${table.name} with initial data...`);
            if (table.isConfig) {
              await updateConfig(table.name, table.data as any);
            } else {
              await updateTable(table.name, table.data as any[]);
            }
          }
        }

        // Re-fetch state after seeding to be sure
        const seededState = await getInitialState();
        if (seededState) {
          currentState = {
            ...state,
            ...seededState,
          };
        }
        
        console.log("State loaded and synchronized with Supabase");

        // Set up Realtime Subscriptions
        supabase
          .channel('db-changes')
          .on('postgres_changes', { event: '*', schema: 'public' }, async (payload) => {
            console.log('Change received from Supabase:', payload.table, payload.eventType);
            
            // Refresh the specific part of the state that changed
            const newState = await getInitialState();
            if (newState) {
              currentState = {
                ...currentState,
                ...newState,
                // Ensure we keep the merged structure
                services: newState.services.length > 0 ? newState.services : currentState.services,
                carMakes: newState.carMakes.length > 0 ? newState.carMakes : currentState.carMakes,
                carModels: newState.carModels.length > 0 ? newState.carModels : currentState.carModels,
                fuelTypes: newState.fuelTypes.length > 0 ? newState.fuelTypes : currentState.fuelTypes,
                settings: Object.keys(newState.settings).length > 0 ? newState.settings : currentState.settings,
                uiSettings: Object.keys(newState.uiSettings).length > 0 ? newState.uiSettings : currentState.uiSettings,
                apiKeys: Object.keys(newState.apiKeys).length > 0 ? newState.apiKeys : currentState.apiKeys,
                brands: newState.brands.length > 0 ? newState.brands : currentState.brands,
                locations: newState.locations?.length > 0 ? newState.locations : currentState.locations,
                inventory: newState.inventory?.length > 0 ? newState.inventory : currentState.inventory,
                categories: newState.categories?.length > 0 ? newState.categories : currentState.categories,
                coupons: newState.coupons?.length > 0 ? newState.coupons : currentState.coupons,
                reviews: newState.reviews?.length > 0 ? newState.reviews : currentState.reviews,
                notifications: newState.notifications?.length > 0 ? newState.notifications : currentState.notifications,
                servicePackages: newState.servicePackages?.length > 0 ? newState.servicePackages : currentState.servicePackages,
                users: newState.users.length > 0 ? newState.users : currentState.users,
                appointments: newState.appointments.length > 0 ? newState.appointments : currentState.appointments,
              };

              // Broadcast to all connected clients
              io.emit("initial_state", currentState);
            }
          })
          .subscribe();
      }
    }
  } catch (error) {
    console.error("Failed to load state from Supabase, using in-memory defaults:", error);
  }

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    // Send current state to the newly connected client
    socket.emit("initial_state", currentState);

    // Handle updates from clients
    socket.on("update_services", async (services) => {
      console.log("Updating services...");
      currentState.services = services;
      socket.broadcast.emit("services_updated", services);
      await updateTable('services', services);
    });

    socket.on("update_car_makes", async (makes) => {
      console.log("Updating car makes...");
      currentState.carMakes = makes;
      socket.broadcast.emit("car_makes_updated", makes);
      await updateTable('car_makes', makes);
    });

    socket.on("update_car_models", async (models) => {
      console.log("Updating car models...");
      currentState.carModels = models;
      socket.broadcast.emit("car_models_updated", models);
      await updateTable('car_models', models);
    });

    socket.on("update_fuel_types", async (fuels) => {
      console.log("Updating fuel types...");
      currentState.fuelTypes = fuels;
      socket.broadcast.emit("fuel_types_updated", fuels);
      await updateTable('fuel_types', fuels);
    });

    socket.on("update_settings", async (settings) => {
      console.log("Updating settings...");
      currentState.settings = settings;
      socket.broadcast.emit("settings_updated", settings);
      await updateConfig('settings', settings);
    });

    socket.on("update_appointments", async (appointments) => {
      console.log("Updating appointments...");
      currentState.appointments = appointments;
      socket.broadcast.emit("appointments_updated", appointments);
      await updateTable('appointments', appointments);
    });

    socket.on("add_appointment", async (appointment) => {
      console.log("Adding appointment...");
      currentState.appointments = [appointment, ...currentState.appointments];
      io.emit("appointments_updated", currentState.appointments);
      await addAppointment(appointment);
    });

    socket.on("update_users", async (users) => {
      console.log("Updating users...");
      currentState.users = users;
      socket.broadcast.emit("users_updated", users);
      await updateTable('users', users);
    });

    socket.on("update_ui_settings", async (uiSettings) => {
      console.log("Updating UI settings...");
      currentState.uiSettings = uiSettings;
      socket.broadcast.emit("ui_settings_updated", uiSettings);
      await updateConfig('ui_settings', uiSettings);
    });

    socket.on("update_api_keys", async (apiKeys) => {
      console.log("Updating API keys...");
      currentState.apiKeys = apiKeys;
      socket.broadcast.emit("api_keys_updated", apiKeys);
      await updateConfig('api_keys', apiKeys);
    });

    socket.on("update_brands", async (brands) => {
      console.log("Updating brands...");
      currentState.brands = brands;
      socket.broadcast.emit("brands_updated", brands);
      await updateTable('brands', brands);
    });

    socket.on("update_locations", async (locations) => {
      console.log("Updating locations...");
      currentState.locations = locations;
      socket.broadcast.emit("locations_updated", locations);
      await updateTable('locations', locations);
    });

    socket.on("update_inventory", async (inventory) => {
      console.log("Updating inventory...");
      currentState.inventory = inventory;
      socket.broadcast.emit("inventory_updated", inventory);
      await updateTable('inventory', inventory);
    });

    socket.on("update_categories", async (categories) => {
      console.log("Updating categories...");
      currentState.categories = categories;
      socket.broadcast.emit("categories_updated", categories);
      await updateTable('categories', categories);
    });

    socket.on("update_coupons", async (coupons) => {
      console.log("Updating coupons...");
      currentState.coupons = coupons;
      socket.broadcast.emit("coupons_updated", coupons);
      await updateTable('coupons', coupons);
    });

    socket.on("update_reviews", async (reviews) => {
      console.log("Updating reviews...");
      currentState.reviews = reviews;
      socket.broadcast.emit("reviews_updated", reviews);
      await updateTable('reviews', reviews);
    });

    socket.on("update_notifications", async (notifications) => {
      console.log("Updating notifications...");
      currentState.notifications = notifications;
      socket.broadcast.emit("notifications_updated", notifications);
      await updateTable('notifications', notifications);
    });

    socket.on("update_service_packages", async (packages) => {
      console.log("Updating service packages...");
      currentState.servicePackages = packages;
      socket.broadcast.emit("service_packages_updated", packages);
      await updateTable('service_packages', packages);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  app.use(express.json());
  app.use("/uploads", express.static(uploadsDir));

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Try to upload to Supabase Storage if configured
    if (supabase) {
      try {
        const fileContent = fs.readFileSync(req.file.path);
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(fileName, fileContent, {
            contentType: req.file.mimetype,
            upsert: true
          });

        if (error) {
          console.error("Supabase storage upload error:", error);
          // Fallback to local URL if Supabase fails but file is saved locally
          const localUrl = `/uploads/${req.file.filename}`;
          return res.json({ url: localUrl });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(fileName);

        // Clean up local file after successful upload to Supabase
        fs.unlinkSync(req.file.path);

        return res.json({ url: publicUrl });
      } catch (err) {
        console.error("Unexpected error during Supabase upload:", err);
      }
    }

    // Fallback to local storage
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  });

  app.post("/api/send-confirmation", async (req, res) => {
    const { email, name, date, time, serviceTitle, make, model, fuel } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      const smtpHost = (process.env.SMTP_HOST || '').replace(/^["']|["']$/g, '');
      const smtpUser = (process.env.SMTP_USER || '').replace(/^["']|["']$/g, '');
      const smtpPass = (process.env.SMTP_PASS || '').replace(/^["']|["']$/g, '');
      const smtpPort = (process.env.SMTP_PORT || '').replace(/^["']|["']$/g, '');
      const smtpSecure = (process.env.SMTP_SECURE || '').replace(/^["']|["']$/g, '') === 'true';

      let transporter;
      
      if (smtpHost && smtpUser && smtpPass) {
        transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(smtpPort || "587"),
          secure: smtpSecure,
          auth: {
            user: smtpUser,
            pass: smtpPass,
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
