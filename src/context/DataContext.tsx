import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { onAuthStateChanged, signOut, User as FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirebaseAuth, getFirebaseConfig } from '@/lib/firebase';
import { getInitialState, updateTable, updateConfig, addAppointment as dbAddAppointment, supabase } from '@/services/supabaseService';

// Types
export interface Service {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  features: string[];
  checks: string[];
  basePrice: number; // Added for booking calculation
  estimatedPrice: number;
  estimatedDuration: string;
  commonIssues?: string[];
  recommendedCheckups?: string[];
  iconUrl?: string;
  iconName?: string;
  categoryId?: string;
}

export interface ServicePackage {
  id: string;
  title: string;
  description: string;
  serviceIds: string[];
  discountPercentage: number;
  basePrice: number;
  features: string[];
  isPopular: boolean;
  imageUrl?: string;
}

export interface Brand {
  id: string;
  name: string;
  imageUrl: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  minQuantity: number;
  price: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  iconName: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiryDate: string;
  isActive: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  serviceId?: string;
  createdAt: string;
  isPublished: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  isPopular: boolean;
  workingHours: string;
}

export interface PricingItem {
  name: string;
  price: number;
}

export interface CarModel {
  name: string;
  price: number;
  make: string;
  year?: string;
}

export interface Settings {
  logoText: string;
  logoUrl?: string;
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
  referralRewardAmount: number;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  footerDescription?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
  googleMapsApiKey?: string;
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  serviceId?: string;
  make: string;
  model: string;
  fuel: string;
  year?: string;
  licensePlate?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  paymentMethod?: 'razorpay' | 'paytm' | 'pay_after_service';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  amount?: number;
  technicianId?: string;
  issuePhotos?: string[];
  createdAt: string;
}

export interface Technician {
  id: string;
  name: string;
  specialty: string;
  status: 'available' | 'busy' | 'off';
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string; // Added for admin/staff login
  role: 'admin' | 'viewer' | 'user';
  verified: boolean;
  blocked: boolean;
  walletBalance: number;
  referralCode: string;
  referredBy?: string;
  referralsCount: number;
  source?: 'google' | 'social' | 'referral' | 'direct' | 'other';
  createdAt: string;
}

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: string;
  fuelType: string;
  licensePlate: string;
  vin?: string;
  lastServiceDate?: string;
  createdAt: string;
}

export interface Feature {
  title: string;
  description: string;
  iconName: string;
}

export interface PageSection {
  id: string;
  type: 'hero' | 'features' | 'content' | 'cta' | 'faq' | 'contact' | 'services' | 'brands' | 'faq-list' | 'contact-form' | 'gallery' | 'core-services' | 'location';
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
  items?: any[];
  config?: any;
}

export interface Page {
  id: string;
  slug: string;
  title: string;
  sections: PageSection[];
  isPublished: boolean;
  seo?: SeoSettings;
}

export interface AdminUiSettings {
  loginTitle: string;
  loginSubtitle: string;
  loginBgColor: string;
  loginAccentColor: string;
  loginLogoUrl?: string;
  loginTerminalId?: string;
}

export interface UserLoginUiSettings {
  loginTitle: string;
  loginSubtitle: string;
  loginBgColor: string;
  loginAccentColor: string;
  loginLogoUrl?: string;
  showGoogleLogin: boolean;
  showFacebookLogin: boolean;
  showPhoneLogin: boolean;
}

export interface SeoSettings {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage?: string;
  enableIndexing: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  avatar?: string;
  rating: number;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconName: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  order: number;
  isActive: boolean;
  isExternal: boolean;
}

export interface UiSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage?: string;
  heroVideoUrl?: string;
  heroBgOpacity?: number;
  primaryColor: string;
  whyChooseTitle: string;
  whyChooseDescription: string;
  whyChooseImage: string;
  features: Feature[];
  testimonials: Testimonial[];
  socialLinks: SocialLink[];
  testimonialText: string;
  testimonialAuthor: string;
  testimonialRating: number;
  adminLogin: AdminUiSettings;
  userLogin: UserLoginUiSettings;
  pages: Page[];
  seo: SeoSettings;
  darkMode: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  avatar?: string;
  rating: number;
  location?: string;
  carModel?: string;
}

export interface ApiKeys {
  googleClientId: string;
  firebaseApiKey: string;
  firebaseAuthDomain: string;
  firebaseProjectId: string;
  firebaseStorageBucket: string;
  firebaseMessagingSenderId: string;
  firebaseAppId: string;
  razorpayKeyId?: string;
  razorpayKeySecret?: string;
  paytmMid?: string;
  paytmMerchantKey?: string;
}

export interface ContactSubmission {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  assignedTo?: string;
  createdAt: string;
}

