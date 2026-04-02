
const isServer = typeof window === 'undefined';

const STORAGE_KEY = 'carmechs_local_data';

// Helper to map camelCase to snake_case (for compatibility with existing logic if needed)
export const toSnakeCase = (obj: any) => {
  if (!obj) return obj;
  const newObj: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    newObj[snakeKey] = obj[key];
  }
  return newObj;
};

const getLocalData = () => {
  if (isServer) return {};
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
};

const setLocalData = (data: any) => {
  if (isServer) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export async function getInitialState() {
  if (isServer) return null;
  const data = getLocalData();
  
  return {
    missingTables: [],
    services: data.services || [],
    carMakes: data.car_makes || [],
    carModels: data.car_models || [],
    fuelTypes: data.fuel_types || [],
    settings: data.settings || {},
    appointments: data.appointments || [],
    tasks: data.tasks || [],
    users: data.users || [],
    uiSettings: data.ui_settings || {},
    apiKeys: data.api_keys || {},
    brands: data.brands || [],
    locations: data.locations || [],
    inventory: data.inventory || [],
    categories: data.categories || [],
    coupons: data.coupons || [],
    reviews: data.reviews || [],
    notifications: data.notifications || [],
    servicePackages: data.service_packages || [],
    vehicles: data.vehicles || [],
    contactSubmissions: data.contact_submissions || [],
    technicians: data.technicians || [],
    testimonials: data.testimonials || [],
    navigationItems: data.navigation_items || [],
    workshops: data.workshops || [],
    serviceRequests: data.service_requests || []
  };
}

export async function updateTable(table: string, data: any[]) {
  if (isServer) return;
  const allData = getLocalData();
  allData[table] = data;
  setLocalData(allData);
}

export async function deleteFromTable(table: string, id: string) {
  if (isServer) return;
  const allData = getLocalData();
  if (allData[table]) {
    allData[table] = allData[table].filter((item: any) => item.id !== id);
    setLocalData(allData);
  }
}

export async function updateConfig(key: string, value: any) {
  if (isServer) return;
  const allData = getLocalData();
  allData[key] = value;
  setLocalData(allData);
}

export async function addAppointment(appointment: any) {
  if (isServer) return;
  const allData = getLocalData();
  if (!allData.appointments) allData.appointments = [];
  allData.appointments.unshift(appointment);
  setLocalData(allData);
}

export async function uploadImage(file: File) {
  // Local storage doesn't support file uploads easily, return a data URL or mock
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

export const supabase = null; // Mock for compatibility
