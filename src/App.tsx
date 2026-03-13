import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { Services } from "@/pages/Services";
import { ServiceDetail } from "@/pages/ServiceDetail";
import { Booking } from "@/pages/Booking";
import { Login } from "@/pages/Login";
import { Profile } from "@/pages/Profile";
import { DynamicPage } from "@/pages/DynamicPage";
import { NotFound } from "@/pages/NotFound";
import { DataProvider, useData } from "@/context/DataContext";
import { useEffect } from "react";

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
import { TaskManager as AdminTasks } from "@/pages/admin/TaskManager";

function AppRoutes() {
  const { isAdminLoggedIn } = useData();

  return (
    <Routes>
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
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route path="/login" element={<Login />} />

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
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="service-packages" element={<AdminServicePackages />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="locations" element={<AdminLocations />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="cars" element={<AdminCars />} />
          <Route path="vehicle-config" element={<AdminVehicleConfig />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="ui-settings" element={<AdminUiSettings />} />
          <Route path="seo" element={<AdminSeoSettings />} />
          <Route path="api-keys" element={<AdminApiKeys />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Route>
    </Routes>
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
  }, [uiSettings.primaryColor]);

  return null;
}

export default function App() {
  return (
    <DataProvider>
      <ThemeInjector />
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <AppRoutes />
      </BrowserRouter>
    </DataProvider>
  );
}
