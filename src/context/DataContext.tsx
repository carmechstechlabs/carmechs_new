import React, { createContext, useContext, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { onAuthStateChanged, signOut, User as FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirebaseAuth, getFirebaseConfig } from '../lib/firebase';
import { getInitialState, updateTable, updateConfig, addAppointment as dbAddAppointment, supabase } from '../services/supabaseService';
import { ApiKeys } from '../types';

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
  applicableMakes?: string[];
  applicableModels?: string[];
  applicableFuelTypes?: string[];
  timeEstimate?: string;
  warranty?: string;
  imageUrl?: string;
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
  stock: number;
  minStock?: number;
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
  technicianId?: string;
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
  googleMapsUrl?: string;
}

export interface PricingItem {
  id?: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface CarModel {
  id?: string;
  name: string;
  price: number;
  make: string;
  makeId?: string;
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
  fuelType?: string;
  year?: string;
  licensePlate?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  paymentMethod?: 'razorpay' | 'paytm' | 'pay_after_service';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  amount?: number;
  walletUsed?: number;
  finalPaid?: number;
  locationName?: string;
  technicianId?: string;
  workshopId?: string;
  customerName?: string; // For workshop portal compatibility
  carModel?: string; // For workshop portal compatibility
  totalPrice?: number; // For workshop portal compatibility
  issuePhotos?: string[];
  createdAt: string;
}

export interface Technician {
  id: string;
  userId?: string; // Link to User ID
  name: string;
  email?: string;
  phone?: string;
  specialty: string;
  experience?: string;
  hourlyRate?: number;
  certifications?: string[];
  servicesOffered?: string[];
  availability?: string;
  status: 'available' | 'busy' | 'off';
  rating?: number;
  reviewCount?: number;
  bio?: string;
  avatar?: string;
}

export interface ServiceRequest {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  make: string;
  model: string;
  year: string;
  problemDescription: string;
  preferredDate: string;
  preferredTime: string;
  location: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  password?: string; // Added for admin/staff login
  role: 'admin' | 'viewer' | 'user' | 'mechanic' | 'workshop_owner';
  verified: boolean;
  blocked: boolean;
  walletBalance: number;
  referralCode: string;
  referredBy?: string;
  referralsCount: number;
  source?: 'google' | 'social' | 'referral' | 'direct' | 'other';
  createdAt: string;
}

export interface Workshop {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  logoUrl?: string;
  rating: number;
  reviewsCount: number;
  servicesOffered: string[]; // IDs of services they offer
  isVerified: boolean;
  status: 'active' | 'inactive' | 'pending';
  ownerId: string; // User ID of the workshop owner
  workingHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
  location?: {
    lat: number;
    lng: number;
  };
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
  author: string;
  role: string;
  content: string;
  rating: number;
  carModel?: string;
  image?: string;
  createdAt: string;
  location?: string;
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
  adminOnly?: boolean;
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
  serviceRequests: ServiceRequest[];
  testimonials: Testimonial[];
  contactSubmissions: ContactSubmission[];
  navigationItems: NavigationItem[];
  workshops: Workshop[];
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
  addNavigationItem: (item: Omit<NavigationItem, 'id'>) => void;
  deleteNavigationItem: (id: string) => void;
  updateWorkshops: (workshops: Workshop[]) => void;
  updateWorkshop: (workshopId: string, updates: Partial<Workshop>) => void;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  addService: (service: Omit<Service, 'id'>) => Service;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status' | 'priority'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed'>) => void;
  deleteTask: (id: string) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'isPublished'>) => void;
  deleteReview: (id: string) => void;
  addBrand: (brand: Omit<Brand, 'id'>) => void;
  deleteBrand: (id: string) => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'isActive'>) => void;
  deleteCoupon: (id: string) => void;
  addContactSubmission: (submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'createdAt'>) => void;
  updateVehicle: (vehicleId: string, updates: Partial<Vehicle>) => void;
  removeVehicle: (id: string) => void;
  updateWalletBalance: (userId: string, amount: number) => void;
  processReferral: (referralCode: string, newUserId: string) => void;
  updateTechnicianStatus: (technicianId: string, status: 'available' | 'busy' | 'off') => void;
  isAdminLoggedIn: boolean;
  adminRole: 'admin' | 'viewer' | null;
  loginAdmin: (role?: 'admin' | 'viewer') => void;
  logoutAdmin: () => void;
  currentUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, name: string, phone: string) => Promise<any>;
  logout: () => Promise<void>;
  updateTechnicians: (technicians: Technician[]) => void;
  updateServiceRequests: (requests: ServiceRequest[]) => void;
  addServiceRequest: (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => void;
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
    applicableFuelTypes: ["Petrol", "Diesel", "CNG"],
    imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1000",
    iconUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=100",
    features: ["Engine Oil Replacement", "Oil Filter Replacement", "Air Filter Cleaning", "Coolant Top-up", "Brake Fluid Top-up", "60-Point Inspection", "Tyre Rotation"],
    checks: ["Engine Oil Level", "Brake Pad Wear", "Tyre Pressure", "Battery Health", "Fluid Levels", "Lights & Horn", "Suspension Check"],
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
    imageUrl: "https://images.unsplash.com/photo-1621905252507-b354bcadcabc?q=80&w=1000",
    iconUrl: "https://images.unsplash.com/photo-1621905252507-b354bcadcabc?q=80&w=100",
    applicableFuelTypes: ["Petrol", "Diesel", "CNG"],
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
    applicableMakes: ["Toyota", "Honda", "Hyundai", "Kia"],
    imageUrl: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2000&auto=format&fit=crop",
    features: ["Brake Pad Cleaning", "Disc Resurfacing", "Brake Fluid Top-up", "Caliper Greasing"],
    checks: ["Brake Pad Thickness", "Disc Condition", "Brake Line Integrity", "Pedal Feel"],
    commonIssues: ["Squealing Noise", "Vibration while Braking", "Soft Brake Pedal"],
    recommendedCheckups: ["Every 5,000 KM", "During Service"]
  },
  {
    id: "ser_4",
    title: "Wheel Care",
    description: "3D wheel alignment and balancing for a smoother, safer ride.",
    price: "₹699",
    duration: "45 Mins",
    basePrice: 699,
    estimatedPrice: 699,
    estimatedDuration: "45 Mins",
    iconName: "Disc",
    categoryId: "cat_4",
    applicableModels: ["Corolla", "City", "Creta", "Seltos"],
    imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=2000&auto=format&fit=crop",
    features: ["3D Wheel Alignment", "Wheel Balancing", "Tyre Rotation", "Nitrogen Inflation"],
    checks: ["Alignment Angles", "Wheel Runout", "Tyre Tread Depth", "Suspension Play"],
    commonIssues: ["Vehicle Pulling", "Uneven Tyre Wear", "Steering Vibration"],
    recommendedCheckups: ["Every 5,000 KM", "New Tyre Installation"]
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
    imageUrl: "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?q=80&w=2000&auto=format&fit=crop",
    features: ["Surface Decontamination", "Multi-stage Paint Correction", "9H Ceramic Application", "Interior Protection", "Glass Coating"],
    checks: ["Paint Thickness", "Surface Smoothness", "Hydrophobic Effect", "Gloss Level"],
    commonIssues: ["Swirl Marks", "Dull Paint", "Water Spots"],
    recommendedCheckups: ["New Car Purchase", "Post-Paint Correction"]
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
    imageUrl: "https://images.unsplash.com/photo-1504222490345-c075b6008014?q=80&w=2000&auto=format&fit=crop",
    features: ["Engine Block Honing", "Piston Ring Replacement", "Bearing Replacement", "Gasket Set Renewal", "Timing Chain/Belt Replacement"],
    checks: ["Compression Test", "Oil Pressure", "Cooling System Pressure", "Leakage Test"],
    commonIssues: ["Engine Overheating", "Excessive Smoke", "Low Compression"],
    recommendedCheckups: ["High Mileage (>100k KM)", "Engine Knocking"]
  },
  {
    id: "ser_7",
    title: "Denting & Painting",
    description: "Professional dent removal and high-quality paint matching in a controlled environment.",
    price: "₹2,499",
    duration: "24 Hours",
    basePrice: 2499,
    estimatedPrice: 2499,
    estimatedDuration: "24 Hours",
    iconName: "PaintBucket",
    categoryId: "cat_5",
    imageUrl: "https://images.unsplash.com/photo-1599256621730-535171e28e50?q=80&w=1000",
    iconUrl: "https://images.unsplash.com/photo-1599256621730-535171e28e50?q=80&w=100",
    features: ["Panel Dent Removal", "Surface Preparation", "Computerized Paint Matching", "Clear Coat Application", "Polishing"],
    checks: ["Surface Uniformity", "Color Match", "Paint Thickness", "Dust Particles"],
    commonIssues: ["Scratches", "Dents", "Paint Fading"],
    recommendedCheckups: ["Accident Repair", "Rust Prevention"]
  },
  {
    id: "ser_8",
    title: "Engine Diagnostics",
    description: "Comprehensive electronic system scanning and fault code analysis.",
    price: "₹999",
    duration: "1-2 Hours",
    basePrice: 999,
    estimatedPrice: 999,
    estimatedDuration: "1-2 Hours",
    iconName: "Cpu",
    categoryId: "cat_1",
    imageUrl: "https://images.unsplash.com/photo-1504222490345-c075b6008014?q=80&w=2000&auto=format&fit=crop",
    features: ["ECU Scan", "Sensor Readings", "Fault Code Diagnosis", "Live Data Monitoring"],
    checks: ["OBD II Port Check", "Battery Voltage Check", "Sensor Input Verification", "Wiring Harness Inspection"],
    commonIssues: ["Check Engine Light", "Rough Idling", "Poor Acceleration"],
    recommendedCheckups: ["Every 15,000 KM", "When Check Engine Light Appears"],
    applicableMakes: ["Toyota", "Honda", "BMW"],
    applicableModels: ["Corolla", "Civic", "3 Series"],
    applicableFuelTypes: ["Petrol", "Diesel"]
  }
];
const initialServicePackages: ServicePackage[] = [
  {
    id: "pkg_1",
    title: "Complete Care Bundle",
    description: "Our most popular bundle covering periodic maintenance, wheel care, and AC checkup.",
    serviceIds: ["ser_1", "ser_4", "ser_2"],
    discountPercentage: 15,
    basePrice: 3500,
    features: ["Full Vehicle Scan", "Priority Service", "Free Pick & Drop", "Interior Sanitization"],
    isPopular: true,
    imageUrl: "https://images.unsplash.com/photo-1530046339160-ce3e5b0c7a2f?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "pkg_2",
    title: "Safety First Bundle",
    description: "Ensure your safety with brake maintenance and wheel care services.",
    serviceIds: ["ser_3", "ser_4"],
    discountPercentage: 10,
    basePrice: 1400,
    features: ["Brake System Flush", "Tyre Health Report", "Suspension Inspection"],
    isPopular: false,
    imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "pkg_3",
    title: "Premium Maintenance Bundle",
    description: "Combines essential services for long-term vehicle health.",
    serviceIds: ["ser_1", "ser_4"],
    discountPercentage: 15,
    basePrice: 2500,
    features: ["Full Synthetic Oil Change", "Wheel Alignment", "Brake System Check"],
    isPopular: true,
    imageUrl: "https://example.com/images/premium_bundle.jpg"
  }
];
const initialCarMakes: PricingItem[] = [
  { id: "make_1", name: "Toyota", price: 500 },
  { id: "make_2", name: "Honda", price: 500 },
  { id: "make_3", name: "BMW", price: 2000 },
  { id: "make_4", name: "Mercedes", price: 2500 },
  { id: "make_5", name: "Audi", price: 2000 },
  { id: "make_6", name: "Porsche", price: 5000 },
  { id: "make_7", name: "Jaguar", price: 4000 },
  { id: "make_8", name: "Land Rover", price: 4500 },
  { id: "make_9", name: "Lexus", price: 3500 },
  { id: "make_10", name: "Hyundai", price: 300 },
  { id: "make_11", name: "Tata", price: 200 },
  { id: "make_12", name: "Mahindra", price: 300 },
  { id: "make_13", name: "Volkswagen", price: 600 },
  { id: "make_14", name: "Skoda", price: 600 },
  { id: "make_15", name: "Kia", price: 400 },
  { id: "make_16", name: "MG", price: 500 },
];
const initialCarModels: CarModel[] = [
  { id: "model_1", name: "Corolla", make: "Toyota", price: 0 },
  { id: "model_2", name: "Camry", make: "Toyota", price: 500 },
  { id: "model_3", name: "Fortuner", make: "Toyota", price: 1000 },
  { id: "model_4", name: "Civic", make: "Honda", price: 0 },
  { id: "model_5", name: "City", make: "Honda", price: 0 },
  { id: "model_6", name: "Accord", make: "Honda", price: 500 },
  { id: "model_7", name: "3 Series", make: "BMW", price: 0 },
  { id: "model_8", name: "5 Series", make: "BMW", price: 1000 },
  { id: "model_9", name: "7 Series", make: "BMW", price: 2000 },
  { id: "model_10", name: "C-Class", make: "Mercedes", price: 0 },
  { id: "model_11", name: "E-Class", make: "Mercedes", price: 1000 },
  { id: "model_12", name: "S-Class", make: "Mercedes", price: 2000 },
  { id: "model_13", name: "A4", make: "Audi", price: 0 },
  { id: "model_14", name: "A6", make: "Audi", price: 1000 },
  { id: "model_15", name: "Q7", make: "Audi", price: 2000 },
  { id: "model_16", name: "911 Carrera", make: "Porsche", price: 5000 },
  { id: "model_17", name: "Cayenne", make: "Porsche", price: 3000 },
  { id: "model_18", name: "XF", make: "Jaguar", price: 1500 },
  { id: "model_19", name: "F-PACE", make: "Jaguar", price: 2000 },
  { id: "model_20", name: "Range Rover", make: "Land Rover", price: 3000 },
  { id: "model_21", name: "Defender", make: "Land Rover", price: 2500 },
  { id: "model_22", name: "ES", make: "Lexus", price: 1000 },
  { id: "model_23", name: "RX", make: "Lexus", price: 2000 },
  { id: "model_24", name: "Creta", make: "Hyundai", price: 0 },
  { id: "model_25", name: "Verna", make: "Hyundai", price: 0 },
  { id: "model_26", name: "Nexon", make: "Tata", price: 0 },
  { id: "model_27", name: "Harrier", make: "Tata", price: 500 },
  { id: "model_28", name: "Safari", make: "Tata", price: 700 },
  { id: "model_29", name: "Thar", make: "Mahindra", price: 0 },
  { id: "model_30", name: "XUV700", make: "Mahindra", price: 500 },
];
const initialFuelTypes: PricingItem[] = [
  { id: "fuel_1", name: "Petrol", price: 0 },
  { id: "fuel_2", name: "Diesel", price: 300 },
  { id: "fuel_3", name: "Electric", price: 800 },
  { id: "fuel_4", name: "CNG", price: 200 },
  { id: "fuel_5", name: "Hybrid", price: 600 },
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
  { id: "cat_5", name: "Deep Cleaning", description: "Interior detailing, exterior polishing, and engine bay cleaning.", iconName: "Sparkles" },
  { id: "cat_6", name: "Wheel Alignment & Balancing", description: "Precision alignment and balancing for smooth driving.", iconName: "Disc" }
];

