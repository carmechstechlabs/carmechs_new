import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
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
  isRead: boolean;
  createdAt: string;
}

export interface Location {
  id: string;
  name: string;
  isPopular: boolean;
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
  footerDescription?: string;
  privacyPolicyUrl?: string;
  termsOfServiceUrl?: string;
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
  type: 'hero' | 'features' | 'content' | 'cta' | 'faq' | 'contact' | 'services' | 'brands' | 'faq-list' | 'contact-form';
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

export interface UiSettings {
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage?: string;
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
  contactSubmissions: ContactSubmission[];
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
const initialServices: Service[] = [];
const initialServicePackages: ServicePackage[] = [];
const initialCarMakes: PricingItem[] = [
  { name: "Toyota", price: 500 },
  { name: "Honda", price: 500 },
  { name: "BMW", price: 2000 },
  { name: "Mercedes", price: 2500 },
  { name: "Audi", price: 2000 },
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
const initialUsers: User[] = [];
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
    { id: "1", name: "Rahul Sharma", quote: "Best service I've ever had for my car. Very professional!", rating: 5 },
    { id: "2", name: "Priya Patel", quote: "Transparent pricing and timely delivery. Highly recommended!", rating: 5 }
  ],
  socialLinks: [
    { id: "1", platform: "Facebook", url: "https://facebook.com", iconName: "Facebook" },
    { id: "2", platform: "Instagram", url: "https://instagram.com", iconName: "Instagram" },
    { id: "3", platform: "Twitter", url: "https://twitter.com", iconName: "Twitter" }
  ],
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
        { id: "c2", type: "contact-form", title: "Submit Inquiry" }
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
  ]
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
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
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
    if (apiKeys.firebaseApiKey && apiKeys.firebaseProjectId) {
      try {
        const auth = getFirebaseAuth(apiKeys);
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setCurrentUser(user);
        });
        return unsubscribe;
      } catch (e) {
        console.error("Firebase auth error:", e);
      }
    }
  }, [apiKeys]);

  const logout = async () => {
    if (apiKeys.firebaseApiKey && apiKeys.firebaseProjectId) {
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
          setUsers(state.users);
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
      setUsers(state.users);
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

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
    if (socket?.connected) {
      socket.emit('add_notification', newNotification);
    } else {
      updateTable('notifications', [newNotification, ...notifications]);
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
  };
  
  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    setAdminRole(null);
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
      contactSubmissions,
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
