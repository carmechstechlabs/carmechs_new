# 🛠 cPanel Deployment Guide for CarMechs

Deploying a Node.js application on cPanel requires your hosting provider to support the **"Setup Node.js App"** feature (usually powered by Phusion Passenger).

---

## 📋 Prerequisites
1. **cPanel Access**: Ensure your hosting plan includes Node.js support.
2. **Supabase Account**: Your database must be set up as described in the main `README.md`.
3. **Domain/Subdomain**: Have a domain or subdomain ready in cPanel.

---

## 🚀 Step-by-Step Installation

### 1. Prepare Your Files
Before uploading, ensure you have built the frontend locally or are prepared to build it on the server.
- Run `npm run build` locally to generate the `dist` folder.
- Zip your project files **EXCEPT** for `node_modules`.

### 2. Upload to cPanel
1. Open **File Manager** in cPanel.
2. Navigate to your application directory (e.g., `/home/username/carmechs`).
3. Upload the zip file and extract it.

### 3. Create the Node.js Application
1. Search for **"Setup Node.js App"** in cPanel.
2. Click **Create Application**.
3. Fill in the details:
   - **Node.js version**: Select the latest available (v18+ recommended).
   - **Application mode**: Production.
   - **Application root**: The folder where you uploaded the files (e.g., `carmechs`).
   - **Application URL**: Select your domain.
   - **Application startup file**: `app.js` (This file is already provided in the root).
4. Click **Create**.

### 4. Startup Wrapper (`app.js`)
The provided `app.js` in the root directory acts as a bridge. It uses `tsx` to run the `server.ts` file directly on the server without needing a separate compilation step.

### 5. Install Dependencies
1. In the **Setup Node.js App** interface, scroll down to the **Configuration files** section.
2. Click **Run npm install**.
3. Wait for the process to complete.

### 6. Configure Environment Variables
In the same cPanel Node.js interface, find the **Environment variables** section and add:
- `SUPABASE_URL`: (Your Supabase URL)
- `SUPABASE_ANON_KEY`: (Your Supabase Anon Key)
- `SUPABASE_SERVICE_ROLE_KEY`: (Your Supabase Service Role Key)
- `NODE_ENV`: `production`
- `APP_URL`: `https://yourdomain.com`
- `PORT`: `3000` (cPanel usually handles the port mapping automatically)

### 7. Handling Routing (.htaccess)
cPanel uses Nginx or Apache as a reverse proxy. Ensure your `.htaccess` file in the application root (or public_html if that's where the app is mapped) looks like this:

```apache
# .htaccess
RewriteEngine On
RewriteRule ^$ http://127.0.0.1:3000/ [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
```
*Note: The port `3000` should match what your server is listening on.*

---

## 🛠 Troubleshooting cPanel
- **"Passenger Error"**: Check the **stderr.log** in your application root folder.
- **Port Conflicts**: If port 3000 is taken, cPanel might assign a random port via `process.env.PORT`. Our `server.ts` is already configured to use `process.env.PORT` if available.
- **Missing Modules**: Ensure `tsx` is listed in your `dependencies` (not just `devDependencies`) if you are using the `app.js` wrapper method.

---

## 💡 Pro Tip: Pre-Compiled Deployment
For the most stable cPanel experience:
1. Compile the project locally: `npm run build`.
2. Use a tool like `esbuild` or `tsc` to compile `server.ts` into a single `server.js` file.
3. Upload only `dist/`, `server.js`, and `package.json`.
4. Set `server.js` as the startup file in cPanel.
