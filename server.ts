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
    title: "Periodic Maintenance",
    description: "Comprehensive multi-point inspection and oil change service.",
    features: ["Engine Oil Change", "Oil Filter Replacement", "Air Filter Cleaning", "Coolant Top-up", "Brake Fluid Check", "Battery Water Top-up"],
    price: "₹1,999",
    basePrice: 1999,
    duration: "3-4 Hours",
    iconName: "Wrench",
    checks: ["Engine Oil Replacement", "Oil Filter Replacement", "Air Filter Cleaning", "Coolant Top-up", "Brake Fluid Top-up", "Battery Water Top-up", "Spark Plug Cleaning", "Brake Pad Cleaning", "Exterior Wash", "Interior Vacuuming"]
  },
  {
    id: "tyres",
    title: "Tyres & Wheel Care",
    description: "Expert tyre services including alignment and balancing.",
    features: ["Wheel Alignment", "Wheel Balancing", "Tyre Rotation", "Puncture Repair", "Rim Inspection", "Nitrogen Inflation"],
    price: "₹999",
    basePrice: 999,
    duration: "1-2 Hours",
    iconName: "Disc",
    checks: ["Automated Wheel Balancing", "Laser Wheel Alignment", "Tyre Rotation (4 Wheels)", "Tyre Health Inspection", "Air Pressure Check", "Steering Adjustment", "Suspension Check"]
  },
  {
    id: "batteries",
    title: "Batteries",
    description: "Battery health check and replacement services.",
    features: ["Battery Testing", "Charging System Check", "Terminal Cleaning", "Replacement", "Voltage Analysis", "Alternator Test"],
    price: "₹3,499",
    basePrice: 3499,
    duration: "30-60 Minutes",
    iconName: "Battery",
    checks: ["Battery Voltage Check", "Alternator Charging Check", "Terminal Cleaning & Greasing", "Distilled Water Top-up", "Battery Health Report", "Old Battery Buyback", "Warranty Registration"]
  },
  {
    id: "denting",
    title: "Denting & Painting",
    description: "Restore your car's look with our premium painting services.",
    features: ["Scratch Removal", "Dent Repair", "Full Body Paint", "Polishing", "Color Matching", "Clear Coat Protection"],
    price: "Custom",
    basePrice: 4999,
    duration: "2-5 Days",
    iconName: "Sparkles",
    checks: ["Grade A Primer Application", "Premium Paint Matching", "3-Layer Painting Process", "Clear Coat Application", "Rubbing & Polishing", "Panel Dent Removal", "Rust Protection Coating"]
  },
  {
    id: "ac",
    title: "AC Service",
    description: "Keep your car cool with our AC maintenance packages.",
    features: ["Gas Refill", "Cooling Coil Cleaning", "Compressor Check", "Leak Test", "Vent Disinfection", "Filter Replacement"],
    price: "₹1,499",
    basePrice: 1499,
    duration: "2-3 Hours",
    iconName: "Wind",
    checks: ["AC Gas Refill (up to 400g)", "Cooling Coil Cleaning", "Condenser Cleaning", "AC Vent Cleaning", "Compressor Oil Check", "Leakage Inspection", "Cabin Filter Cleaning"]
  },
  {
    id: "spa",
    title: "Car Spa & Cleaning",
    description: "Deep cleaning services for interior and exterior.",
    features: ["Interior Detailing", "Exterior Wash", "Waxing", "Upholstery Cleaning", "Dashboard Polishing", "Engine Bay Cleaning"],
    price: "₹1,199",
    basePrice: 1199,
    duration: "3-4 Hours",
    iconName: "Droplets",
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
  linkedin: "https://linkedin.com/company/carmechs",
  footerDescription: "Precision car care delivered to your doorstep. Expert mechanics, transparent pricing, and OEM parts for ultimate peace of mind.",
  privacyPolicyUrl: "/privacy",
  termsOfServiceUrl: "/terms",
};

