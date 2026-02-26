# CarMechs - Premium Car Service Platform

CarMechs is a full-stack web application designed for premium car service workshops. It features a real-time booking system, a comprehensive admin dashboard for managing services, brands, and UI settings, and a persistent database integration with Supabase.

---

## 🚀 Features

- **Real-time Booking**: Customers can book services with instant confirmation.
- **Dynamic UI Management**: Admin can change hero sections, "Why Choose Us" content, and theme colors without touching code.
- **Service Management**: Add, edit, or remove car services and pricing.
- **Brand Management**: Manage the list of car brands supported by the workshop.
- **User Management**: Track users, roles (Admin/Viewer/User), and referral systems.
- **Email Notifications**: Automated booking confirmation emails via SMTP.
- **Real-time Updates**: Changes in the admin panel reflect instantly on the frontend using WebSockets.
- **Persistent Storage**: All data is securely stored in Supabase.

---

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend**: Node.js, Express.
- **Real-time**: Socket.io.
- **Database**: Supabase (PostgreSQL).
- **Communication**: Nodemailer (SMTP).

---

## 📋 Prerequisites

Before deployment, ensure you have:
- **Node.js** (v18 or higher)
- **NPM** or **Yarn**
- A **Supabase** account (Free tier is sufficient)
- An **SMTP Server** (e.g., Gmail, SendGrid, or Ethereal for testing)

---

## 🗄 Database Setup (Supabase)

1. **Create a Project**: Log in to [Supabase](https://supabase.com) and create a new project.
2. **Run Migrations**:
   - Open the **SQL Editor** in your Supabase dashboard.
   - Copy the content of the `supabase_migration.sql` file located in the root of this project.
   - Paste it into the SQL Editor and click **Run**. This will create all necessary tables and enable Realtime functionality.
3. **Get API Keys**:
   - Go to **Project Settings > API**.
   - Note down the `Project URL`, `anon public` key, and `service_role` secret key.

---

## 💻 Local Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Configure Environment Variables**:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   GEMINI_API_KEY=your_gemini_key
   APP_URL=http://localhost:3000
   
   # Supabase
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # SMTP (Optional for emails)
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_email@example.com
   SMTP_PASS=your_password
   ```
3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

---

## 🌐 Deployment Guide (Live Server)

### Option 1: Using a PaaS (Railway, Render, Fly.io) - Recommended
These platforms are the easiest for full-stack Node.js apps.

1. **Connect your Repository**: Push your code to GitHub/GitLab.
2. **Create a New Web Service**: Select your repository.
3. **Configure Build & Start Commands**:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. **Set Environment Variables**: Add all variables from your `.env` file to the platform's dashboard.
5. **Port**: Ensure the platform is configured to listen on port `3000`.

### Option 2: Using a VPS (DigitalOcean, AWS, Linode)
1. **Setup Node.js**: Install Node.js and NPM on your server.
2. **Clone the App**: `git clone <your-repo-url>`
3. **Install & Build**:
   ```bash
   npm install
   npm run build
   ```
4. **Use a Process Manager (PM2)**:
   ```bash
   npm install -g pm2
   pm2 start server.ts --interpreter tsx --name "carmechs"
   ```
5. **Setup Reverse Proxy (Nginx)**:
   Configure Nginx to forward traffic from port 80/443 to `http://localhost:3000`.

---

## 🔑 Admin Panel Access

- **URL**: `http://your-domain.com/admin`
- **Default Credentials**: 
  - The system uses a session-based login for the demo. 
  - In the `DataContext.tsx`, you can find the `loginAdmin` function. 
  - For a production environment, it is recommended to integrate **Supabase Auth** for secure admin access.

---

## 📝 Maintenance & Updates

- **Updating UI**: Use the **UI Settings** tab in the Admin Panel to change Hero images, text, and colors.
- **Managing Services**: Use the **Services** tab to update pricing and service details.
- **Database Backups**: Supabase performs automatic backups, but you can also export data via the dashboard.

---

## 📄 License

This project is licensed under the MIT License.
