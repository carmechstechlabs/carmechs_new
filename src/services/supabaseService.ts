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
    const results = await Promise.all([
      supabase.from('services').select('*'),
      supabase.from('car_makes').select('*'),
      supabase.from('car_models').select('*'),
      supabase.from('fuel_types').select('*'),
      supabase.from('brands').select('*'),
      supabase.from('locations').select('*'),
      supabase.from('inventory').select('*'),
      supabase.from('categories').select('*'),
      supabase.from('coupons').select('*'),
      supabase.from('reviews').select('*'),
      supabase.from('notifications').select('*'),
      supabase.from('service_packages').select('*'),
      supabase.from('vehicles').select('*'),
      supabase.from('users').select('*'),
      supabase.from('appointments').select('*').order('created_at', { ascending: false }),
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('site_config').select('*'),
      supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
      supabase.from('technicians').select('*'),
      supabase.from('testimonials').select('*'),
      supabase.from('navigation_items').select('*').order('order', { ascending: true }),
      supabase.from('workshops').select('*'),
      supabase.from('service_requests').select('*').order('created_at', { ascending: false })
    ]);

    const tableNames = [
      'services', 'car_makes', 'car_models', 'fuel_types', 'brands', 'locations',
      'inventory', 'categories', 'coupons', 'reviews', 'notifications',
      'service_packages', 'vehicles', 'users', 'appointments', 'tasks', 'site_config', 'contact_submissions', 'technicians', 'testimonials', 'navigation_items', 'workshops', 'service_requests'
    ];

    const missingTables: string[] = [];
    results.forEach((res, index) => {
      if (res.error) {
        const isMissing = 
          res.error.code === 'PGRST116' || 
          res.error.message.includes('relation') || 
          res.error.message.includes('does not exist') ||
          res.error.message.includes('schema cache');

        if (isMissing) {
          console.warn(`Supabase Table Missing: "${tableNames[index]}" does not exist. Please create it in your Supabase dashboard.`);
          missingTables.push(tableNames[index]);
        } else {
          console.error(`Error fetching table "${tableNames[index]}":`, res.error.message);
        }
      }
    });

    const [
      { data: services },
      { data: carMakes },
      { data: carModels },
      { data: fuelTypes },
      { data: brands },
      { data: locations },
      { data: inventory },
      { data: categories },
      { data: coupons },
      { data: reviews },
      { data: notifications },
      { data: servicePackages },
      { data: vehicles },
      { data: users },
      { data: appointments },
      { data: tasks },
      { data: config },
      { data: contactSubmissions },
      { data: technicians },
      { data: testimonials },
      { data: navigationItems },
      { data: workshops },
      { data: serviceRequests }
    ] = results;

    const settings = config?.find(c => c.key === 'settings')?.value || {};
    const uiSettings = config?.find(c => c.key === 'ui_settings')?.value || {};
    const apiKeys = config?.find(c => c.key === 'api_keys')?.value || {};

    return {
      missingTables,
      services: (services || []).map(toCamelCase),
      carMakes: (carMakes || []).map(toCamelCase),
      carModels: (carModels || []).map(toCamelCase),
      fuelTypes: (fuelTypes || []).map(toCamelCase),
      settings,
      appointments: (appointments || []).map(a => {
        const camel = toCamelCase(a);
        return { ...camel, service: a.service_title };
      }),
      tasks: (tasks || []).map(toCamelCase),
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
      servicePackages: (servicePackages || []).map(toCamelCase),
      vehicles: (vehicles || []).map(toCamelCase),
      contactSubmissions: (contactSubmissions || []).map(toCamelCase),
      technicians: (technicians || []).map(toCamelCase),
      testimonials: (testimonials || []).map(toCamelCase),
      navigationItems: (navigationItems || []).map(toCamelCase),
      workshops: (workshops || []).map(toCamelCase),
      serviceRequests: (serviceRequests || []).map(toCamelCase)
    };
  } catch (error) {
    console.error('Unexpected error in getInitialState:', error);
    return {
      missingTables: [],
      services: [],
      carMakes: [],
      carModels: [],
      fuelTypes: [],
      settings: {},
      appointments: [],
      tasks: [],
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
      servicePackages: [],
      vehicles: [],
      contactSubmissions: [],
    };
  }
}

export async function updateTable(table: string, data: any[]) {
  if (!supabase) return;
  try {
    // Determine the primary key for the table
    let primaryKey = 'id';
    if (['car_makes', 'car_models', 'fuel_types'].includes(table)) {
      primaryKey = 'name';
    }

    if (!data || data.length === 0) {
      // If data is empty, clear the table
      const { error: delError } = await supabase.from(table).delete().neq(primaryKey, '00000000-0000-0000-0000-000000000000');
      if (delError) console.error(`Error clearing ${table}:`, delError);
      return;
    }

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

    // Use upsert which handles both insert and update
    const { error } = await supabase.from(table).upsert(mappedData, { onConflict: primaryKey });
    if (error) console.error(`Error updating ${table}:`, error.message || error);

    // Handle deletions: Remove items from DB that are not in the new data list
    // Skip deletion for sensitive tables to prevent accidental data loss during partial state updates
    const sensitiveTables = ['users', 'appointments', 'tasks', 'notifications', 'reviews', 'contact_submissions', 'workshops'];
    if (!sensitiveTables.includes(table)) {
      const currentIds = data.map(item => item[primaryKey]).filter(Boolean);
      if (currentIds.length > 0) {
        const { error: delError } = await supabase
          .from(table)
          .delete()
          .not(primaryKey, 'in', `(${currentIds.map(id => `"${id}"`).join(',')})`);
        if (delError) console.error(`Error cleaning up ${table}:`, delError.message || delError);
      }
    }
  } catch (error: any) {
    console.error(`Unexpected error updating ${table}:`, error.message || error);
  }
}

export async function deleteFromTable(table: string, id: string) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) console.error(`Error deleting from ${table}:`, error.message || error);
  } catch (error: any) {
    console.error(`Unexpected error deleting from ${table}:`, error.message || error);
  }
}

export async function updateConfig(key: string, value: any) {
  if (!supabase) return;
  try {
    const { error } = await supabase.from('site_config').upsert({ key, value, updated_at: new Date() });
    if (error) console.error(`Error updating config ${key}:`, error.message || error);
  } catch (error: any) {
    console.error(`Unexpected error updating config ${key}:`, error.message || error);
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
    if (error) {
      console.error('Error adding appointment:', error.message || error);
    }
  } catch (error: any) {
    console.error('Unexpected error adding appointment:', error.message || error);
  }
}

export async function uploadImage(file: File) {
  if (!supabase) throw new Error("Supabase not configured");
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);

  return publicUrl;
}