const initialUsers = [
  { 
    id: "1", 
    name: "Admin User", 
    email: "admin@carmechs.in", 
    phone: "1234567890", 
    password: "Admin@270389",
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
  heroTitle: "Precision <br /><span class=\"text-primary\">Car Care</span>",
  heroSubtitle: "Experience the next generation of car maintenance with our expert door-step service and transparent digital tracking.",
  heroBgImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2000&auto=format&fit=crop",
  heroBgOpacity: 0.6,
  heroVideoUrl: "https://cdn.pixabay.com/video/2020/09/24/50923-463863484_large.mp4",
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
  { 
    id: "1", 
    name: "New Delhi Hub", 
    address: "Plot 12, Okhla Phase III", 
    city: "New Delhi", 
    phone: "+91-11-4567-8901", 
    email: "delhi@carmechs.in", 
    latitude: 28.5355, 
    longitude: 77.2737, 
    isPopular: true, 
    workingHours: "09:00 AM - 08:00 PM" 
  },
  { 
    id: "2", 
    name: "Mumbai West", 
    address: "Andheri East, Near Metro Station", 
    city: "Mumbai", 
    phone: "+91-22-2345-6789", 
    email: "mumbai@carmechs.in", 
    latitude: 19.1136, 
    longitude: 72.8697, 
    isPopular: true, 
    workingHours: "09:00 AM - 09:00 PM" 
  },
  { 
    id: "3", 
    name: "Bangalore Tech Park", 
    address: "Whitefield Main Road", 
    city: "Bangalore", 
    phone: "+91-80-3456-7890", 
    email: "blr@carmechs.in", 
    latitude: 12.9698, 
    longitude: 77.7499, 
    isPopular: true, 
    workingHours: "08:30 AM - 07:30 PM" 
  },
  { 
    id: "4", 
    name: "Hyderabad Central", 
    address: "Hitech City, Madhapur", 
    city: "Hyderabad", 
    phone: "+91-40-4567-1234", 
    email: "hyd@carmechs.in", 
    latitude: 17.4483, 
    longitude: 78.3915, 
    isPopular: true, 
    workingHours: "09:00 AM - 08:00 PM" 
  },
  { 
    id: "5", 
    name: "Chennai Coastal", 
    address: "OMR Road, Thoraipakkam", 
    city: "Chennai", 
    phone: "+91-44-5678-9012", 
    email: "chennai@carmechs.in", 
    latitude: 12.9344, 
    longitude: 80.2311, 
    isPopular: true, 
    workingHours: "09:00 AM - 08:00 PM" 
  },
  { 
    id: "6", 
    name: "Kolkata Newtown", 
    address: "Action Area 1, Newtown", 
    city: "Kolkata", 
    phone: "+91-33-6789-0123", 
    email: "kolkata@carmechs.in", 
    latitude: 22.5867, 
    longitude: 88.4748, 
    isPopular: true, 
    workingHours: "09:00 AM - 07:00 PM" 
  },
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
    priority: "high",
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
    priority: "medium",
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
  tasks: [] as any[],
  missingTables: [] as string[],
};

const DATA_FILE = path.join(process.cwd(), "data.json");

function saveLocalState(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error saving local state:", err);
  }
}

