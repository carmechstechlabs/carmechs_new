import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { Services } from "@/pages/Services";
import { ServiceDetail } from "@/pages/ServiceDetail";
import { Booking } from "@/pages/Booking";
import { Login } from "@/pages/Login";
import { Signup } from "@/pages/Signup";
import { Profile } from "@/pages/Profile";
import Mechanics from "@/pages/Mechanics";
import MechanicProfile from "@/pages/MechanicProfile";
import ServiceRequest from "@/pages/ServiceRequest";
import { DynamicPage } from "@/pages/DynamicPage";
import { NotFound } from "@/pages/NotFound";
import { useData } from "./context/DataContext";
import { useEffect } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import MechanicTracker from "./components/MechanicTracker";
import MechanicDashboard from "@/pages/MechanicDashboard";
import ServiceBooking from "@/pages/ServiceBooking";
import { AnimatePresence } from "motion/react";
import { AuthProvider } from "./context/AuthContext";

// Admin
import { AdminLogin } from "@/pages/admin/AdminLogin";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Dashboard } from "@/pages/admin/Dashboard";
import { Services as AdminServices } from "@/pages/admin/Services";
import { Cars as AdminCars } from "@/pages/admin/Cars";
import { SettingsPage as AdminSettings } from "@/pages/admin/Settings";
import { Appointments as AdminAppointments } from "@/pages/admin/Appointments";
import { Customers as AdminCustomers } from "@/pages/admin/Customers";
import { Users as AdminUsers } from "@/pages/admin/Users";
import { UiSettingsPage as AdminUiSettings } from "@/pages/admin/UiSettings";
import { SeoSettingsPage as AdminSeoSettings } from "@/pages/admin/SeoSettings";
import { ApiKeysPage as AdminApiKeys } from "@/pages/admin/ApiKeys";
import { Brands as AdminBrands } from "@/pages/admin/Brands";
import { Locations as AdminLocations } from "@/pages/admin/Locations";
import { Inventory as AdminInventory } from "@/pages/admin/Inventory";
import { Categories as AdminCategories } from "@/pages/admin/Categories";
import { Coupons as AdminCoupons } from "@/pages/admin/Coupons";
import { Reviews as AdminReviews } from "@/pages/admin/Reviews";
import { Testimonials as AdminTestimonials } from "@/pages/admin/Testimonials";
import { ServicePackages as AdminServicePackages } from "@/pages/admin/ServicePackages";
import { Workshop as AdminWorkshop } from "@/pages/admin/Workshop";
import { VehicleConfig as AdminVehicleConfig } from "@/pages/admin/VehicleConfig";
import { SmartDiagnostic as AdminSmartDiagnostic } from "@/pages/admin/SmartDiagnostic";
import { TaskManager as AdminTasks } from "@/pages/admin/TaskManager";
import { Notifications as AdminNotifications } from "@/pages/admin/Notifications";
import NavigationManager from "@/pages/admin/NavigationManager";
import WorkshopPortal from "@/pages/WorkshopPortal";

import { motion } from "motion/react";

import { DevImages } from "@/pages/DevImages";

function AppRoutes() {
  const { isAdminLoggedIn, uiSettings } = useData();
  const location = useLocation();

  useEffect(() => {
    // Inject dynamic colors
    if (uiSettings.primaryColor) {
      document.documentElement.style.setProperty('--primary', uiSettings.primaryColor);
    }
    if (uiSettings.secondaryColor) {
      document.documentElement.style.setProperty('--secondary', uiSettings.secondaryColor);
    }
  }, [uiSettings.primaryColor, uiSettings.secondaryColor]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<DynamicPage />} />
            <Route path="p/:slug" element={<DynamicPage />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:id" element={<ServiceDetail />} />
            <Route path="book" element={<Booking />} />
            <Route path="contact" element={<DynamicPage slugOverride="contact" />} />
            <Route path="about" element={<DynamicPage slugOverride="about" />} />
            <Route path="privacy" element={<DynamicPage slugOverride="privacy" />} />
            <Route path="terms" element={<DynamicPage slugOverride="terms" />} />
            <Route path="faq" element={<DynamicPage slugOverride="faq" />} />
            <Route path="mechanics" element={<Mechanics />} />
            <Route path="mechanics/:id" element={<MechanicProfile />} />
            <Route path="request-service" element={<ServiceRequest />} />
            <Route path="profile" element={<Profile />} />
            <Route path="mechanic-dashboard" element={<MechanicDashboard />} />
            <Route path="track-mechanic/:technicianId/:requestId" element={<MechanicTracker />} />
            <Route path="service-booking" element={<ServiceBooking />} />
            <Route path="workshop-portal" element={<WorkshopPortal />} />
            <Route path="dev/images" element={<DevImages />} />
            <Route path="404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin Routes */}
          <Route path="/admin">
            <Route 
              index 
              element={isAdminLoggedIn ? <Navigate to="dashboard" replace /> : <AdminLogin />} 
            />
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="workshop" element={<AdminWorkshop />} />
              <Route path="tasks" element={<AdminTasks />} />
              <Route path="notifications" element={<AdminNotifications />} />
              <Route path="appointments" element={<AdminAppointments />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="service-packages" element={<AdminServicePackages />} />
              <Route path="brands" element={<AdminBrands />} />
              <Route path="locations" element={<AdminLocations />} />
              <Route path="navigation" element={<NavigationManager />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="cars" element={<AdminCars />} />
              <Route path="vehicle-config" element={<AdminVehicleConfig />} />
              <Route path="smart-diagnostic" element={<AdminSmartDiagnostic />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="ui-settings" element={<AdminUiSettings />} />
              <Route path="seo" element={<AdminSeoSettings />} />
              <Route path="api-keys" element={<AdminApiKeys />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function ThemeInjector() {
  const { uiSettings } = useData();
  
  useEffect(() => {
    if (uiSettings.primaryColor) {
      document.documentElement.style.setProperty('--primary', uiSettings.primaryColor);
    } else {
      document.documentElement.style.setProperty('--primary', '#e31e24');
    }

    if (uiSettings.secondaryColor) {
      document.documentElement.style.setProperty('--secondary', uiSettings.secondaryColor);
    } else {
      document.documentElement.style.setProperty('--secondary', '#1e293b');
    }

    if (uiSettings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [uiSettings.primaryColor, uiSettings.secondaryColor, uiSettings.darkMode]);

  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeInjector />
        <BrowserRouter>
          <Toaster position="top-center" richColors />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}
