
export const supabase = null;

export const toSnakeCase = (obj: any) => {
  if (!obj) return obj;
  const newObj: any = {};
  for (const key in obj) {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    newObj[snakeKey] = obj[key];
  }
  return newObj;
};

export async function getInitialState() {
  return null;
}

export async function updateTable(table: string, data: any[]) {
  return;
}

export async function deleteFromTable(table: string, id: string) {
  return;
}

export async function updateConfig(key: string, value: any) {
  return;
}

export async function addAppointment(appointment: any) {
  return;
}

export async function uploadImage(file: File) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}
