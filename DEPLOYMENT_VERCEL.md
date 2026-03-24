# Vercel Deployment Guide for CarMechs

To deploy CarMechs to Vercel and ensure everything works correctly, follow these steps:

## 1. Environment Variables
In your Vercel Project Settings -> Environment Variables, add the following:

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Anon Key |
| `SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase Service Role Key |
| `GEMINI_API_KEY` | Your Gemini API Key |

> **Note:** The `VITE_` prefix is required for variables to be accessible in the frontend code.

## 2. Supabase Setup
Ensure you have run the `supabase_migration.sql` script in your Supabase SQL Editor. This creates the necessary tables and seeds the initial admin user.

### Storage Bucket Setup
1. In your Supabase Dashboard, go to **Storage**.
2. Create a new bucket named `uploads`.
3. Set the bucket to **Public** (or configure appropriate RLS policies for public read).

### Enable Public Read Access (Optional but Recommended for Vercel)
If you are using the frontend to fetch data directly (which we've enabled as a fallback), you may need to disable RLS or add policies for public read access on your tables:

```sql
-- Example: Allow anyone to read services
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON services FOR SELECT USING (true);

-- Repeat for car_makes, car_models, fuel_types, brands, locations, site_config
```

## 3. Why was it not working?
1. **Routing:** SPAs (Single Page Applications) like Vite need a `vercel.json` to redirect all web traffic to `index.html`. Without it, refreshing on `/admin` would cause a 404.
2. **Serverless vs Persistent:** Vercel is a serverless platform. It doesn't run the `server.ts` file as a persistent background process. We have updated the app to fetch data directly from Supabase in the frontend as a fallback when the WebSocket server is unavailable.

## 4. Deployment Command
Vercel will automatically detect the Vite project. Ensure the build command is `npm run build` and the output directory is `dist`.
