import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { Services } from "@/pages/Services";
import { Booking } from "@/pages/Booking";
import { Login } from "@/pages/Login";
import { Contact } from "@/pages/Contact";
import { About } from "@/pages/About";
import { FAQ } from "@/pages/FAQ";
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
import { ApiKeysPage as AdminApiKeys } from "@/pages/admin/ApiKeys";
import { Brands as AdminBrands } from "@/pages/admin/Brands";
import { Locations as AdminLocations } from "@/pages/admin/Locations";
import { Inventory as AdminInventory } from "@/pages/admin/Inventory";
import { Categories as AdminCategories } from "@/pages/admin/Categories";
import { Coupons as AdminCoupons } from "@/pages/admin/Coupons";
import { Reviews as AdminReviews } from "@/pages/admin/Reviews";

function AppRoutes() {
  const { isAdminLoggedIn } = useData();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<DynamicPage />} />
        <Route path="p/:slug" element={<DynamicPage />} />
        <Route path="services" element={<Services />} />
        <Route path="book" element={<Booking />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="faq" element={<FAQ />} />
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
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="brands" element={<AdminBrands />} />
          <Route path="locations" element={<AdminLocations />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="coupons" element={<AdminCoupons />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="cars" element={<AdminCars />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="ui-settings" element={<AdminUiSettings />} />
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
