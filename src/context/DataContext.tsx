import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
}

export interface Settings {
  logoText: string;
  email: string;
  phone: string;
  address: string;
  whatsapp: string;
}

interface DataContextType {
  services: Service[];
  carMakes: PricingItem[];
  carModels: CarModel[];
  fuelTypes: PricingItem[];
  settings: Settings;
  updateServices: (services: Service[]) => void;
  updateCarMakes: (makes: PricingItem[]) => void;
  updateCarModels: (models: CarModel[]) => void;
  updateFuelTypes: (fuels: PricingItem[]) => void;
  updateSettings: (settings: Settings) => void;
  isAdminLoggedIn: boolean;
  loginAdmin: () => void;
  logoutAdmin: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial Data
const initialServices: Service[] = [
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

const initialCarMakes: PricingItem[] = [
  { name: "Toyota", multiplier: 1.1 },
  { name: "Honda", multiplier: 1.1 },
  { name: "Ford", multiplier: 1.1 },
  { name: "BMW", multiplier: 2.0 },
  { name: "Mercedes", multiplier: 2.0 },
  { name: "Audi", multiplier: 2.0 },
  { name: "Hyundai", multiplier: 1.0 },
  { name: "Kia", multiplier: 1.0 }
];

const initialCarModels: CarModel[] = [
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

const initialFuelTypes: PricingItem[] = [
  { name: "Petrol", multiplier: 1.0 },
  { name: "Diesel", multiplier: 1.15 },
  { name: "CNG", multiplier: 1.1 },
  { name: "Electric", multiplier: 1.2 }
];

const initialSettings: Settings = {
  logoText: "CarMechs",
  email: "assist@carmechs.in",
  phone: "+91-70034-35356",
  address: "Newtown, Kolkata 700156",
  whatsapp: "+917003435356",
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('services');
    return saved ? JSON.parse(saved) : initialServices;
  });

  const [carMakes, setCarMakes] = useState<PricingItem[]>(() => {
    const saved = localStorage.getItem('carMakes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'object' && item !== null && 'name' in item && 'multiplier' in item)) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse carMakes", e);
      }
    }
    return initialCarMakes;
  });

  const [carModels, setCarModels] = useState<CarModel[]>(() => {
    const saved = localStorage.getItem('carModels');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Check if it's the new format (has 'make' property)
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'object' && item !== null && 'name' in item && 'multiplier' in item && 'make' in item)) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse carModels", e);
      }
    }
    return initialCarModels;
  });

  const [fuelTypes, setFuelTypes] = useState<PricingItem[]>(() => {
    const saved = localStorage.getItem('fuelTypes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(item => typeof item === 'object' && item !== null && 'name' in item && 'multiplier' in item)) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed to parse fuelTypes", e);
      }
    }
    return initialFuelTypes;
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('carMakes', JSON.stringify(carMakes));
  }, [carMakes]);

  useEffect(() => {
    localStorage.setItem('carModels', JSON.stringify(carModels));
  }, [carModels]);

  useEffect(() => {
    localStorage.setItem('fuelTypes', JSON.stringify(fuelTypes));
  }, [fuelTypes]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('isAdminLoggedIn', String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  const updateServices = (newServices: Service[]) => setServices(newServices);
  const updateCarMakes = (newMakes: PricingItem[]) => setCarMakes(newMakes);
  const updateCarModels = (newModels: CarModel[]) => setCarModels(newModels);
  const updateFuelTypes = (newFuels: PricingItem[]) => setFuelTypes(newFuels);
  const updateSettings = (newSettings: Settings) => setSettings(newSettings);
  const loginAdmin = () => setIsAdminLoggedIn(true);
  const logoutAdmin = () => setIsAdminLoggedIn(false);

  return (
    <DataContext.Provider value={{
      services,
      carMakes,
      carModels,
      fuelTypes,
      settings,
      updateServices,
      updateCarMakes,
      updateCarModels,
      updateFuelTypes,
      updateSettings,
      isAdminLoggedIn,
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
