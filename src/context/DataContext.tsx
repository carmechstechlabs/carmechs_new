import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

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
  iconUrl?: string;
}

export interface Brand {
  id: string;
  name: string;
  imageUrl: string;
}

export interface PricingItem {
  name: string;
  multiplier: number;
}

export interface CarModel {
  name: string;
  multiplier: number;
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
  make: string;
  model: string;
  fuel: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentMethod?: 'razorpay' | 'paytm' | 'pay_after_service';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  amount?: number;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'viewer' | 'user';
  verified: boolean;
  blocked: boolean;
  walletBalance: number;
  referralCode: string;
  referredBy?: string;
  referralsCount: number;
}

export interface Feature {
  title: string;
  description: string;
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
  testimonialText: string;
  testimonialAuthor: string;
  testimonialRating: number;
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

interface DataContextType {
  services: Service[];
  carMakes: PricingItem[];
  carModels: CarModel[];
  fuelTypes: PricingItem[];
  settings: Settings;
  appointments: Appointment[];
  users: User[];
  uiSettings: UiSettings;
  apiKeys: ApiKeys;
  brands: Brand[];
  updateServices: (services: Service[]) => void;
  updateCarMakes: (makes: PricingItem[]) => void;
  updateCarModels: (models: CarModel[]) => void;
  updateFuelTypes: (fuels: PricingItem[]) => void;
  updateSettings: (settings: Settings) => void;
  updateAppointments: (appointments: Appointment[]) => void;
  updateUsers: (users: User[]) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  updateUiSettings: (uiSettings: UiSettings) => void;
  updateApiKeys: (apiKeys: ApiKeys) => void;
  updateBrands: (brands: Brand[]) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
  updateWalletBalance: (userId: string, amount: number) => void;
  processReferral: (referralCode: string, newUserId: string) => void;
  isAdminLoggedIn: boolean;
  adminRole: 'admin' | 'viewer' | null;
  loginAdmin: (role?: 'admin' | 'viewer') => void;
  logoutAdmin: () => void;
  currentUser: FirebaseUser | null;
  logout: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Data
const initialServices: Service[] = [];
const initialCarMakes: PricingItem[] = [];
const initialCarModels: CarModel[] = [];
const initialFuelTypes: PricingItem[] = [];
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
  testimonialRating: 4.9
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
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [uiSettings, setUiSettings] = useState<UiSettings>(initialUiSettings);
  const [apiKeys, setApiKeys] = useState<ApiKeys>(initialApiKeys);
  const [brands, setBrands] = useState<Brand[]>([]);

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
    const newSocket = io(); // Connect to the same host
    setSocket(newSocket);

    newSocket.on('initial_state', (state) => {
      setServices(state.services);
      setCarMakes(state.carMakes);
      setCarModels(state.carModels);
      setFuelTypes(state.fuelTypes);
      setSettings(state.settings);
      setAppointments(state.appointments);
      setUsers(state.users);
      setUiSettings(state.uiSettings);
      setApiKeys(state.apiKeys);
      setBrands(state.brands || []);
    });

    newSocket.on('services_updated', (newServices) => setServices(newServices));
    newSocket.on('car_makes_updated', (newMakes) => setCarMakes(newMakes));
    newSocket.on('car_models_updated', (newModels) => setCarModels(newModels));
    newSocket.on('fuel_types_updated', (newFuels) => setFuelTypes(newFuels));
    newSocket.on('settings_updated', (newSettings) => setSettings(newSettings));
    newSocket.on('appointments_updated', (newAppointments) => setAppointments(newAppointments));
    newSocket.on('users_updated', (newUsers) => setUsers(newUsers));
    newSocket.on('ui_settings_updated', (newUiSettings) => setUiSettings(newUiSettings));
    newSocket.on('api_keys_updated', (newApiKeys) => setApiKeys(newApiKeys));
    newSocket.on('brands_updated', (newBrands) => setBrands(newBrands));

    return () => {
      newSocket.disconnect();
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
    socket?.emit('update_services', newServices);
  };
  
  const updateCarMakes = (newMakes: PricingItem[]) => {
    setCarMakes(newMakes);
    socket?.emit('update_car_makes', newMakes);
  };
  
  const updateCarModels = (newModels: CarModel[]) => {
    setCarModels(newModels);
    socket?.emit('update_car_models', newModels);
  };
  
  const updateFuelTypes = (newFuels: PricingItem[]) => {
    setFuelTypes(newFuels);
    socket?.emit('update_fuel_types', newFuels);
  };
  
  const updateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    socket?.emit('update_settings', newSettings);
  };
  
  const updateAppointments = (newAppointments: Appointment[]) => {
    setAppointments(newAppointments);
    socket?.emit('update_appointments', newAppointments);
  };
  
  const updateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    socket?.emit('update_users', newUsers);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, ...updates } : u);
    setUsers(updatedUsers);
    socket?.emit('update_users', updatedUsers);
  };

  const updateUiSettings = (newUiSettings: UiSettings) => {
    setUiSettings(newUiSettings);
    socket?.emit('update_ui_settings', newUiSettings);
  };

  const updateApiKeys = (newApiKeys: ApiKeys) => {
    setApiKeys(newApiKeys);
    socket?.emit('update_api_keys', newApiKeys);
  };

  const updateBrands = (newBrands: Brand[]) => {
    setBrands(newBrands);
    socket?.emit('update_brands', newBrands);
  };

  const updateWalletBalance = (userId: string, amount: number) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, walletBalance: (u.walletBalance || 0) + amount } : u
    );
    setUsers(updatedUsers);
    socket?.emit('update_users', updatedUsers);
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
    socket?.emit('update_users', updatedUsers);
  };

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Math.random().toString(36).substring(2, 9),
      status: 'pending',
      paymentStatus: appointment.paymentMethod === 'pay_after_service' ? 'pending' : 'paid',
      createdAt: new Date().toISOString()
    };
    setAppointments(prev => [newAppointment, ...prev]);
    // We emit the add_appointment event, and the server will broadcast the updated list
    socket?.emit('add_appointment', newAppointment);
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
      users,
      uiSettings,
      apiKeys,
      brands,
      updateServices,
      updateCarMakes,
      updateCarModels,
      updateFuelTypes,
      updateSettings,
      updateAppointments,
      updateUsers,
      updateUser,
      updateUiSettings,
      updateApiKeys,
      updateBrands,
      addAppointment,
      updateWalletBalance,
      processReferral,
      isAdminLoggedIn,
      adminRole,
      loginAdmin,
      logoutAdmin,
      currentUser,
      logout
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
