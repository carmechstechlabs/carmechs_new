import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

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
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
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
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'viewer' | 'user';
  verified: boolean;
}

export interface UiSettings {
  heroTitle: string;
  heroSubtitle: string;
  primaryColor: string;
}

export interface ApiKeys {
  googleClientId: string;
  firebaseApiKey: string;
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
  updateServices: (services: Service[]) => void;
  updateCarMakes: (makes: PricingItem[]) => void;
  updateCarModels: (models: CarModel[]) => void;
  updateFuelTypes: (fuels: PricingItem[]) => void;
  updateSettings: (settings: Settings) => void;
  updateAppointments: (appointments: Appointment[]) => void;
  updateUsers: (users: User[]) => void;
  updateUiSettings: (uiSettings: UiSettings) => void;
  updateApiKeys: (apiKeys: ApiKeys) => void;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => void;
  isAdminLoggedIn: boolean;
  adminRole: 'admin' | 'viewer' | null;
  loginAdmin: (role?: 'admin' | 'viewer') => void;
  logoutAdmin: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Data
const initialServices: Service[] = [];
const initialCarMakes: PricingItem[] = [];
const initialCarModels: CarModel[] = [];
const initialFuelTypes: PricingItem[] = [];
const initialSettings: Settings = {
  logoText: "",
  email: "",
  phone: "",
  address: "",
  whatsapp: "",
};
const initialUsers: User[] = [];
const initialUiSettings: UiSettings = {
  heroTitle: "",
  heroSubtitle: "",
  primaryColor: "",
};
const initialApiKeys: ApiKeys = {
  googleClientId: "",
  firebaseApiKey: "",
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

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });

  const [adminRole, setAdminRole] = useState<'admin' | 'viewer' | null>(() => {
    return (localStorage.getItem('adminRole') as 'admin' | 'viewer' | null) || null;
  });

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

  const updateUiSettings = (newUiSettings: UiSettings) => {
    setUiSettings(newUiSettings);
    socket?.emit('update_ui_settings', newUiSettings);
  };

  const updateApiKeys = (newApiKeys: ApiKeys) => {
    setApiKeys(newApiKeys);
    socket?.emit('update_api_keys', newApiKeys);
  };

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Math.random().toString(36).substring(2, 9),
      status: 'pending',
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
      updateServices,
      updateCarMakes,
      updateCarModels,
      updateFuelTypes,
      updateSettings,
      updateAppointments,
      updateUsers,
      updateUiSettings,
      updateApiKeys,
      addAppointment,
      isAdminLoggedIn,
      adminRole,
      loginAdmin,
      logoutAdmin
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
