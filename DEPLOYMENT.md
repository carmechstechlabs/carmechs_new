# Deployment Guide: GoMechanic Clone

This guide provides step-by-step instructions for deploying the application to a cPanel-based hosting environment and configuring real-time features using Supabase and Firebase.

## Prerequisites

-   A cPanel hosting account with Node.js support (CloudLinux or similar).
-   A Supabase account (for database and real-time).
-   A Firebase account (for authentication).
-   Domain name pointed to your hosting.

---

## 1. Prepare the Application for Production

### Build the Frontend
Run the following command in your local development environment:
```bash
npm run build
```
This will generate a `dist` folder containing the optimized static assets.

### Prepare the Server
The application uses a custom Express server (`server.ts`). Ensure your `package.json` has the correct `start` script:
```json
"scripts": {
  "start": "node server.ts"
}
```

---

## 2. Supabase Setup (Database & Real-time)

1.  **Create a New Project**: Go to [Supabase](https://supabase.com/) and create a new project.
2.  **Database Schema**:
    -   Use the SQL Editor in Supabase to create your tables (`services`, `appointments`, `users`, `ui_settings`, `api_keys`, `brands`, `locations`, `inventory`, `categories`, `coupons`, `reviews`, `notifications`).
    -   Enable **Realtime** for the tables you want to sync instantly (e.g., `appointments`, `ui_settings`). Go to **Database > Replication** and toggle the "Realtime" switch for the desired tables.
3.  **Get Credentials**:
    -   Go to **Project Settings > API**.
    -   Copy the `Project URL` and `service_role` key (keep this secret).

---

## 3. Firebase Setup (Authentication)

1.  **Create a Project**: Go to [Firebase Console](https://console.firebase.google.com/).
2.  **Enable Authentication**:
    -   Go to **Build > Authentication**.
    -   Enable Email/Password and Google sign-in providers.
3.  **Get Config**:
    -   Go to **Project Settings**.
    -   Under "Your apps", add a Web App.
    -   Copy the `firebaseConfig` object.

---

## 4. cPanel Deployment

### Step 1: Upload Files
1.  Log in to cPanel.
2.  Open **File Manager**.
3.  Navigate to your domain's root directory (usually `public_html` or a specific folder).
4.  Upload all project files **except** `node_modules` and `.git`. You can zip your files locally and extract them in cPanel.

### Step 2: Create Node.js Application
1.  In cPanel, search for **Setup Node.js App**.
2.  Click **Create Application**.
3.  **Node.js version**: Select the latest stable version (e.g., 18.x or 20.x).
4.  **Application mode**: Select `production`.
5.  **Application root**: The folder where you uploaded your files.
6.  **Application URL**: Your domain.
7.  **Application startup file**: `server.ts` (or the compiled entry point if you prefer).
8.  Click **Create**.

### Step 3: Configure Environment Variables
In the Node.js App configuration page, add the following variables:
-   `NODE_ENV`: `production`
-   `SUPABASE_URL`: Your Supabase Project URL.
-   `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service_role key.
-   `GEMINI_API_KEY`: Your Gemini API key.
-   `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT`: For email notifications.
-   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc.: Your Firebase credentials.

### Step 4: Install Dependencies
1.  In the Node.js App configuration, click **Run JS Script** and select `npm install` (or use the terminal if available).
2.  Alternatively, use the **Terminal** in cPanel:
    ```bash
    cd /path/to/your/app
    npm install
    ```

### Step 5: Restart the App
Click **Restart** in the Node.js App configuration.

---

## 5. Ensuring Real-time Functionality

### Supabase Realtime
Ensure your backend (`server.ts`) is correctly listening to Supabase changes:
```typescript
const channel = supabase
  .channel('db-changes')
  .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
    io.emit('data-update', payload);
  })
  .subscribe();
```

### WebSocket (Socket.IO)
cPanel environments sometimes block WebSockets. Ensure your hosting provider supports WebSockets. If you encounter issues, you may need to:
1.  Use `polling` as a fallback in your Socket.IO client configuration.
2.  Check if your server is listening on the correct port (usually `3000` or the port assigned by cPanel).

---

## 6. Logo Customization
To make your logo prominent:
1.  Log in to the **Admin Dashboard**.
2.  Go to **System Settings**.
3.  Upload your logo image.
4.  The application will automatically scale the logo to a more prominent size in the Header, Footer, and Admin Sidebar.

---

## Troubleshooting
-   **502 Bad Gateway**: Usually means the Node.js app is not running. Check the logs in the "Setup Node.js App" section.
-   **Database Connection Error**: Verify your Supabase credentials in the environment variables.
-   **Real-time not working**: Ensure "Realtime" is enabled for the specific tables in the Supabase dashboard.
