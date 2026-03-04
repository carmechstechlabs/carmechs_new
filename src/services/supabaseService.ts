import { createClient } from '@supabase/supabase-js';

const isServer = typeof window === 'undefined';

const supabaseUrl = (
  (isServer ? process.env.SUPABASE_URL : import.meta.env.VITE_SUPABASE_URL) || ''
).replace(/^["']|["']$/g, '');

const supabaseKey = (
  (isServer ? process.env.SUPABASE_SERVICE_ROLE_KEY : import.meta.env.VITE_SUPABASE_ANON_KEY) || ''
).replace(/^["']|["']$/g, '');

if (!isServer && (!supabaseUrl || !supabaseKey)) {
  console.warn("Supabase configuration missing! Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.");
}

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Helper to map camelCase to snake_case for DB
const toSnakeCase = (obj: any) => {
  if (!obj) return obj;
  const newObj: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    newObj[snakeKey] = obj[key];
  }
  return newObj;
};

// Helper to map snake_case to camelCase for App
const toCamelCase = (obj: any) => {
  if (!obj) return obj;
  const newObj: any = {};
  for (const key in obj) {
    const camelKey = key.replace(/(_\w)/g, m => m[1].toUpperCase());
    newObj[camelKey] = obj[key];
  }
  return newObj;
};

export async function getInitialState() {
  if (!supabase) return null;
  try {
    const { data: services, error: sErr } = await supabase.from('services').select('*');
    const { data: carMakes, error: cmErr } = await supabase.from('car_makes').select('*');
    const { data: carModels, error: cmodErr } = await supabase.from('car_models').select('*');
    const { data: fuelTypes, error: fErr } = await supabase.from('fuel_types').select('*');
    const { data: brands, error: bErr } = await supabase.from('brands').select('*');
    const { data: locations, error: lErr } = await supabase.from('locations').select('*');
    const { data: inventory, error: iErr } = await supabase.from('inventory').select('*');
    const { data: categories, error: catErr } = await supabase.from('categories').select('*');
    const { data: coupons, error: cpErr } = await supabase.from('coupons').select('*');
    const { data: reviews, error: rErr } = await supabase.from('reviews').select('*');
    const { data: notifications, error: nErr } = await supabase.from('notifications').select('*');
    const { data: users, error: uErr } = await supabase.from('users').select('*');
    const { data: appointments, error: aErr } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
    const { data: config, error: cfgErr } = await supabase.from('site_config').select('*');

    if (sErr || cmErr || cmodErr || fErr || bErr || lErr || uErr || aErr || cfgErr || iErr || catErr || cpErr || rErr || nErr) {
      console.error('Error fetching initial state from Supabase:', { sErr, cmErr, cmodErr, fErr, bErr, lErr, uErr, aErr, cfgErr, iErr, catErr, cpErr, rErr, nErr });
    }

    const settings = config?.find(c => c.key === 'settings')?.value || {};
    const uiSettings = config?.find(c => c.key === 'ui_settings')?.value || {};
    const apiKeys = config?.find(c => c.key === 'api_keys')?.value || {};

    return {
      services: (services || []).map(toCamelCase),
      carMakes: (carMakes || []).map(toCamelCase),
      carModels: (carModels || []).map(toCamelCase),
      fuelTypes: (fuelTypes || []).map(toCamelCase),
      settings,
      appointments: (appointments || []).map(a => {
        const camel = toCamelCase(a);
        // Map service_title back to service for the frontend
        return { ...camel, service: a.service_title };
      }),
      users: (users || []).map(toCamelCase),
      uiSettings,
      apiKeys,
      brands: (brands || []).map(toCamelCase),
      locations: (locations || []).map(toCamelCase),
      inventory: (inventory || []).map(toCamelCase),
      categories: (categories || []).map(toCamelCase),
      coupons: (coupons || []).map(toCamelCase),
      reviews: (reviews || []).map(toCamelCase),
      notifications: (notifications || []).map(toCamelCase),
    };
  } catch (error) {
    console.error('Unexpected error in getInitialState:', error);
    return {
      services: [],
      carMakes: [],
      carModels: [],
      fuelTypes: [],
      settings: {},
      appointments: [],
      users: [],
      uiSettings: {},
      apiKeys: {},
      brands: [],
      locations: [],
      inventory: [],
      categories: [],
      coupons: [],
      reviews: [],
      notifications: [],
    };
  }
}

export async function updateTable(table: string, data: any[]) {
  if (!supabase) return;
  try {
    if (!data || data.length === 0) return;

    const mappedData = data.map(item => {
      const snake = toSnakeCase(item);
      // Special handling for appointments to match SQL schema
      if (table === 'appointments') {
        return {
          ...snake,
          service_title: item.service,
          service_id: item.serviceId || item.service || 'unknown'
        };
      }
      return snake;
    });

    const { error } = await supabase.from(table).upsert(mappedData);
    if (error) console.error(`Error updating ${table}:`, error);
  } catch (error) {
    console.error(`Unexpected error updating ${table}:`, error);
  }
}

export async function updateConfig(key: string, value: any) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('site_config').upsert({ key, value, updated_at: new Date() });
    if (error) console.error(`Error updating config ${key}:`, error);
  } catch (error) {
    console.error(`Unexpected error updating config ${key}:`, error);
  }
}

export async function addAppointment(appointment: any) {
  if (!supabase) return;
  try {
    const snake = toSnakeCase(appointment);
    const dbAppointment = {
      ...snake,
      service_title: appointment.service,
      service_id: appointment.serviceId || appointment.service || 'unknown'
    };
    
    const { error } = await supabase.from('appointments').insert(dbAppointment);
    if (error) console.error('Error adding appointment:', error);
  } catch (error) {
    console.error('Unexpected error adding appointment:', error);
  }
}