function loadLocalState() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error loading local state:", err);
  }
  return null;
}

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

  // Try to load state from local file first, then Supabase, fallback to initial data
  let currentState = loadLocalState() || { ...state };
  
  try {
    if (supabase) {
      console.log("Supabase client initialized, fetching initial state...");
      
      // Ensure 'uploads' bucket exists
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError) {
        console.error("Error listing buckets:", bucketsError);
      } else {
        const bucket = buckets.find(b => b.name === 'uploads');
        if (!bucket) {
          console.log("Creating 'uploads' bucket in Supabase storage...");
          const { error: createError } = await supabase.storage.createBucket('uploads', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
            fileSizeLimit: 5242880 // 5MB
          });
          if (createError) {
            console.error("Error creating 'uploads' bucket:", createError);
          } else {
            console.log("'uploads' bucket created successfully");
          }
        } else if (!bucket.public) {
          console.log("Updating 'uploads' bucket to be public...");
          await supabase.storage.updateBucket('uploads', { public: true });
        }
      }

      const dbState = await getInitialState();
      if (dbState) {
        // Merge with current state, prioritizing DB data if it exists
        currentState = {
          ...currentState,
          ...dbState,
          // Only use DB data if it's not empty
          services: dbState.services.length > 0 ? dbState.services : currentState.services,
          carMakes: dbState.carMakes.length > 0 ? dbState.carMakes : currentState.carMakes,
          carModels: dbState.carModels.length > 0 ? dbState.carModels : currentState.carModels,
          fuelTypes: dbState.fuelTypes.length > 0 ? dbState.fuelTypes : currentState.fuelTypes,
          settings: Object.keys(dbState.settings).length > 0 ? dbState.settings : currentState.settings,
          uiSettings: Object.keys(dbState.uiSettings).length > 0 ? dbState.uiSettings : currentState.uiSettings,
          brands: dbState.brands.length > 0 ? dbState.brands : currentState.brands,
          locations: dbState.locations.length > 0 ? dbState.locations : currentState.locations,
          servicePackages: dbState.servicePackages.length > 0 ? dbState.servicePackages : currentState.servicePackages,
          appointments: dbState.appointments.length > 0 ? dbState.appointments : currentState.appointments,
          inventory: dbState.inventory.length > 0 ? dbState.inventory : currentState.inventory,
          reviews: dbState.reviews.length > 0 ? dbState.reviews : currentState.reviews,
          users: dbState.users.length > 0 ? dbState.users : currentState.users,
        };

        // Seed empty tables
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
          { name: 'categories', data: state.categories, dbData: dbState.categories },
        ];

        for (const table of tablesToSeed) {
          // Skip seeding if table is missing
          const isTableMissing = dbState.missingTables?.includes(table.name) || 
                                (table.isConfig && dbState.missingTables?.includes('site_config'));
          
          if (isTableMissing) {
            console.warn(`Skipping seeding for missing table: ${table.name}`);
            continue;
          }

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
        
        saveLocalState(currentState);
        console.log("State synchronized with Supabase and persisted locally");

        // Set up Realtime Subscriptions
        supabase
          .channel('db-changes')
          .on('postgres_changes', { event: '*', schema: 'public' }, async (payload) => {
            console.log('Change received from Supabase:', payload.table, payload.eventType);
            const newState = await getInitialState();
            if (newState) {
              currentState = { ...currentState, ...newState };
              saveLocalState(currentState);
              io.emit("initial_state", currentState);
            }
          })
          .subscribe();
      }
    }
  } catch (error) {
    console.error("Failed to load state from Supabase:", error);
  }

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    socket.emit("initial_state", currentState);

    socket.on("update_services", async (services) => {
      currentState.services = services;
      saveLocalState(currentState);
      socket.broadcast.emit("services_updated", services);
      await updateTable('services', services);
    });

    socket.on("update_car_makes", async (makes) => {
      currentState.carMakes = makes;
      saveLocalState(currentState);
      socket.broadcast.emit("car_makes_updated", makes);
      await updateTable('car_makes', makes);
    });

    socket.on("update_car_models", async (models) => {
      currentState.carModels = models;
      saveLocalState(currentState);
      socket.broadcast.emit("car_models_updated", models);
      await updateTable('car_models', models);
    });

    socket.on("update_fuel_types", async (fuels) => {
      currentState.fuelTypes = fuels;
      saveLocalState(currentState);
      socket.broadcast.emit("fuel_types_updated", fuels);
      await updateTable('fuel_types', fuels);
    });

    socket.on("update_settings", async (settings) => {
      currentState.settings = settings;
      saveLocalState(currentState);
      socket.broadcast.emit("settings_updated", settings);
      await updateConfig('settings', settings);
    });

    socket.on("update_appointments", async (appointments) => {
      currentState.appointments = appointments;
      saveLocalState(currentState);
      socket.broadcast.emit("appointments_updated", appointments);
      await updateTable('appointments', appointments);
    });

    socket.on("update_tasks", async (tasks) => {
      currentState.tasks = tasks;
      saveLocalState(currentState);
      socket.broadcast.emit("tasks_updated", tasks);
      await updateTable('tasks', tasks);
    });

    socket.on("add_appointment", async (appointment) => {
      currentState.appointments = [appointment, ...currentState.appointments];
      saveLocalState(currentState);
      io.emit("appointments_updated", currentState.appointments);
      await addAppointment(appointment);
    });

    socket.on("add_task", async (task) => {
      currentState.tasks = [task, ...currentState.tasks];
      saveLocalState(currentState);
      io.emit("tasks_updated", currentState.tasks);
      await updateTable('tasks', currentState.tasks);
    });

    socket.on("update_users", async (users) => {
      currentState.users = users;
      saveLocalState(currentState);
      socket.broadcast.emit("users_updated", users);
      await updateTable('users', users);
    });

    socket.on("update_ui_settings", async (uiSettings) => {
      currentState.uiSettings = uiSettings;
      saveLocalState(currentState);
      socket.broadcast.emit("ui_settings_updated", uiSettings);
      await updateConfig('ui_settings', uiSettings);
    });

    socket.on("update_api_keys", async (apiKeys) => {
      currentState.apiKeys = apiKeys;
      saveLocalState(currentState);
      socket.broadcast.emit("api_keys_updated", apiKeys);
      await updateConfig('api_keys', apiKeys);
    });

    socket.on("update_brands", async (brands) => {
      currentState.brands = brands;
      saveLocalState(currentState);
      socket.broadcast.emit("brands_updated", brands);
      await updateTable('brands', brands);
    });

    socket.on("update_locations", async (locations) => {
      currentState.locations = locations;
      saveLocalState(currentState);
      socket.broadcast.emit("locations_updated", locations);
      await updateTable('locations', locations);
    });

    socket.on("update_inventory", async (inventory) => {
      currentState.inventory = inventory;
      saveLocalState(currentState);
      socket.broadcast.emit("inventory_updated", inventory);
      await updateTable('inventory', inventory);
    });

    socket.on("update_categories", async (categories) => {
      currentState.categories = categories;
      saveLocalState(currentState);
      socket.broadcast.emit("categories_updated", categories);
      await updateTable('categories', categories);
    });

    socket.on("update_coupons", async (coupons) => {
      currentState.coupons = coupons;
      saveLocalState(currentState);
      socket.broadcast.emit("coupons_updated", coupons);
      await updateTable('coupons', coupons);
    });

    socket.on("update_reviews", async (reviews) => {
      currentState.reviews = reviews;
      saveLocalState(currentState);
      socket.broadcast.emit("reviews_updated", reviews);
      await updateTable('reviews', reviews);
    });

    socket.on("update_notifications", async (notifications) => {
      currentState.notifications = notifications;
      saveLocalState(currentState);
      socket.broadcast.emit("notifications_updated", notifications);
      await updateTable('notifications', notifications);
    });

    socket.on("update_service_packages", async (packages) => {
      currentState.servicePackages = packages;
      saveLocalState(currentState);
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

  app.get("/sitemap.xml", (req, res) => {
    const pages = currentState.uiSettings.pages || [];
    const baseUrl = process.env.APP_URL || "https://carmechs.run.app";
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages or pages from uiSettings
    pages.forEach((page: any) => {
      if (page.isPublished && (page.seo?.enableIndexing !== false)) {
        const url = `${baseUrl}${page.slug === "" || page.slug === "home" ? "" : "/" + page.slug}`;
        xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.slug === "" || page.slug === "home" ? "1.0" : "0.8"}</priority>
  </url>`;
      }
    });

    xml += `
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
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
          if (error.message.includes('Bucket not found')) {
            console.log("Bucket 'uploads' not found during upload, attempting to create it...");
            await supabase.storage.createBucket('uploads', { public: true });
            // Retry upload
            const { data: retryData, error: retryError } = await supabase.storage
              .from('uploads')
              .upload(fileName, fileContent, {
                contentType: req.file.mimetype,
                upsert: true
              });
            
            if (!retryError) {
              const { data: { publicUrl } } = supabase.storage
                .from('uploads')
                .getPublicUrl(fileName);
              fs.unlinkSync(req.file.path);
              return res.json({ url: publicUrl });
            }
          }
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