const initialUiSettings: UiSettings = {
  heroTitle: "",
  heroSubtitle: "",
  heroBgImage: "",
  heroVideoUrl: "https://cdn.pixabay.com/video/2020/09/24/50923-463863484_large.mp4",
  heroBgOpacity: 0.5,
  primaryColor: "#3b82f6",
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
    { id: "1", author: "Rahul Sharma", content: "Best service I've ever had for my car. Very professional!", rating: 5, location: "Kolkata", carModel: "BMW 5 Series", role: "Customer", createdAt: new Date().toISOString() },
    { id: "2", author: "Priya Patel", content: "Transparent pricing and timely delivery. Highly recommended!", rating: 5, location: "Howrah", carModel: "Audi A4", role: "Customer", createdAt: new Date().toISOString() },
    { id: "3", author: "Vikram Singh", content: "The diagnostic accuracy is impressive. They fixed an issue that two other workshops couldn't.", rating: 5, location: "Kolkata", carModel: "Mercedes C-Class", role: "Customer", createdAt: new Date().toISOString() },
    { id: "4", author: "Ananya Das", content: "Excellent ceramic coating job on my new Porsche. The finish is mirror-like.", rating: 5, location: "Kolkata", carModel: "Porsche 911", role: "Customer", createdAt: new Date().toISOString() },
    { id: "5", author: "Sanjay Gupta", content: "Reliable and honest mechanics. They explained everything clearly before starting the work.", rating: 5, location: "Howrah", carModel: "Toyota Fortuner", role: "Customer", createdAt: new Date().toISOString() }
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
    loginAccentColor: "#3b82f6",
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
  { id: "8", label: "Request Service", path: "/request-service", order: 3, isActive: true, isExternal: false },
  { id: "3", label: "Brands", path: "/#brands", order: 4, isActive: true, isExternal: false },
  { id: "4", label: "Locations", path: "/#locations", order: 5, isActive: true, isExternal: false },
  { id: "5", label: "About", path: "/about", order: 6, isActive: true, isExternal: false },
  { id: "6", label: "Contact", path: "/contact", order: 7, isActive: true, isExternal: false },
  { id: "7", label: "FAQs", path: "/faq", order: 8, isActive: true, isExternal: false },
  // Admin Links
  { id: "admin_1", label: "Overview", path: "/admin/dashboard", order: 100, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_2", label: "Workshop", path: "/admin/workshop", order: 101, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_3", label: "Tasks", path: "/admin/tasks", order: 102, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_4", label: "Bookings", path: "/admin/appointments", order: 103, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_5", label: "Inventory", path: "/admin/inventory", order: 104, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_6", label: "Services", path: "/admin/services", order: 105, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_12", label: "Bundles", path: "/admin/service-packages", order: 106, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_13", label: "Brands", path: "/admin/brands", order: 107, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_14", label: "Cities", path: "/admin/locations", order: 108, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_15", label: "Navigation", path: "/admin/navigation", order: 109, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_16", label: "Categories", path: "/admin/categories", order: 110, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_7", label: "Coupons", path: "/admin/coupons", order: 111, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_8", label: "Reviews", path: "/admin/reviews", order: 112, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_17", label: "Testimonials", path: "/admin/testimonials", order: 113, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_18", label: "Car DB", path: "/admin/cars", order: 114, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_19", label: "Vehicle Config", path: "/admin/vehicle-config", order: 115, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_20", label: "Smart Diagnostic", path: "/admin/smart-diagnostic", order: 116, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_9", label: "Customers", path: "/admin/customers", order: 117, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_10", label: "Staff", path: "/admin/users", order: 118, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_21", label: "Interface", path: "/admin/ui-settings", order: 119, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_22", label: "SEO Engine", path: "/admin/seo", order: 120, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_23", label: "Integrations", path: "/admin/api-keys", order: 121, isActive: true, isExternal: false, adminOnly: true },
  { id: "admin_11", label: "System", path: "/admin/settings", order: 122, isActive: true, isExternal: false, adminOnly: true },
];

const initialLocations: Location[] = [
  {
    id: "loc_1",
    name: "Kolkata Hub",
    address: "Park Street, Kolkata",
    city: "Kolkata",
    phone: "+91 98765 43210",
    email: "kolkata@carmechs.in",
    latitude: 22.5448,
    longitude: 88.3516,
    isPopular: true,
    workingHours: "09:00 AM - 08:00 PM",
    googleMapsUrl: "https://goo.gl/maps/example1"
  },
  {
    id: "loc_2",
    name: "Salt Lake Center",
    address: "Sector V, Salt Lake",
    city: "Kolkata",
    phone: "+91 98765 43211",
    email: "saltlake@carmechs.in",
    latitude: 22.5735,
    longitude: 88.4331,
    isPopular: false,
    workingHours: "10:00 AM - 07:00 PM",
    googleMapsUrl: "https://goo.gl/maps/example2"
  },
  {
    id: "loc_3",
    name: "Howrah Service Center",
    address: "123 Auto Road, Howrah",
    city: "Howrah",
    phone: "+91-98765-12345",
    email: "howrah@carmechs.in",
    latitude: 22.5726,
    longitude: 88.3045,
    isPopular: true,
    workingHours: "09:30 AM - 07:30 PM",
    googleMapsUrl: "https://goo.gl/maps/example3"
  }
];

const initialInventory: InventoryItem[] = [
  {
    id: "inv_1",
    name: "Synthetic Engine Oil 5W-30",
    sku: "OIL-5W30-SYN",
    category: "Consumables",
    quantity: 25,
    minQuantity: 10,
    price: 850,
    status: "in_stock",
    stock: 25
  }
];

const initialTechnicians: Technician[] = [
  {
    id: "tech_1",
    userId: "user_tech_1",
    name: "Rajesh Kumar",
    specialty: "Engine Expert",
    experience: "12 Years",
    status: "available",
    rating: 4.9,
    reviewCount: 124,
    avatar: "https://i.pravatar.cc/150?u=tech1",
    servicesOffered: ["ser_1", "ser_6"],
    bio: "Master technician with expertise in high-performance engines and complex overhauls."
  },
  {
    id: "tech_2",
    userId: "user_tech_2",
    name: "Amit Singh",
    specialty: "AC & Electrical",
    experience: "8 Years",
    status: "busy",
    rating: 4.7,
    reviewCount: 89,
    avatar: "https://i.pravatar.cc/150?u=tech2",
    servicesOffered: ["ser_2"],
    bio: "Specialist in automotive climate control and advanced electrical diagnostics."
  },
  {
    id: "tech_3",
    userId: "user_tech_3",
    name: "Suresh Das",
    specialty: "Body & Paint",
    experience: "15 Years",
    status: "available",
    rating: 4.8,
    reviewCount: 210,
    avatar: "https://i.pravatar.cc/150?u=tech3",
    servicesOffered: ["ser_7", "ser_5"],
    bio: "Expert in precision denting and high-quality paint finishing."
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [services, setServices] = React.useState<Service[]>(initialServices);
  const [carMakes, setCarMakes] = React.useState<PricingItem[]>(initialCarMakes);
  const [carModels, setCarModels] = React.useState<CarModel[]>(initialCarModels);
  const [fuelTypes, setFuelTypes] = React.useState<PricingItem[]>(initialFuelTypes);
  const [settings, setSettings] = React.useState<Settings>(initialSettings);
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [users, setUsers] = React.useState<User[]>(initialUsers);
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);
  const [uiSettings, setUiSettings] = React.useState<UiSettings>(initialUiSettings);
  const [apiKeys, setApiKeys] = React.useState<ApiKeys>(initialApiKeys);
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [locations, setLocations] = React.useState<Location[]>(initialLocations);
  const [inventory, setInventory] = React.useState<InventoryItem[]>(initialInventory);
  const [categories, setCategories] = React.useState<ServiceCategory[]>(initialCategories);
  const [coupons, setCoupons] = React.useState<Coupon[]>([]);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [servicePackages, setServicePackages] = React.useState<ServicePackage[]>(initialServicePackages);
  const [technicians, setTechnicians] = React.useState<Technician[]>([]);
  const [serviceRequests, setServiceRequests] = React.useState<ServiceRequest[]>([]);
  const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
  const [contactSubmissions, setContactSubmissions] = React.useState<ContactSubmission[]>([]);
  const [navigationItems, setNavigationItems] = React.useState<NavigationItem[]>(initialNavigationItems);
  const [workshops, setWorkshops] = React.useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [missingTables, setMissingTables] = React.useState<string[]>([]);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = React.useState(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });

  const [adminRole, setAdminRole] = React.useState<'admin' | 'viewer' | null>(() => {
    return (localStorage.getItem('adminRole') as 'admin' | 'viewer' | null) || null;
  });

  const [currentUser, setCurrentUser] = React.useState<FirebaseUser | null>(null);

  React.useEffect(() => {
    const config = getFirebaseConfig(apiKeys);
    if (config.apiKey && config.projectId) {
      try {
        const auth = getFirebaseAuth(apiKeys);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          setCurrentUser(user);
          if (user) {
            // Check if user exists in our Supabase users table
            setUsers(prev => {
              const existingUser = prev.find(u => u.id === user.uid || u.email === user.email);
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
                const updatedUsers = [...prev, newUser];
                updateTable('users', updatedUsers);
                return updatedUsers;
              }
              return prev;
            });
          }
        });
        return unsubscribe;
      } catch (e) {
        console.error("Firebase auth error:", e);
      }
    }
  }, [apiKeys]);

  const login = async (email: string, password: string) => {
    const config = getFirebaseConfig(apiKeys);
    if (config.apiKey && config.projectId) {
      const auth = getFirebaseAuth(apiKeys);
      return signInWithEmailAndPassword(auth, email, password);
    }
    throw new Error("Firebase not configured");
  };

  const signup = async (email: string, password: string, name: string, phone: string) => {
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
          phone: phone,
          role: 'user',
          verified: false,
          blocked: false,
          walletBalance: 0,
          referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
          referralsCount: 0,
          createdAt: new Date().toISOString()
        };
        setUsers(prev => {
          const updatedUsers = [...prev, newUser];
          updateTable('users', updatedUsers);
          return updatedUsers;
        });
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

  React.useEffect(() => {
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
            if (!mergedUsers.find(iu => iu.id === u.id || iu.email.toLowerCase() === u.email.toLowerCase())) {
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
          setLocations(state.locations?.length ? state.locations : initialLocations);
          setInventory(state.inventory?.length ? state.inventory : initialInventory);
          setCategories(state.categories || []);
          setCoupons(state.coupons || []);
          setReviews(state.reviews || []);
          setNotifications(state.notifications || []);
          setServicePackages(state.servicePackages || []);
          setContactSubmissions(state.contactSubmissions || []);
          setTechnicians(state.technicians?.length ? state.technicians : initialTechnicians);
          setTestimonials(state.testimonials || []);
          setNavigationItems(state.navigationItems?.length ? state.navigationItems : initialNavigationItems);
          setWorkshops(state.workshops || []);
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
        .on('postgres_changes', { event: '*', schema: 'public', table: 'workshops' }, () => fetchInitialData())
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
        if (!mergedUsers.find(iu => iu.id === u.id || iu.email.toLowerCase() === u.email.toLowerCase())) {
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
      setWorkshops(state.workshops || []);
      setTechnicians(state.technicians?.length ? state.technicians : initialTechnicians);
      setServiceRequests(state.serviceRequests || []);
      setNavigationItems(state.navigationItems?.length ? state.navigationItems : initialNavigationItems);
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
    newSocket.on('workshops_updated', (newWorkshops) => setWorkshops(newWorkshops));
    newSocket.on('technicians_updated', (newTechnicians) => setTechnicians(newTechnicians));
    newSocket.on('service_requests_updated', (newRequests) => setServiceRequests(newRequests));
    newSocket.on('navigation_items_updated', (newItems) => setNavigationItems(newItems));

    return () => {
      newSocket.disconnect();
      if (cleanupSupabase) cleanupSupabase();
    };
  }, []);

  // Monitor inventory for low stock alerts
  React.useEffect(() => {
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

  React.useEffect(() => {
    localStorage.setItem('isAdminLoggedIn', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  React.useEffect(() => {
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

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    updateTasks(updatedTasks);
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

  const addBrand = (brand: Omit<Brand, 'id'>) => {
    const newBrand: Brand = {
      ...brand,
      id: Math.random().toString(36).substring(2, 9)
    };
    const updatedBrands = [...brands, newBrand];
    updateBrands(updatedBrands);
  };

  const deleteBrand = (id: string) => {
    const updatedBrands = brands.filter(b => b.id !== id);
    updateBrands(updatedBrands);
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

  const updateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    try {
      const dbUpdates: any = {};
      if (updates.make) dbUpdates.make = updates.make;
      if (updates.model) dbUpdates.model = updates.model;
      if (updates.year) dbUpdates.year = updates.year;
      if (updates.fuelType) dbUpdates.fuel_type = updates.fuelType;
      if (updates.licensePlate) dbUpdates.license_plate = updates.licensePlate;
      if (updates.vin) dbUpdates.vin = updates.vin;
      if (updates.lastServiceDate) dbUpdates.last_service_date = updates.lastServiceDate;

      const { error } = await supabase.from('vehicles').update(dbUpdates).eq('id', id);
      if (error) throw error;
      setVehicles(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    } catch (error) {
      console.error("Error updating vehicle:", error);
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

  const addCoupon = (coupon: Omit<Coupon, 'id' | 'isActive'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: Math.random().toString(36).substring(2, 9),
      isActive: true
    };
    const updatedCoupons = [newCoupon, ...coupons];
    updateCoupons(updatedCoupons);
  };

  const deleteCoupon = (id: string) => {
    const updatedCoupons = coupons.filter(c => c.id !== id);
    updateCoupons(updatedCoupons);
  };

  const updateReviews = (newReviews: Review[]) => {
    setReviews(newReviews);
    if (socket?.connected) {
      socket.emit('update_reviews', newReviews);
    } else {
      updateTable('reviews', newReviews);
    }
  };

  const addReview = (review: Omit<Review, 'id' | 'createdAt' | 'isPublished'>) => {
    const newReview: Review = {
      ...review,
      id: Math.random().toString(36).substring(2, 9),
      isPublished: false,
      createdAt: new Date().toISOString()
    };
    const updatedReviews = [newReview, ...reviews];
    updateReviews(updatedReviews);
  };

  const deleteReview = (id: string) => {
    const updatedReviews = reviews.filter(r => r.id !== id);
    updateReviews(updatedReviews);
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

  const addNavigationItem = (item: Omit<NavigationItem, 'id'>) => {
    const newItem: NavigationItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9)
    };
    const updatedItems = [...navigationItems, newItem].sort((a, b) => a.order - b.order);
    updateNavigationItems(updatedItems);
  };

  const deleteNavigationItem = (id: string) => {
    const updatedItems = navigationItems.filter(item => item.id !== id);
    updateNavigationItems(updatedItems);
  };

  const updateWorkshops = (newWorkshops: Workshop[]) => {
    setWorkshops(newWorkshops);
    if (socket?.connected) {
      socket.emit('update_workshops', newWorkshops);
    } else {
      updateTable('workshops', newWorkshops);
    }
  };

  const updateTechnicians = (newTechnicians: Technician[]) => {
    setTechnicians(newTechnicians);
    if (socket?.connected) {
      socket.emit('update_technicians', newTechnicians);
    } else {
      updateTable('technicians', newTechnicians);
    }
  };

  const updateTechnicianStatus = (technicianId: string, status: 'available' | 'busy' | 'off') => {
    const updatedTechnicians = technicians.map(t => t.id === technicianId ? { ...t, status } : t);
    setTechnicians(updatedTechnicians);
    if (socket?.connected) {
      socket.emit('update_technicians', updatedTechnicians);
    } else {
      updateTable('technicians', updatedTechnicians);
    }
  };

  const updateServiceRequests = (newRequests: ServiceRequest[]) => {
    setServiceRequests(newRequests);
    if (socket?.connected) {
      socket.emit('update_service_requests', newRequests);
    } else {
      updateTable('service_requests', newRequests);
    }
  };

  const addServiceRequest = (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => {
    const newRequest: ServiceRequest = {
      ...request,
      id: Math.random().toString(36).substring(2, 9),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    const updatedRequests = [newRequest, ...serviceRequests];
    setServiceRequests(updatedRequests);
    if (socket?.connected) {
      socket.emit('update_service_requests', updatedRequests);
    } else {
      updateTable('service_requests', updatedRequests);
    }
  };

  const updateWorkshop = (workshopId: string, updates: Partial<Workshop>) => {
    const updatedWorkshops = workshops.map(w => w.id === workshopId ? { ...w, ...updates } : w);
    setWorkshops(updatedWorkshops);
    if (socket?.connected) {
      socket.emit('update_workshops', updatedWorkshops);
    } else {
      updateTable('workshops', updatedWorkshops);
    }
  };

  const updateAppointment = (appointmentId: string, updates: Partial<Appointment>) => {
    const updatedAppointments = appointments.map(a => a.id === appointmentId ? { ...a, ...updates } : a);
    setAppointments(updatedAppointments);
    if (socket?.connected) {
      socket.emit('update_appointments', updatedAppointments);
    } else {
      updateTable('appointments', updatedAppointments);
    }
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newService: Service = { 
      ...service, 
      id: `ser_${Date.now()}`,
      features: service.features || [],
      checks: service.checks || [],
      basePrice: service.basePrice || 0,
      estimatedPrice: service.estimatedPrice || 0,
      estimatedDuration: service.estimatedDuration || "1 Hour"
    };
    const updatedServices = [...services, newService];
    updateServices(updatedServices);
    return newService;
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
      serviceRequests,
      vehicles,
      testimonials,
      contactSubmissions,
      navigationItems,
      workshops,
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
      addNavigationItem,
      deleteNavigationItem,
      updateWorkshops,
      updateTechnicians,
      updateTechnicianStatus,
      updateServiceRequests,
      addServiceRequest,
      updateWorkshop,
      updateAppointment,
      addService,
      addAppointment,
      addTask,
      deleteTask,
      addReview,
      deleteReview,
      addBrand,
      deleteBrand,
      addCoupon,
      deleteCoupon,
      addContactSubmission,
      addNotification,
      addVehicle,
      removeVehicle,
      updateVehicle,
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
