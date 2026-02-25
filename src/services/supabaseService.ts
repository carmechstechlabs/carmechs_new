import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getInitialState() {
  const { data: services } = await supabase.from('services').select('*');
  const { data: carMakes } = await supabase.from('car_makes').select('*');
  const { data: carModels } = await supabase.from('car_models').select('*');
  const { data: fuelTypes } = await supabase.from('fuel_types').select('*');
  const { data: brands } = await supabase.from('brands').select('*');
  const { data: users } = await supabase.from('users').select('*');
  const { data: appointments } = await supabase.from('appointments').select('*').order('created_at', { ascending: false });
  
  const { data: config } = await supabase.from('site_config').select('*');
  
  const settings = config?.find(c => c.key === 'settings')?.value || {};
  const uiSettings = config?.find(c => c.key === 'ui_settings')?.value || {};
  const apiKeys = config?.find(c => c.key === 'api_keys')?.value || {};

  return {
    services: services || [],
    carMakes: carMakes || [],
    carModels: carModels || [],
    fuelTypes: fuelTypes || [],
    settings,
    appointments: appointments || [],
    users: users || [],
    uiSettings,
    apiKeys,
    brands: brands || [],
  };
}

export async function updateTable(table: string, data: any[]) {
  // For simplicity, we'll clear and re-insert for some tables, 
  // or just upsert if they have IDs.
  // This is a naive implementation for the demo.
  if (table === 'services' || table === 'brands' || table === 'users') {
    const { error } = await supabase.from(table).upsert(data);
    if (error) console.error(`Error updating ${table}:`, error);
  } else {
    // For others, we might need more specific logic
    const { error } = await supabase.from(table).upsert(data);
    if (error) console.error(`Error updating ${table}:`, error);
  }
}

export async function updateConfig(key: string, value: any) {
  const { error } = await supabase.from('site_config').upsert({ key, value, updated_at: new Date() });
  if (error) console.error(`Error updating config ${key}:`, error);
}

export async function addAppointment(appointment: any) {
  const { error } = await supabase.from('appointments').insert(appointment);
  if (error) console.error('Error adding appointment:', error);
}
