import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { Home } from "@/pages/Home";
import { Services } from "@/pages/Services";
import { Booking } from "@/pages/Booking";
import { Login } from "@/pages/Login";
import { Contact } from "@/pages/Contact";
import { About } from "@/pages/About";
import { FAQ } from "@/pages/FAQ";
import { NotFound } from "@/pages/NotFound";
import { DataProvider } from "@/context/DataContext";

// Admin
import { AdminLogin } from "@/pages/admin/AdminLogin";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Dashboard } from "@/pages/admin/Dashboard";
import { Services as AdminServices } from "@/pages/admin/Services";
import { Cars as AdminCars } from "@/pages/admin/Cars";
import { SettingsPage as AdminSettings } from "@/pages/admin/Settings";

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Toaster position="top-center" richColors />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="book" element={<Booking />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="cars" element={<AdminCars />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}