interface DataContextType {
  services: Service[];
  carMakes: PricingItem[];
  carModels: CarModel[];
  fuelTypes: PricingItem[];
  settings: Settings;
  appointments: Appointment[];
  tasks: Task[];
  users: User[];
  vehicles: Vehicle[];
  uiSettings: UiSettings;
  apiKeys: ApiKeys;
  brands: Brand[];
  locations: Location[];
  inventory: InventoryItem[];
  categories: ServiceCategory[];
  coupons: Coupon[];
  reviews: Review[];
  notifications: Notification[];
  servicePackages: ServicePackage[];
  technicians: Technician[];
  testimonials: Testimonial[];
  contactSubmissions: ContactSubmission[];
  navigationItems: NavigationItem[];
  updateServices: (services: Service[]) => void;
  updateCarMakes: (makes: PricingItem[]) => void;
  updateCarModels: (models: CarModel[]) => void;
  updateFuelTypes: (fuels: PricingItem[]) => void;
  updateSettings: (settings: Settings) => void;
  updateAppointments: (appointments: Appointment[]) => void;
  updateTasks: (tasks: Task[]) => void;
  updateUsers: (users: User[]) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  updateUiSettings: (uiSettings: UiSettings) => void;
  updateApiKeys: (apiKeys: ApiKeys) => void;
  updateBrands: (brands: Brand[]) => void;
  updateLocations: (locations: Location[]) => void;
  updateInventory: (inventory: InventoryItem[]) => void;
  updateCategories: (categories: ServiceCategory[]) => void;
  updateCoupons: (coupons: Coupon[]) => void;
  updateReviews: (reviews: Review[]) => void;
  updateNotifications: (notifications: Notification[]) => void;
  updateServicePackages: (packages: ServicePackage[]) => void;
  updateContactSubmissions: (submissions: ContactSubmission[]) => void;
  updateTestimonials: (testimonials: Testimonial[]) => void;
  updateNavigationItems: (items: NavigationItem[]) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  addContactSubmission: (submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  removeVehicle: (id: string) => void;
  updateWalletBalance: (userId: string, amount: number) => void;
  processReferral: (referralCode: string, newUserId: string) => void;
  isAdminLoggedIn: boolean;
  adminRole: 'admin' | 'viewer' | null;
  loginAdmin: (role?: 'admin' | 'viewer') => void;
  logoutAdmin: () => void;
  currentUser: FirebaseUser | null;
  logout: () => Promise<void>;
  isLoading: boolean;
  missingTables: string[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Data
const initialServices: Service[] = [
  {
    id: "ser_1",
    title: "Periodic Maintenance",
    description: "Comprehensive oil change, filter replacement, and 60-point safety inspection.",
    price: "₹1,499",
    duration: "90 Mins",
    basePrice: 1499,
    estimatedPrice: 1499,
    estimatedDuration: "90 Mins",
    iconName: "Wrench",
    categoryId: "cat_1",
    features: ["Engine Oil Replacement", "Oil Filter Replacement", "Air Filter Cleaning", "Coolant Top-up", "Brake Fluid Top-up", "60-Point Inspection"],
    checks: ["Engine Oil Level", "Brake Pad Wear", "Tyre Pressure", "Battery Health", "Fluid Levels", "Lights & Horn"],
    commonIssues: ["Low Engine Oil", "Dirty Air Filter", "Coolant Leakage"],
    recommendedCheckups: ["Every 10,000 KM", "Before Long Trips"]
  },
  {
    id: "ser_2",
    title: "AC Service & Repair",
    description: "Cooling coil cleaning, gas refill, and compressor health check for maximum cooling.",
    price: "₹1,999",
    duration: "2 Hours",
    basePrice: 1999,
    estimatedPrice: 1999,
    estimatedDuration: "2 Hours",
    iconName: "Zap",
    categoryId: "cat_2",
    features: ["AC Gas Refill", "Condenser Cleaning", "Cooling Coil Inspection", "Cabin Filter Cleaning", "Compressor Oil Top-up"],
    checks: ["Vent Temperature", "Gas Pressure", "Compressor Noise", "Leakage Test", "Belt Tension"],
    commonIssues: ["Weak Cooling", "Bad Odor", "Noisy Compressor"],
    recommendedCheckups: ["Before Summer", "Every 12 Months"]
  },
  {
    id: "ser_3",
    title: "Brake Maintenance",
    description: "Brake pad replacement and disc resurfacing for ultimate stopping power.",
    price: "₹899",
    duration: "60 Mins",
    basePrice: 899,
    estimatedPrice: 899,
    estimatedDuration: "60 Mins",
    iconName: "ShieldCheck",
    categoryId: "cat_1",
    features: ["Brake Pad Cleaning", "Disc Resurfacing", "Brake Fluid Top-up", "Caliper Greasing"],
    checks: ["Brake Pad Thickness", "Disc Condition", "Brake Line Integrity", "Pedal Feel"],
    commonIssues: ["Squealing Noise", "Vibration while Braking", "Soft Brake Pedal"],
    recommendedCheckups: ["Every 5,000 KM", "During Service"]
  },
  {
    id: "ser_4",
    title: "Wheel Care",
    description: "Precision wheel alignment and balancing for a smoother, safer ride.",
    price: "₹699",
    duration: "45 Mins",
    basePrice: 699,
    estimatedPrice: 699,
    estimatedDuration: "45 Mins",
    iconName: "Disc",
    categoryId: "cat_4",
    features: ["3D Wheel Alignment", "Wheel Balancing", "Tyre Rotation", "Nitrogen Inflation"],
    checks: ["Alignment Angles", "Wheel Runout", "Tyre Tread Depth", "Suspension Play"]
  },
  {
    id: "ser_5",
    title: "Ceramic Coating",
    description: "9H Nano-ceramic coating for ultimate paint protection and mirror-like shine.",
    price: "₹14,999",
    duration: "2 Days",
    basePrice: 14999,
    estimatedPrice: 14999,
    estimatedDuration: "2 Days",
    iconName: "Sparkles",
    categoryId: "cat_5",
    features: ["Surface Decontamination", "Multi-stage Paint Correction", "9H Ceramic Application", "Interior Protection", "Glass Coating"],
    checks: ["Paint Thickness", "Surface Smoothness", "Hydrophobic Effect", "Gloss Level"]
  },
  {
    id: "ser_6",
    title: "Engine Overhaul",
    description: "Complete engine disassembly, cleaning, and replacement of worn components.",
    price: "₹45,000",
    duration: "7 Days",
    basePrice: 45000,
    estimatedPrice: 45000,
    estimatedDuration: "7 Days",
    iconName: "Settings",
    categoryId: "cat_1",
    features: ["Engine Block Honing", "Piston Ring Replacement", "Bearing Replacement", "Gasket Set Renewal", "Timing Chain/Belt Replacement"],
    checks: ["Compression Test", "Oil Pressure", "Cooling System Pressure", "Leakage Test"]
  }
];
const initialServicePackages: ServicePackage[] = [];
const initialCarMakes: PricingItem[] = [
  { name: "Toyota", price: 500 },
  { name: "Honda", price: 500 },
  { name: "BMW", price: 2000 },
  { name: "Mercedes", price: 2500 },
  { name: "Audi", price: 2000 },
  { name: "Porsche", price: 5000 },
  { name: "Jaguar", price: 4000 },
  { name: "Land Rover", price: 4500 },
  { name: "Lexus", price: 3500 },
  { name: "Hyundai", price: 300 },
  { name: "Tata", price: 200 },
  { name: "Mahindra", price: 300 },
  { name: "Volkswagen", price: 600 },
  { name: "Skoda", price: 600 },
  { name: "Kia", price: 400 },
  { name: "MG", price: 500 },
];
const initialCarModels: CarModel[] = [
  { name: "Corolla", make: "Toyota", price: 0 },
  { name: "Camry", make: "Toyota", price: 500 },
  { name: "Fortuner", make: "Toyota", price: 1000 },
  { name: "Civic", make: "Honda", price: 0 },
  { name: "City", make: "Honda", price: 0 },
  { name: "Accord", make: "Honda", price: 500 },
  { name: "3 Series", make: "BMW", price: 0 },
  { name: "5 Series", make: "BMW", price: 1000 },
  { name: "7 Series", make: "BMW", price: 2000 },
  { name: "C-Class", make: "Mercedes", price: 0 },
  { name: "E-Class", make: "Mercedes", price: 1000 },
  { name: "S-Class", make: "Mercedes", price: 2000 },
  { name: "A4", make: "Audi", price: 0 },
  { name: "A6", make: "Audi", price: 1000 },
  { name: "Q7", make: "Audi", price: 2000 },
  { name: "911 Carrera", make: "Porsche", price: 5000 },
  { name: "Cayenne", make: "Porsche", price: 3000 },
  { name: "XF", make: "Jaguar", price: 1500 },
  { name: "F-PACE", make: "Jaguar", price: 2000 },
  { name: "Range Rover", make: "Land Rover", price: 3000 },
  { name: "Defender", make: "Land Rover", price: 2500 },
  { name: "ES", make: "Lexus", price: 1000 },
  { name: "RX", make: "Lexus", price: 2000 },
  { name: "Creta", make: "Hyundai", price: 0 },
  { name: "Verna", make: "Hyundai", price: 0 },
  { name: "Nexon", make: "Tata", price: 0 },
  { name: "Harrier", make: "Tata", price: 500 },
  { name: "Safari", make: "Tata", price: 700 },
  { name: "Thar", make: "Mahindra", price: 0 },
  { name: "XUV700", make: "Mahindra", price: 500 },
];
const initialFuelTypes: PricingItem[] = [
  { name: "Petrol", price: 0 },
  { name: "Diesel", price: 300 },
  { name: "Electric", price: 800 },
  { name: "CNG", price: 200 },
  { name: "Hybrid", price: 600 },
];
const initialSettings: Settings = {
  logoText: "",
  logoUrl: "",
  email: "",
  phone: "",
  address: "",
  whatsapp: "",
  referralRewardAmount: 500,
  privacyPolicyUrl: "/privacy",
  termsOfServiceUrl: "/terms",
};
const initialUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "carmechstechlabs@gmail.com",
    phone: "1234567890",
    password: "Admin@270389",
    role: "admin",
    verified: true,
    blocked: false,
    walletBalance: 1000,
    referralCode: "ADMIN123",
    referralsCount: 0,
    createdAt: new Date().toISOString()
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
    referralsCount: 0,
    createdAt: new Date().toISOString()
  }
];
const initialCategories: ServiceCategory[] = [
  { id: "cat_1", name: "Periodic Maintenance", description: "Regular oil changes, filter replacements, and general health checks.", iconName: "Wrench" },
  { id: "cat_2", name: "AC & Electrical", description: "Air conditioning service, battery replacement, and wiring diagnostics.", iconName: "Zap" },
  { id: "cat_3", name: "Body & Paint", description: "Dent removal, scratch repair, and full body repainting services.", iconName: "PaintBucket" },
  { id: "cat_4", name: "Tires & Wheels", description: "Wheel alignment, balancing, and tire replacement services.", iconName: "Disc" },
  { id: "cat_5", name: "Deep Cleaning", description: "Interior detailing, exterior polishing, and engine bay cleaning.", iconName: "Sparkles" }
];

const initialUiSettings: UiSettings = {
  heroTitle: "",
  heroSubtitle: "",
  heroBgImage: "",
  heroVideoUrl: "https://cdn.pixabay.com/video/2020/09/24/50923-463863484_large.mp4",
  heroBgOpacity: 0.5,
  primaryColor: "",
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
  testimonials: [
    { id: "1", name: "Rahul Sharma", quote: "Best service I've ever had for my car. Very professional!", rating: 5, location: "Kolkata", carModel: "BMW 5 Series" },
    { id: "2", name: "Priya Patel", quote: "Transparent pricing and timely delivery. Highly recommended!", rating: 5, location: "Howrah", carModel: "Audi A4" },
    { id: "3", name: "Vikram Singh", quote: "The diagnostic accuracy is impressive. They fixed an issue that two other workshops couldn't.", rating: 5, location: "Kolkata", carModel: "Mercedes C-Class" },
    { id: "4", name: "Ananya Das", quote: "Excellent ceramic coating job on my new Porsche. The finish is mirror-like.", rating: 5, location: "Kolkata", carModel: "Porsche 911" },
    { id: "5", name: "Sanjay Gupta", quote: "Reliable and honest mechanics. They explained everything clearly before starting the work.", rating: 5, location: "Howrah", carModel: "Toyota Fortuner" }
  ],
  socialLinks: [
    { id: "1", platform: "Facebook", url: "https://facebook.com", iconName: "Facebook" },
    { id: "2", platform: "Instagram", url: "https://instagram.com", iconName: "Instagram" },
    { id: "3", platform: "Twitter", url: "https://twitter.com", iconName: "Twitter" }
  ],
  adminLogin: {
    loginTitle: "Admin Portal",
    loginSubtitle: "CarMechs Management System",
    loginBgColor: "#f8fafc",
    loginAccentColor: "#e31e24",
    loginTerminalId: "ADMIN_MAIN"
  },
  userLogin: {
    loginTitle: "Welcome back",
    loginSubtitle: "Enter your details to access your account",
    loginBgColor: "#ffffff",
    loginAccentColor: "#e31e24",
    showGoogleLogin: true,
    showFacebookLogin: true,
    showPhoneLogin: true
  },
  seo: {
    metaTitle: "CarMechs | Premium Automotive Care Terminal",
    metaDescription: "Experience the next generation of car maintenance with radical transparency and technical excellence.",
    keywords: "car service, car repair, luxury car maintenance, online car booking",
    ogImage: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1200",
    enableIndexing: true
  },
  pages: [
    {
      id: "home",
      slug: "home",
      title: "Home",
      isPublished: true,
      sections: [
        { id: "h1", type: "hero", title: "Expert Car Care At Your Doorstep", subtitle: "Experience hassle-free car service with free pickup and drop." },
        { id: "f1", type: "features", title: "Why Choose Us" },
        { id: "s1", type: "services", title: "Our Services" },
        { id: "b1", type: "brands", title: "Brands We Service" }
      ]
    },
    {
      id: "about",
      slug: "about",
      title: "About Us",
      isPublished: true,
      sections: [
        { id: "a1", type: "hero", title: "Engineering Trust", subtitle: "We are on a mission to redefine automotive care through radical transparency." },
        { id: "a2", type: "content", title: "Our Story", content: "CarMechs started with a simple observation: car service shouldn't be a black box. We saw owners struggling with opaque pricing, inconsistent quality, and a lack of accountability." }
      ]
    },
    {
      id: "contact",
      slug: "contact",
      title: "Contact Us",
      isPublished: true,
      sections: [
        { id: "c1", type: "hero", title: "Direct Connection", subtitle: "Have a technical query or need immediate assistance? Our support engineers are standing by." },
        { id: "c2", type: "contact-form", title: "Submit Inquiry" },
        { id: "c3", type: "location", title: "Our Service Hubs", content: "Visit our premium workshops in Kolkata and Howrah for expert automotive care." }
      ]
    },
    {
      id: "faq",
      slug: "faq",
      title: "FAQ",
      isPublished: true,
      sections: [
        { id: "q1", type: "hero", title: "How can we help you?", subtitle: "Find answers to common questions about our services, booking process, and more." },
        { id: "q2", type: "faq-list", title: "Frequently Asked Questions" }
      ]
    }
  ],
  darkMode: false
};
const initialApiKeys: ApiKeys = {
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

const initialNavigationItems: NavigationItem[] = [
  { id: "1", label: "Home", path: "/", order: 1, isActive: true, isExternal: false },
  { id: "2", label: "Services", path: "/services", order: 2, isActive: true, isExternal: false },
  { id: "3", label: "Brands", path: "/#brands", order: 3, isActive: true, isExternal: false },
  { id: "4", label: "Locations", path: "/#locations", order: 4, isActive: true, isExternal: false },
  { id: "5", label: "About", path: "/about", order: 5, isActive: true, isExternal: false },
  { id: "6", label: "Contact", path: "/contact", order: 6, isActive: true, isExternal: false },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [carMakes, setCarMakes] = useState<PricingItem[]>(initialCarMakes);
  const [carModels, setCarModels] = useState<CarModel[]>(initialCarModels);
  const [fuelTypes, setFuelTypes] = useState<PricingItem[]>(initialFuelTypes);
  const [settings, setSettings] = useState<Settings>(initialSettings);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [uiSettings, setUiSettings] = useState<UiSettings>(initialUiSettings);
  const [apiKeys, setApiKeys] = useState<ApiKeys>(initialApiKeys);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>(initialCategories);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [servicePackages, setServicePackages] = useState<ServicePackage[]>(initialServicePackages);
  const [technicians, setTechnicians] = useState<Technician[]>([
    { id: 'tech1', name: 'Rajesh Kumar', specialty: 'Engine Specialist', status: 'available' },
    { id: 'tech2', name: 'Amit Singh', specialty: 'Electrical Expert', status: 'busy' },
    { id: 'tech3', name: 'Suresh Raina', specialty: 'Body & Paint', status: 'available' },
    { id: 'tech4', name: 'Vijay Verma', specialty: 'AC Specialist', status: 'off' },
  ]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>(initialNavigationItems);
  const [isLoading, setIsLoading] = useState(true);
  const [missingTables, setMissingTables] = useState<string[]>([]);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });

  const [adminRole, setAdminRole] = useState<'admin' | 'viewer' | null>(() => {
    return (localStorage.getItem('adminRole') as 'admin' | 'viewer' | null) || null;
  });

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const config = getFirebaseConfig(apiKeys);
    if (config.apiKey && config.projectId) {
      try {
        const auth = getFirebaseAuth(apiKeys);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          setCurrentUser(user);
          if (user) {
            // Check if user exists in our Supabase users table
            const existingUser = users.find(u => u.id === user.uid || u.email === user.email);
            if (!existingUser) {
              // Create user in Supabase if they don't exist
              const newUser: User = {
                id: user.uid,
                name: user.displayName || user.email?.split('@')[0] || 'User',
                email: user.email || '',
                phone: user.phoneNumber || '',
                role: 'user',
                verified: user.emailVerified,
                blocked: false,
                walletBalance: 0,
                referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
                referralsCount: 0,
                createdAt: new Date().toISOString()
              };
              const updatedUsers = [...users, newUser];
              setUsers(updatedUsers);
              updateTable('users', updatedUsers);
            }
          }
        });
        return unsubscribe;
      } catch (e) {
        console.error("Firebase auth error:", e);
      }
    }
  }, [apiKeys, users]);

  const login = async (email: string, password: string) => {
    const config = getFirebaseConfig(apiKeys);
    if (config.apiKey && config.projectId) {
      const auth = getFirebaseAuth(apiKeys);
      return signInWithEmailAndPassword(auth, email, password);
    }
    throw new Error("Firebase not configured");
  };

  const signup = async (email: string, password: string, name: string) => {
    const config = getFirebaseConfig(apiKeys);
    if (config.apiKey && config.projectId) {
      const auth = getFirebaseAuth(apiKeys);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user) {
        await updateProfile(result.user, { displayName: name });
        
        // Add to Supabase users table
        const newUser: User = {
          id: result.user.uid,
          name: name,
          email: email,
          phone: '',
          role: 'user',
          verified: false,
          blocked: false,
          walletBalance: 0,
          referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          referralsCount: 0,
          createdAt: new Date().toISOString()
        };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        updateTable('users', updatedUsers);
      }
      return result;
    }
    throw new Error("Firebase not configured");
  };

  const logout = async () => {
    const config = getFirebaseConfig(apiKeys);
    if (config.apiKey && config.projectId) {
      try {
        const auth = getFirebaseAuth(apiKeys);
        await signOut(auth);
      } catch (e) {
        console.error("Logout error:", e);
      }
    }
  };

  useEffect(() => {
    // 1. Initial Fetch from Supabase (Directly from Frontend)
    const fetchInitialData = async () => {
      try {
        const state = await getInitialState();
        if (state) {
          setMissingTables(state.missingTables || []);
          setServices(state.services);
          setCarMakes(state.carMakes);
          setCarModels(state.carModels);
          setFuelTypes(state.fuelTypes);
          setSettings(state.settings);
          setAppointments(state.appointments);
          setTasks(state.tasks || []);
          // Merge initialUsers with fetched users to ensure admin login always works
          const fetchedUsers = state.users || [];
          const mergedUsers = [...initialUsers];
          fetchedUsers.forEach((u: any) => {
            if (!mergedUsers.find(iu => iu.email.toLowerCase() === u.email.toLowerCase())) {
              mergedUsers.push(u);
            }
          });
          setUsers(mergedUsers);
          setVehicles(state.vehicles || []);
          setUiSettings(prev => ({
            ...prev,
            ...state.uiSettings,
            pages: state.uiSettings?.pages || prev.pages,
            adminLogin: { ...prev.adminLogin, ...(state.uiSettings?.adminLogin || {}) },
            userLogin: { ...prev.userLogin, ...(state.uiSettings?.userLogin || {}) }
          }));
          setApiKeys(state.apiKeys);
          setBrands(state.brands || []);
          setLocations(state.locations || []);
          setInventory(state.inventory || []);
          setCategories(state.categories || []);
          setCoupons(state.coupons || []);
          setReviews(state.reviews || []);
          setNotifications(state.notifications || []);
          setServicePackages(state.servicePackages || []);
          setContactSubmissions(state.contactSubmissions || []);
          setTechnicians(state.technicians || []);
          setTestimonials(state.testimonials || []);
          setNavigationItems(state.navigationItems || initialNavigationItems);
        }
      } catch (error) {
        console.error("Error fetching initial data from Supabase:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();

    // 2. Setup Supabase Realtime Subscriptions (For Production/Vercel)
    const setupSupabaseRealtime = () => {
      if (!supabase) return;

      const channel = supabase
        .channel('db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'car_makes' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'car_models' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'fuel_types' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'brands' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'locations' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'coupons' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'reviews' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'service_packages' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_submissions' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'technicians' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, () => fetchInitialData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'navigation_items' }, () => fetchInitialData())
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanupSupabase = setupSupabaseRealtime();

    // 3. Setup Socket Connection for Real-time Updates (For Local/Persistent Server)
    const newSocket = io(); 
    setSocket(newSocket);

    newSocket.on('initial_state', (state) => {
      setMissingTables(state.missingTables || []);
      setServices(state.services);
      setCarMakes(state.carMakes);
      setCarModels(state.carModels);
      setFuelTypes(state.fuelTypes);
      setSettings(state.settings);
      setAppointments(state.appointments);
      setTasks(state.tasks || []);
      
      // Merge initialUsers with fetched users to ensure admin login always works
      const fetchedUsers = state.users || [];
      const mergedUsers = [...initialUsers];
      fetchedUsers.forEach((u: any) => {
        if (!mergedUsers.find(iu => iu.email.toLowerCase() === u.email.toLowerCase())) {
          mergedUsers.push(u);
        }
      });
      setUsers(mergedUsers);
      
      setVehicles(state.vehicles || []);
      setUiSettings({
        ...initialUiSettings,
        ...state.uiSettings,
        pages: state.uiSettings?.pages || initialUiSettings.pages,
        adminLogin: {
          ...initialUiSettings.adminLogin,
          ...(state.uiSettings?.adminLogin || {})
        },
        userLogin: {
          ...initialUiSettings.userLogin,
          ...(state.uiSettings?.userLogin || {})
        }
      });
      setApiKeys(state.apiKeys);
      setBrands(state.brands || []);
      setLocations(state.locations || []);
      setInventory(state.inventory || []);
      setCategories(state.categories || []);
      setCoupons(state.coupons || []);
      setReviews(state.reviews || []);
      setNotifications(state.notifications || []);
      setServicePackages(state.servicePackages || []);
      setContactSubmissions(state.contactSubmissions || []);
      setIsLoading(false);
    });

    newSocket.on('services_updated', (newServices) => setServices(newServices));
    newSocket.on('car_makes_updated', (newMakes) => setCarMakes(newMakes));
    newSocket.on('car_models_updated', (newModels) => setCarModels(newModels));
    newSocket.on('fuel_types_updated', (newFuels) => setFuelTypes(newFuels));
    newSocket.on('settings_updated', (newSettings) => setSettings(newSettings));
    newSocket.on('appointments_updated', (newAppointments) => setAppointments(newAppointments));
    newSocket.on('tasks_updated', (newTasks) => setTasks(newTasks));
    newSocket.on('users_updated', (newUsers) => setUsers(newUsers));
    newSocket.on('vehicles_updated', (newVehicles) => setVehicles(newVehicles));
    newSocket.on('ui_settings_updated', (newUiSettings) => setUiSettings(newUiSettings));
    newSocket.on('api_keys_updated', (newApiKeys) => setApiKeys(newApiKeys));
    newSocket.on('brands_updated', (newBrands) => setBrands(newBrands));
    newSocket.on('locations_updated', (newLocations) => setLocations(newLocations));
    newSocket.on('inventory_updated', (newInventory) => setInventory(newInventory));
    newSocket.on('categories_updated', (newCategories) => setCategories(newCategories));
    newSocket.on('coupons_updated', (newCoupons) => setCoupons(newCoupons));
    newSocket.on('reviews_updated', (newReviews) => setReviews(newReviews));
    newSocket.on('notifications_updated', (newNotifications) => setNotifications(newNotifications));
    newSocket.on('service_packages_updated', (newPackages) => setServicePackages(newPackages));
    newSocket.on('contact_submissions_updated', (newSubmissions) => setContactSubmissions(newSubmissions));

    return () => {
      newSocket.disconnect();
      if (cleanupSupabase) cleanupSupabase();
    };
  }, []);

  // Monitor inventory for low stock alerts
  useEffect(() => {
    if (inventory.length === 0) return;
    
    const lowStockItems = inventory.filter(item => item.stock <= (item.minStock || 5) && item.stock > 0);
    const outOfStockItems = inventory.filter(item => item.stock === 0);

    lowStockItems.forEach(item => {
      const exists = notifications.find(n => n.title === 'Low Stock Alert' && n.message.includes(item.name));
      if (!exists) {
        addNotification({
          userId: 'admin',
          title: 'Low Stock Alert',
          message: `${item.name} is running low on stock (${item.stock} left).`,
          type: 'warning'
        });
      }
    });

    outOfStockItems.forEach(item => {
      const exists = notifications.find(n => n.title === 'Out of Stock Alert' && n.message.includes(item.name));
      if (!exists) {
        addNotification({
          userId: 'admin',
          title: 'Out of Stock Alert',
          message: `${item.name} is out of stock!`,
          type: 'error'
        });
      }
    });
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('isAdminLoggedIn', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  useEffect(() => {
    if (adminRole) {
      localStorage.setItem('adminRole', adminRole);
    } else {
      localStorage.removeItem('adminRole');
    }
  }, [adminRole]);

  const updateServices = (newServices: Service[]) => {
    setServices(newServices);
    if (socket?.connected) {
      socket.emit('update_services', newServices);
    } else {
      updateTable('services', newServices);
    }
  };
  
  const updateCarMakes = (newMakes: PricingItem[]) => {
    setCarMakes(newMakes);
    if (socket?.connected) {
      socket.emit('update_car_makes', newMakes);
    } else {
      updateTable('car_makes', newMakes);
    }
  };
  
  const updateCarModels = (newModels: CarModel[]) => {
    setCarModels(newModels);
    if (socket?.connected) {
      socket.emit('update_car_models', newModels);
    } else {
      updateTable('car_models', newModels);
    }
  };
  
  const updateFuelTypes = (newFuels: PricingItem[]) => {
    setFuelTypes(newFuels);
    if (socket?.connected) {
      socket.emit('update_fuel_types', newFuels);
    } else {
      updateTable('fuel_types', newFuels);
    }
  };
  
  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    if (socket?.connected) {
      socket.emit('update_settings', newSettings);
    } else {
      updateConfig('settings', newSettings);
    }
  };
  
  const updateAppointments = (newAppointments: Appointment[]) => {
    setAppointments(newAppointments);
    if (socket?.connected) {
      socket.emit('update_appointments', newAppointments);
    } else {
      updateTable('appointments', newAppointments);
    }
  };
  
  const updateTasks = (newTasks: Task[]) => {
    setTasks(newTasks);
    if (socket?.connected) {
      socket.emit('update_tasks', newTasks);
    } else {
      updateTable('tasks', newTasks);
    }
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
      completed: false,
      createdAt: new Date().toISOString()
    };
    const updatedTasks = [newTask, ...tasks];
    setTasks(updatedTasks);
    if (socket?.connected) {
      socket.emit('update_tasks', updatedTasks);
    } else {
      updateTable('tasks', updatedTasks);
    }
  };

  const updateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    if (socket?.connected) {
      socket.emit('update_users', newUsers);
    } else {
      updateTable('users', newUsers);
    }
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, ...updates } : u);
    setUsers(updatedUsers);
    if (socket?.connected) {
      socket.emit('update_users', updatedUsers);
    } else {
      updateTable('users', updatedUsers);
    }
  };

  const updateUiSettings = (newUiSettings: UiSettings) => {
    setUiSettings(newUiSettings);
    if (socket?.connected) {
      socket.emit('update_ui_settings', newUiSettings);
    } else {
      updateConfig('ui_settings', newUiSettings);
    }
  };

  const updateApiKeys = (newApiKeys: ApiKeys) => {
    setApiKeys(newApiKeys);
    if (socket?.connected) {
      socket.emit('update_api_keys', newApiKeys);
    } else {
      updateConfig('api_keys', newApiKeys);
    }
  };

  const updateBrands = (newBrands: Brand[]) => {
    setBrands(newBrands);
    if (socket?.connected) {
      socket.emit('update_brands', newBrands);
    } else {
      updateTable('brands', newBrands);
    }
  };

  const addVehicle = async (vehicle: Omit<Vehicle, "id" | "createdAt">) => {
    try {
      const id = `veh_${Date.now()}`;
      const newVehicle = {
        id,
        user_id: vehicle.userId,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        fuel_type: vehicle.fuelType,
        license_plate: vehicle.licensePlate,
        vin: vehicle.vin,
        last_service_date: vehicle.lastServiceDate,
        created_at: new Date().toISOString()
      };
      const { error } = await supabase.from('vehicles').insert([newVehicle]);
      if (error) throw error;
      setVehicles(prev => [...prev, { ...vehicle, id, createdAt: newVehicle.created_at }]);
    } catch (error) {
      console.error("Error adding vehicle:", error);
      throw error;
    }
  };

  const removeVehicle = async (id: string) => {
    try {
      const { error } = await supabase.from('vehicles').delete().eq('id', id);
      if (error) throw error;
      setVehicles(prev => prev.filter(v => v.id !== id));
    } catch (error) {
      console.error("Error removing vehicle:", error);
      throw error;
    }
  };

  const updateLocations = (newLocations: Location[]) => {
    setLocations(newLocations);
    if (socket?.connected) {
      socket.emit('update_locations', newLocations);
    } else {
      updateTable('locations', newLocations);
    }
  };

  const updateInventory = (newInventory: InventoryItem[]) => {
    setInventory(newInventory);
    if (socket?.connected) {
      socket.emit('update_inventory', newInventory);
    } else {
      updateTable('inventory', newInventory);
    }
  };

  const updateCategories = (newCategories: ServiceCategory[]) => {
    setCategories(newCategories);
    if (socket?.connected) {
      socket.emit('update_categories', newCategories);
    } else {
      updateTable('categories', newCategories);
    }
  };

  const updateCoupons = (newCoupons: Coupon[]) => {
    setCoupons(newCoupons);
    if (socket?.connected) {
      socket.emit('update_coupons', newCoupons);
    } else {
      updateTable('coupons', newCoupons);
    }
  };

  const updateReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    if (socket?.connected) {
      socket.emit('update_reviews', newReviews);
    } else {
      updateTable('reviews', newReviews);
    }
  };

  const updateNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
    if (socket?.connected) {
      socket.emit('update_notifications', newNotifications);
    } else {
      updateTable('notifications', newNotifications);
    }
  };

  const addNotification = (notif: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substring(2, 9),
      read: false,
      createdAt: new Date().toISOString()
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    if (socket?.connected) {
      socket.emit('update_notifications', updatedNotifs);
    } else {
      updateTable('notifications', updatedNotifs);
    }
  };

  const updateServicePackages = (newPackages: ServicePackage[]) => {
    setServicePackages(newPackages);
    if (socket?.connected) {
      socket.emit('update_service_packages', newPackages);
    } else {
      updateTable('service_packages', newPackages);
    }
  };

  const updateWalletBalance = async (userId: string, amount: number) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    const newBalance = (user.walletBalance || 0) + amount;
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, walletBalance: newBalance } : u
    );
    
    setUsers(updatedUsers);
    
    if (socket?.connected) {
      socket.emit('update_users', updatedUsers);
    } else {
      // Direct Supabase update for reliability
      try {
        const { error } = await supabase
          .from('users')
          .update({ wallet_balance: newBalance })
          .eq('id', userId);
        
        if (error) {
          console.error("Error updating wallet in Supabase:", error);
          // Fallback to updateTable if direct update fails
          updateTable('users', updatedUsers);
        }
      } catch (e) {
        updateTable('users', updatedUsers);
      }
    }
  };

  const processReferral = (referralCode: string, newUserId: string) => {
    const referrer = users.find(u => u.referralCode === referralCode);
    if (!referrer) return;

    const updatedUsers = users.map(u => {
      if (u.id === referrer.id) {
        return { 
          ...u, 
          walletBalance: (u.walletBalance || 0) + settings.referralRewardAmount,
          referralsCount: (u.referralsCount || 0) + 1
        };
      }
      if (u.id === newUserId) {
        return { ...u, referredBy: referrer.id };
      }
      return u;
    });

    setUsers(updatedUsers);
    if (socket?.connected) {
      socket.emit('update_users', updatedUsers);
    } else {
      updateTable('users', updatedUsers);
    }
  };

  const updateContactSubmissions = (newSubmissions: ContactSubmission[]) => {
    setContactSubmissions(newSubmissions);
    if (socket?.connected) {
      socket.emit('update_contact_submissions', newSubmissions);
    } else {
      updateTable('contact_submissions', newSubmissions);
    }
  };

  const updateTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    if (socket?.connected) {
      socket.emit('update_testimonials', newTestimonials);
    } else {
      updateTable('testimonials', newTestimonials);
    }
  };

  const updateNavigationItems = (newItems: NavigationItem[]) => {
    setNavigationItems(newItems);
    if (socket?.connected) {
      socket.emit('update_navigation_items', newItems);
    } else {
      updateTable('navigation_items', newItems);
    }
  };

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'priority'>) => {
    // Ensure we have a service title if only ID was provided
    let serviceTitle = appointment.service;
    let serviceId = appointment.serviceId;

    if (!serviceId && appointment.service.startsWith('cat_')) {
      serviceId = appointment.service;
      serviceTitle = services.find(s => s.id === serviceId)?.title || serviceId;
    } else if (!serviceId && appointment.service.startsWith('pkg_')) {
      serviceId = appointment.service;
      serviceTitle = servicePackages.find(p => p.id === serviceId)?.title || serviceId;
    }

    const newAppointment: Appointment = {
      ...appointment,
      service: serviceTitle,
      serviceId: serviceId || 'unknown',
      id: Math.random().toString(36).substring(2, 9),
      status: 'pending',
      priority: 'medium',
      paymentStatus: appointment.paymentMethod === 'pay_after_service' ? 'pending' : 'paid',
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newAppointment, ...prev]);
    
    // Notify Admin
    addNotification({
      userId: 'admin', // Special ID for admin notifications
      title: 'New Booking Received',
      message: `${appointment.name} booked ${serviceTitle} for ${appointment.date} at ${appointment.time}.`,
      type: 'info'
    });

    if (socket?.connected) {
      socket.emit('add_appointment', newAppointment);
    } else {
      dbAddAppointment(newAppointment);
    }
  };

  const addContactSubmission = (submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>) => {
    const newSubmission: ContactSubmission = {
      ...submission,
      id: Math.random().toString(36).substring(2, 9),
      status: 'new',
      createdAt: new Date().toISOString()
    };
    setContactSubmissions(prev => [newSubmission, ...prev]);
    
    // Notify Admin
    addNotification({
      userId: 'admin',
      title: 'New Inquiry Received',
      message: `From ${submission.firstName} ${submission.lastName}: ${submission.subject}`,
      type: 'info'
    });

    if (socket?.connected) {
      socket.emit('add_contact_submission', newSubmission);
    } else {
      updateTable('contact_submissions', [newSubmission, ...contactSubmissions]);
    }
  };

  const loginAdmin = (role: 'admin' | 'viewer' = 'admin') => {
    setIsAdminLoggedIn(true);
    setAdminRole(role);
    localStorage.setItem('isAdminLoggedIn', 'true');
    localStorage.setItem('adminRole', role);
  };
  
  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminRole(null);
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminRole');
  };

  return (
    <DataContext.Provider value={{
      services,
      carMakes,
      carModels,
      fuelTypes,
      settings,
      appointments,
      tasks,
      users,
      uiSettings,
      apiKeys,
      brands,
      locations,
      inventory,
      categories,
      coupons,
      reviews,
      notifications,
      servicePackages,
      technicians,
      vehicles,
      testimonials,
      contactSubmissions,
      navigationItems,
      updateServices,
      updateCarMakes,
      updateCarModels,
      updateFuelTypes,
      updateSettings,
      updateAppointments,
      updateTasks,
      updateUsers,
      updateUser,
      updateUiSettings,
      updateApiKeys,
      updateBrands,
      updateLocations,
      updateInventory,
      updateCategories,
      updateCoupons,
      updateReviews,
      updateNotifications,
      updateServicePackages,
      updateContactSubmissions,
      updateTestimonials,
      updateNavigationItems,
      addAppointment,
      addTask,
      addContactSubmission,
      addNotification,
      addVehicle,
      removeVehicle,
      updateWalletBalance,
      processReferral,
      isAdminLoggedIn,
      adminRole,
      loginAdmin,
      logoutAdmin,
      currentUser,
      login,
      signup,
      logout,
      isLoading,
      missingTables
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
