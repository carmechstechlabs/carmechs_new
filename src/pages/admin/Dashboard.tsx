import React, { useState } from "react";
import { useData, Location, CarModel, PricingItem } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Wrench, Car, Users, Calendar, Clock, CheckCircle2, 
  XCircle, Shield, IndianRupee, TrendingUp, ArrowUpRight, 
  ArrowDownRight, Gift, Wallet, Activity, Zap, Cpu, 
  Globe, Database, Palette, Plus, MapPin, Package, Star, AlertCircle,
  Settings2, Key, Trash2, Edit2, Check, X
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { supabase } from "@/services/supabaseService";

export function Dashboard() {
  const { 
    services, carMakes, carModels, fuelTypes, appointments, 
    users, brands, settings, uiSettings, updateUiSettings, 
    locations, updateLocations, inventory, reviews, categories, coupons,
    vehicles, missingTables, updateServices, updateCarModels, updateFuelTypes,
    technicians, updateTechnicians
  } = useData();
  const [primaryColor, setPrimaryColor] = useState(uiSettings.primaryColor || "#e31e24");
  const [heroBgImage, setHeroBgImage] = useState(uiSettings.heroBgImage || "");
  const [newCityName, setNewCityName] = useState("");

  // New state for vehicle & service management
  const [selectedMakeForModel, setSelectedMakeForModel] = useState("");
  const [newModelName, setNewModelName] = useState("");
  const [newFuelName, setNewFuelName] = useState("");
  const [newFuelPrice, setNewFuelPrice] = useState(0);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceApplicability, setServiceApplicability] = useState({
    makes: [] as string[],
    models: [] as string[],
    fuels: [] as string[]
  });

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setPrimaryColor(newColor);
    updateUiSettings({ ...uiSettings, primaryColor: newColor });
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newImage = e.target.value;
    setHeroBgImage(newImage);
    updateUiSettings({ ...uiSettings, heroBgImage: newImage });
  };

  const handleAddCity = () => {
    if (!newCityName.trim()) return;
    const newLoc: Location = { 
      id: `loc_${Date.now()}`, 
      name: newCityName, 
      isPopular: false,
      address: "",
      city: newCityName,
      phone: "",
      email: "",
      latitude: 0,
      longitude: 0,
      workingHours: "09:00 AM - 07:00 PM",
      googleMapsUrl: ""
    };
    updateLocations([...locations, newLoc]);
    setNewCityName("");
    toast.success(`${newCityName} added to service areas`);
  };

  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled').length;

  const totalRevenue = appointments
    .filter(a => a.status === 'completed')
    .reduce((acc, curr) => {
      if (curr.amount) return acc + curr.amount;
      const service = services.find(s => s.id === curr.service);
      return acc + (service?.basePrice || 0);
    }, 0);

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  const revenueThisMonth = appointments
    .filter(a => {
      const date = new Date(a.createdAt);
      return a.status === 'completed' && date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    })
    .reduce((acc, curr) => {
      if (curr.amount) return acc + curr.amount;
      const service = services.find(s => s.id === curr.service);
      return acc + (service?.basePrice || 0);
    }, 0);

  const activeUsers = users.filter(u => u.verified).length || users.length;

  const stats = [
    { 
      title: "Total Appointments", 
      value: appointments.length, 
      description: "All time bookings",
      icon: Calendar, 
      color: "text-blue-400",
      glowColor: "shadow-blue-500/20",
      trend: "+12.5%",
      trendUp: true
    },
    { 
      title: "Total Vehicles", 
      value: vehicles.length, 
      description: "Registered cars",
      icon: Car, 
      color: "text-slate-400",
      glowColor: "shadow-slate-500/20",
      trend: "+8.3%",
      trendUp: true
    },
    { 
      title: "Monthly Revenue", 
      value: `₹${revenueThisMonth.toLocaleString()}`, 
      description: "Revenue this month",
      icon: TrendingUp, 
      color: "text-indigo-400",
      glowColor: "shadow-indigo-500/20",
      trend: "+15.2%",
      trendUp: true
    },
    { 
      title: "Total Revenue", 
      value: `₹${totalRevenue.toLocaleString()}`, 
      description: "From completed services",
      icon: IndianRupee, 
      color: "text-emerald-400",
      glowColor: "shadow-emerald-500/20",
      trend: "+18.3%",
      trendUp: true
    },
  ];

  const recentActivity = [
    ...appointments.map(a => ({
      id: `apt-${a.id}`,
      type: 'appointment',
      title: `New appointment: ${a.service}`,
      subtitle: `by ${a.name}`,
      date: new Date(a.createdAt),
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    })),
    ...users.slice(-3).map((u, i) => ({
      id: `user-${u.id}`,
      type: 'user',
      title: `New user registered`,
      subtitle: u.name,
      date: new Date(Date.now() - i * 86400000),
      icon: Users,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10'
    }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 6);

  const recentAppointments = [...appointments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-3 w-3 text-amber-400" />;
      case 'confirmed': return <CheckCircle2 className="h-3 w-3 text-blue-400" />;
      case 'completed': return <CheckCircle2 className="h-3 w-3 text-emerald-400" />;
      case 'cancelled': return <XCircle className="h-3 w-3 text-primary" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'confirmed': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'cancelled': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  const statusData = [
    { name: 'Pending', value: pendingAppointments, color: '#f59e0b' },
    { name: 'Confirmed', value: confirmedAppointments, color: '#3b82f6' },
    { name: 'Completed', value: completedAppointments, color: '#10b981' },
    { name: 'Cancelled', value: cancelledAppointments, color: 'var(--primary)' },
  ].filter(item => item.value > 0);

  const appointmentsByDate = appointments.reduce((acc: any, curr) => {
    const date = new Date(curr.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!acc[date]) acc[date] = 0;
    acc[date]++;
    return acc;
  }, {});

  const barChartData = Object.keys(appointmentsByDate).map(date => ({
    date,
    appointments: appointmentsByDate[date]
  })).slice(-7);

  const revenueByDate = appointments
    .filter(a => a.status === 'completed')
    .reduce((acc: any, curr) => {
      const date = new Date(curr.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const amount = curr.amount || 0;
      if (!acc[date]) acc[date] = 0;
      acc[date] += amount;
      return acc;
    }, {});

  const revenueChartData = Object.keys(revenueByDate).map(date => ({
    date,
    revenue: revenueByDate[date]
  })).slice(-7);

  const popularServicesData = appointments.reduce((acc: any, curr) => {
    const serviceName = curr.service;
    if (!acc[serviceName]) acc[serviceName] = 0;
    acc[serviceName]++;
    return acc;
  }, {});

  const popularServicesChartData = Object.keys(popularServicesData)
    .map(name => ({
      name,
      count: popularServicesData[name]
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const acquisitionData = [
    { name: 'Google Search', value: users.filter(u => u.source === 'google').length, color: '#3b82f6' },
    { name: 'Social Media', value: users.filter(u => u.source === 'social').length, color: '#ec4899' },
    { name: 'Referrals', value: users.filter(u => u.source === 'referral').length, color: '#10b981' },
    { name: 'Direct', value: users.filter(u => u.source === 'direct').length, color: '#94a3b8' },
    { name: 'Other', value: users.filter(u => !u.source || u.source === 'other').length, color: '#64748b' },
  ].filter(item => item.value > 0);

  if (acquisitionData.length === 0) {
    acquisitionData.push(
      { name: 'Google Search', value: 45, color: '#3b82f6' },
      { name: 'Social Media', value: 25, color: '#ec4899' },
      { name: 'Referrals', value: 20, color: '#10b981' },
      { name: 'Direct', value: 10, color: '#94a3b8' }
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Database Health Warning */}
      {missingTables.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-black text-foreground uppercase tracking-tight mb-1">Database Setup Required</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The following tables are missing in your Supabase project: 
                <span className="font-bold text-primary ml-1">{missingTables.join(', ')}</span>.
                Please run the SQL schema in your Supabase SQL Editor to enable all features.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-background border-primary/20 text-primary hover:bg-primary/5 rounded-xl font-black uppercase tracking-widest text-[9px]"
                  onClick={() => {
                    let sql = "-- Run this in your Supabase SQL Editor to fix missing tables or columns\n\n";
                    
                      if (missingTables.includes('appointments')) {
                        sql += `-- Fix for appointments table\n`;
                        sql += `CREATE TABLE IF NOT EXISTS appointments (\n`;
                        sql += `  id TEXT PRIMARY KEY,\n`;
                        sql += `  name TEXT NOT NULL,\n`;
                        sql += `  phone TEXT NOT NULL,\n`;
                        sql += `  email TEXT,\n`;
                        sql += `  service_title TEXT,\n`;
                        sql += `  service_id TEXT,\n`;
                        sql += `  make TEXT,\n`;
                        sql += `  model TEXT,\n`;
                        sql += `  fuel TEXT,\n`;
                        sql += `  date DATE,\n`;
                        sql += `  time TEXT,\n`;
                        sql += `  status TEXT DEFAULT 'pending',\n`;
                        sql += `  payment_method TEXT,\n`;
                        sql += `  payment_status TEXT DEFAULT 'pending',\n`;
                        sql += `  amount NUMERIC,\n`;
                        sql += `  technician_id TEXT,\n`;
                        sql += `  created_at TIMESTAMPTZ DEFAULT NOW(),\n`;
                        sql += `  updated_at TIMESTAMPTZ DEFAULT NOW()\n`;
                        sql += `);\n\n`;
                      }

                      if (missingTables.includes('vehicles')) {
                        sql += `-- Fix for vehicles table\n`;
                        sql += `CREATE TABLE IF NOT EXISTS vehicles (\n`;
                        sql += `  id TEXT PRIMARY KEY,\n`;
                        sql += `  user_id TEXT NOT NULL,\n`;
                        sql += `  make TEXT NOT NULL,\n`;
                        sql += `  model TEXT NOT NULL,\n`;
                        sql += `  year TEXT,\n`;
                        sql += `  fuel_type TEXT,\n`;
                        sql += `  license_plate TEXT,\n`;
                        sql += `  vin TEXT,\n`;
                        sql += `  last_service_date DATE,\n`;
                        sql += `  created_at TIMESTAMPTZ DEFAULT NOW()\n`;
                        sql += `);\n\n`;
                      }

                    if (missingTables.includes('service_packages')) {
                      sql += `-- Fix for service_packages table\n`;
                      sql += `CREATE TABLE IF NOT EXISTS service_packages (\n`;
                      sql += `  id TEXT PRIMARY KEY,\n`;
                      sql += `  title TEXT NOT NULL,\n`;
                      sql += `  description TEXT,\n`;
                      sql += `  service_ids TEXT[],\n`;
                      sql += `  discount_percentage NUMERIC DEFAULT 0,\n`;
                      sql += `  base_price NUMERIC DEFAULT 0,\n`;
                      sql += `  features TEXT[],\n`;
                      sql += `  is_popular BOOLEAN DEFAULT FALSE,\n`;
                      sql += `  image_url TEXT,\n`;
                      sql += `  created_at TIMESTAMPTZ DEFAULT NOW()\n`;
                      sql += `);\n\n`;
                    }

                    const otherTables = missingTables.filter(t => !['appointments', 'service_packages'].includes(t));
                    if (otherTables.length > 0) {
                      sql += `-- Other missing tables: ${otherTables.join(', ')}\n`;
                      sql += `-- Please refer to the supabase_schema.sql file in the project root for full definitions.\n`;
                    }
                    
                    navigator.clipboard.writeText(sql);
                    toast.success("SQL snippet copied to clipboard");
                  }}
                >
                  Copy SQL Snippet
                </Button>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-primary font-black uppercase tracking-widest text-[9px]"
                  asChild
                >
                  <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">Open Supabase Dashboard</a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <Activity className="h-3 w-3" /> System Overview
          </div>
          <h1 className="text-4xl font-black text-foreground uppercase tracking-tighter flex items-center gap-3">
            Management Dashboard
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-pulse">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Live Sync</span>
            </div>
          </h1>
          <p className="text-muted-foreground text-sm font-medium">Real-time operational monitoring and business analysis.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-3 bg-card rounded-2xl border border-border shadow-xl shadow-black/5">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-xs font-black text-foreground uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-card border-border text-muted-foreground hover:bg-accent rounded-2xl px-4 h-12 font-black uppercase tracking-widest text-[9px] shadow-sm" asChild>
              <a href="/admin/workshop"><Activity className="mr-2 h-3 w-3" /> Workshop</a>
            </Button>
            <Button variant="outline" className="bg-card border-border text-muted-foreground hover:bg-accent rounded-2xl px-4 h-12 font-black uppercase tracking-widest text-[9px] shadow-sm" asChild>
              <a href="/admin/appointments"><Calendar className="mr-2 h-3 w-3" /> Bookings</a>
            </Button>
            <Button className="bg-primary hover:opacity-90 text-white rounded-2xl px-6 h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 border-none" asChild>
              <a href="/admin/settings"><Settings2 className="mr-2 h-3 w-3" /> Config</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 bg-card border-border shadow-2xl shadow-black/5 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-black uppercase tracking-tighter">Quick Management Actions</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Rapid access to core system modules.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "New Service", icon: Wrench, path: "/admin/services", color: "bg-blue-500/10 text-blue-600" },
                { label: "Inventory", icon: Package, path: "/admin/inventory", color: "bg-amber-500/10 text-amber-600" },
                { label: "User Management", icon: Users, path: "/admin/users", color: "bg-indigo-500/10 text-indigo-600" },
                { label: "UI Designer", icon: Palette, path: "/admin/ui-settings", color: "bg-emerald-500/10 text-emerald-600" },
                { label: "SEO Config", icon: Globe, path: "/admin/seo", color: "bg-primary/10 text-primary" },
                { label: "API Keys", icon: Key, path: "/admin/api-keys", color: "bg-slate-500/10 text-slate-600" },
                { label: "Smart AI", icon: Zap, path: "/admin/smart-diagnostic", color: "bg-amber-500/10 text-amber-600" },
                { label: "Workshop", icon: Cpu, path: "/admin/workshop", color: "bg-purple-500/10 text-purple-600" },
                { label: "System Logs", icon: Activity, path: "/admin/dashboard", color: "bg-cyan-500/10 text-cyan-600" },
              ].map((action) => (
                <Link 
                  key={action.label} 
                  to={action.path}
                  className="flex flex-col items-center justify-center p-6 rounded-2xl bg-accent/50 border border-border hover:border-primary/30 hover:bg-accent transition-all group"
                >
                  <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110", action.color)}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-center">{action.label}</span>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 bg-slate-900 border-slate-800 shadow-2xl shadow-black/20 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          <CardHeader>
            <CardTitle className="text-xl font-black uppercase tracking-tighter">System Health</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Operational status monitoring.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {[
                { label: "Supabase Connection", status: supabase ? "Connected" : "Disconnected", active: !!supabase },
                { label: "Database Tables", status: missingTables.length === 0 ? "Synced" : `${missingTables.length} Missing`, active: missingTables.length === 0 },
                { label: "Socket.io Server", status: "Active", active: true },
                { label: "Mail Protocol", status: "Ready", active: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[9px] font-bold uppercase", item.active ? "text-emerald-400" : "text-primary")}>{item.status}</span>
                    <div className={cn("h-1.5 w-1.5 rounded-full", item.active ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-primary shadow-[0_0_8px_rgba(227,30,36,0.5)]")} />
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full h-12 bg-white/10 hover:bg-white/20 text-white border-none rounded-xl font-black uppercase tracking-widest text-[10px]">
              Run System Diagnostic
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-card border-border shadow-2xl shadow-black/5 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden">
              <div className={cn("absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors")} />
              <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn("p-3 rounded-2xl bg-accent border border-border shadow-inner group-hover:border-primary/50 transition-colors")}>
                    <stat.icon className={cn("h-6 w-6", stat.color.replace('text-blue-400', 'text-blue-600').replace('text-amber-400', 'text-amber-600').replace('text-indigo-400', 'text-indigo-600').replace('text-emerald-400', 'text-emerald-600'))} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest",
                    stat.trendUp ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
                  )}>
                    {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">{stat.title}</p>
                  <h3 className="text-3xl font-black text-foreground tracking-tighter mb-2">{stat.value}</h3>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-2xl shadow-black/5">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Revenue Analytics</span>
            </div>
            <CardTitle className="text-foreground uppercase tracking-tighter text-xl font-black">Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            {revenueChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'var(--foreground)', fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                <IndianRupee className="h-12 w-12 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No revenue data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-2xl shadow-black/5">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Marketing</span>
            </div>
            <CardTitle className="text-foreground uppercase tracking-tighter text-xl font-black">Acquisition Sources</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={acquisitionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {acquisitionData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'var(--foreground)', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value: any) => [`${value}%`, 'Share']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-2xl shadow-black/5">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Database className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Distribution</span>
            </div>
            <CardTitle className="text-foreground uppercase tracking-tighter text-xl font-black">Appointment Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {statusData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'var(--foreground)', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-2">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                <Database className="h-12 w-12 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-2xl shadow-black/5">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Wrench className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Service Analytics</span>
            </div>
            <CardTitle className="text-foreground uppercase tracking-tighter text-xl font-black">Popular Services</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            {popularServicesChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularServicesChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    width={120}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'var(--foreground)', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" fill={primaryColor} radius={[0, 8, 8, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                <Wrench className="h-12 w-12 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No service data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-2xl shadow-black/5">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Analytics</span>
            </div>
            <CardTitle className="text-foreground uppercase tracking-tighter text-xl font-black">Booking Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-[350px]">
            {barChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={barChartData}>
                  <defs>
                    <linearGradient id="colorApts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={primaryColor} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={primaryColor} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    allowDecimals={false}
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }}
                  />
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'var(--foreground)', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="appointments" stroke={primaryColor} strokeWidth={3} fillOpacity={1} fill="url(#colorApts)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
                <TrendingUp className="h-12 w-12 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No trend data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Workshop Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border shadow-2xl shadow-black/5 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Wrench className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Workshop Live</span>
              </div>
              <CardTitle className="text-foreground uppercase tracking-tighter text-xl font-black">Bay Utilization</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="bg-accent border-border text-muted-foreground hover:bg-accent/80 rounded-xl font-black uppercase tracking-widest text-[9px]" asChild>
              <a href="/admin/workshop">Manage Workshop</a>
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((bay) => (
                <div key={bay} className={cn(
                  "p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all group",
                  bay <= 6 ? "bg-blue-500/10 border-blue-500/20 text-blue-600" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                )}>
                  <div className="text-[8px] font-black uppercase tracking-widest opacity-60">Bay {bay}</div>
                  {bay <= 6 ? <Car className="h-5 w-5 animate-pulse" /> : <CheckCircle2 className="h-5 w-5" />}
                  <div className="text-[9px] font-black uppercase tracking-widest">{bay <= 6 ? "Occupied" : "Ready"}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-2xl shadow-black/5 overflow-hidden">
          <CardHeader className="border-b border-border pb-6">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-3 w-3 text-amber-600" />
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em]">Inventory Alerts</span>
            </div>
            <CardTitle className="text-foreground uppercase tracking-tighter text-xl font-black">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {inventory.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock').slice(0, 5).map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-accent transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-foreground uppercase tracking-tight">{item.name}</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">SKU: {item.sku}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                      item.status === 'out_of_stock' ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600"
                    )}>
                      {item.quantity} Left
                    </span>
                    <Button variant="link" className="h-auto p-0 text-[8px] font-black text-primary uppercase tracking-widest">Restock</Button>
                  </div>
                </div>
              ))}
              {inventory.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock').length === 0 && (
                <div className="p-12 text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500/20 mx-auto mb-2" />
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">All Stock Levels Normal</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border shadow-2xl shadow-black/5 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Live Feed</span>
              </div>
              <CardTitle className="text-foreground uppercase tracking-tighter text-xl font-black">Recent Bookings</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="bg-accent border-border text-muted-foreground hover:bg-accent/80 rounded-xl font-black uppercase tracking-widest text-[9px]" asChild>
              <a href="/admin/appointments">View All Bookings</a>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] bg-accent font-black">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-accent transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground group-hover:text-primary transition-colors">{apt.name}</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{apt.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{apt.service}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{new Date(apt.date).toLocaleDateString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                            getStatusColor(apt.status).replace('text-amber-400', 'text-amber-600').replace('bg-amber-400/10', 'bg-amber-500/10').replace('border-amber-400/20', 'border-amber-500/20').replace('text-blue-400', 'text-blue-600').replace('bg-blue-400/10', 'bg-blue-500/10').replace('border-blue-400/20', 'border-blue-500/20').replace('text-emerald-400', 'text-emerald-600').replace('bg-emerald-400/10', 'bg-emerald-500/10').replace('border-emerald-400/20', 'border-emerald-500/20').replace('text-primary', 'text-primary').replace('bg-primary/10', 'bg-primary/10').replace('border-primary/20', 'border-primary/20')
                          )}>
                            {getStatusIcon(apt.status)}
                            {apt.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No recent bookings found</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="bg-card border-border shadow-2xl shadow-black/5">
            <CardHeader className="border-b border-border pb-6">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Activity Log</span>
              </div>
              <CardTitle className="text-foreground uppercase tracking-tighter text-xl font-black">Recent Events</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-6">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 group">
                      <div className={cn("mt-1 h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border border-border group-hover:border-primary/50 transition-all shadow-sm", activity.bgColor.replace('bg-blue-500/10', 'bg-blue-500/10').replace('bg-indigo-500/10', 'bg-indigo-500/10'))}>
                        <activity.icon className={cn("h-4 w-4", activity.color.replace('text-blue-400', 'text-blue-600').replace('text-indigo-400', 'text-indigo-600'))} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-[11px] font-black text-foreground uppercase tracking-widest group-hover:text-primary transition-colors">{activity.title}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{activity.subtitle}</p>
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                            {activity.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-bold text-muted-foreground text-center py-10 uppercase tracking-widest">No events recorded</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-2xl shadow-black/5 overflow-hidden group">
            <CardHeader className="pb-4 border-b border-border">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Customer Voice</span>
              </div>
              <CardTitle className="text-foreground uppercase tracking-tighter text-xl font-black">Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="p-4 space-y-2 hover:bg-accent transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{review.userName}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={`star-${review.id}-${i}`} className={cn("h-2 w-2", i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/20")} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-2 italic">"{review.comment}"</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground/40">
                    <p className="text-[10px] font-black uppercase tracking-widest">No Reviews Yet</p>
                  </div>
                )}
              </div>
              <Button variant="ghost" className="w-full h-10 rounded-none border-t border-border text-[9px] font-black text-muted-foreground uppercase tracking-widest hover:bg-accent" asChild>
                <a href="/admin/reviews">View All Reviews</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-2xl shadow-black/5 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Palette className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Quick Config</span>
              </div>
              <CardTitle className="text-foreground uppercase tracking-tighter text-xl font-black">Layout & Regions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Primary Brand Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-border shadow-sm">
                    <input 
                      type="color" 
                      value={primaryColor} 
                      onChange={handleColorChange}
                      className="absolute inset-0 h-full w-full scale-150 cursor-pointer"
                    />
                  </div>
                  <Input 
                    value={primaryColor}
                    onChange={(e) => {
                      setPrimaryColor(e.target.value);
                      updateUiSettings({ ...uiSettings, primaryColor: e.target.value });
                    }}
                    className="h-12 bg-accent border-border text-foreground rounded-xl font-mono text-xs uppercase tracking-widest"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Hero Background Image</label>
                <div className="flex flex-col gap-2">
                  <Input 
                    placeholder="IMAGE URL..." 
                    value={heroBgImage}
                    onChange={handleHeroImageChange}
                    className="h-11 bg-accent border-border text-foreground rounded-xl font-black text-[10px] uppercase tracking-widest"
                  />
                  {heroBgImage && (
                    <div className="h-20 w-full rounded-xl overflow-hidden border border-border">
                      <img src={heroBgImage} alt="Hero Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-border">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Quick Add City</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input 
                      placeholder="CITY NAME..." 
                      value={newCityName}
                      onChange={(e) => setNewCityName(e.target.value)}
                      className="h-11 pl-9 bg-accent border-border text-foreground rounded-xl font-black text-[10px] uppercase tracking-widest"
                    />
                  </div>
                  <Button 
                    onClick={handleAddCity}
                    className="h-11 px-4 bg-primary hover:opacity-90 text-white rounded-xl shadow-lg shadow-primary/10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {locations.slice(0, 3).map(loc => (
                    <span key={loc.id} className="px-2 py-1 bg-accent border border-border rounded-lg text-[8px] font-black text-muted-foreground uppercase tracking-widest">
                      {loc.name}
                    </span>
                  ))}
                  {locations.length > 3 && (
                    <span className="px-2 py-1 text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">
                      +{locations.length - 3} More
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-2xl shadow-black/5 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-3 w-3 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">System Status</span>
              </div>
              <CardTitle className="text-foreground uppercase tracking-tighter text-xl font-black">Core Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-emerald-500/10 text-emerald-600 rounded-2xl border border-emerald-500/20 group-hover:border-emerald-500/40 transition-all">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black uppercase tracking-widest">Systems Nominal</span>
                  <span className="text-[9px] font-bold text-emerald-600/60 uppercase tracking-widest">All modules operational</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vehicle & Service Management Section */}
        <div className="lg:col-span-12 mt-8">
          <Card className="bg-card border-border shadow-2xl shadow-black/5 overflow-hidden">
            <CardHeader className="border-b border-border bg-accent/30">
              <div className="flex items-center gap-2 mb-1">
                <Database className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Master Data Control</span>
              </div>
              <CardTitle className="text-foreground uppercase tracking-tighter text-2xl font-black">Vehicle & Service Logic</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase tracking-widest">Manage vehicle applicability and master data.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="models" className="w-full">
                <TabsList className="w-full justify-start h-14 bg-accent/50 rounded-none border-b border-border px-6 gap-8">
                  <TabsTrigger value="models" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-14 px-0 font-black uppercase tracking-widest text-[10px]">Car Models</TabsTrigger>
                  <TabsTrigger value="fuels" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-14 px-0 font-black uppercase tracking-widest text-[10px]">Fuel Types</TabsTrigger>
                  <TabsTrigger value="applicability" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-14 px-0 font-black uppercase tracking-widest text-[10px]">Service Applicability</TabsTrigger>
                  <TabsTrigger value="technicians" className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-14 px-0 font-black uppercase tracking-widest text-[10px]">Technicians</TabsTrigger>
                </TabsList>

                <TabsContent value="models" className="p-8 m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Add New Model</h3>
                        <div className="space-y-4 bg-accent/30 p-6 rounded-2xl border border-border">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Select Manufacturer</label>
                            <select 
                              className="w-full h-11 bg-card border border-border rounded-xl px-4 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20"
                              value={selectedMakeForModel}
                              onChange={(e) => setSelectedMakeForModel(e.target.value)}
                            >
                              <option value="">Choose Make...</option>
                              {carMakes.map(make => (
                                <option key={make.id} value={make.name}>{make.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Model Name</label>
                            <Input 
                              placeholder="E.G. CIVIC, MUSTANG..." 
                              value={newModelName}
                              onChange={(e) => setNewModelName(e.target.value)}
                              className="h-11 bg-card border-border text-foreground rounded-xl font-black text-[10px] uppercase tracking-widest"
                            />
                          </div>
                          <Button 
                            onClick={() => {
                              if (!selectedMakeForModel || !newModelName.trim()) {
                                toast.error("Please select a make and enter a model name");
                                return;
                              }
                              const makeId = carMakes.find(m => m.name === selectedMakeForModel)?.id || `make_${Date.now()}`;
                              const newModel: CarModel = { 
                                id: `model_${Date.now()}`, 
                                makeId,
                                name: newModelName, 
                                make: selectedMakeForModel, 
                                price: 0,
                                year: new Date().getFullYear().toString()
                              };
                              updateCarModels([...carModels, newModel]);
                              setNewModelName("");
                              toast.success(`${newModelName} added to ${selectedMakeForModel}`);
                            }}
                            className="w-full h-11 bg-primary hover:opacity-90 text-white rounded-xl font-black uppercase tracking-widest text-[10px]"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add Model
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Existing Models</h3>
                      <div className="bg-accent/30 rounded-2xl border border-border overflow-hidden">
                        <div className="max-h-[300px] overflow-y-auto">
                          <table className="w-full text-left">
                            <thead className="bg-accent border-b border-border sticky top-0 z-10">
                              <tr>
                                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Make</th>
                                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Model</th>
                                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {carModels.map(model => (
                                <tr key={model.id} className="hover:bg-accent/50 transition-colors">
                                  <td className="px-6 py-3">
                                    <span className="text-[10px] font-black uppercase text-primary">{model.make}</span>
                                  </td>
                                  <td className="px-6 py-3">
                                    <span className="text-[10px] font-bold uppercase text-foreground">{model.name}</span>
                                  </td>
                                  <td className="px-6 py-3 text-right">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                                      onClick={() => {
                                        if (confirm(`Delete ${model.name}?`)) {
                                          updateCarModels(carModels.filter(m => m.id !== model.id));
                                          toast.success("Model removed");
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="fuels" className="p-8 m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Add Fuel Type</h3>
                        <div className="space-y-4 bg-accent/30 p-6 rounded-2xl border border-border">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Fuel Name</label>
                            <Input 
                              placeholder="E.G. PETROL, DIESEL, EV..." 
                              value={newFuelName}
                              onChange={(e) => setNewFuelName(e.target.value)}
                              className="h-11 bg-card border-border text-foreground rounded-xl font-black text-[10px] uppercase tracking-widest"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1">Price Adjustment (%)</label>
                            <Input 
                              type="number"
                              value={newFuelPrice}
                              onChange={(e) => setNewFuelPrice(Number(e.target.value))}
                              className="h-11 bg-card border-border text-foreground rounded-xl font-black text-[10px] uppercase tracking-widest"
                            />
                          </div>
                          <Button 
                            onClick={() => {
                              if (!newFuelName.trim()) return;
                              const newFuel: PricingItem = { id: `fuel_${Date.now()}`, name: newFuelName, price: newFuelPrice };
                              updateFuelTypes([...fuelTypes, newFuel]);
                              setNewFuelName("");
                              setNewFuelPrice(0);
                              toast.success(`${newFuelName} added`);
                            }}
                            className="w-full h-11 bg-primary hover:opacity-90 text-white rounded-xl font-black uppercase tracking-widest text-[10px]"
                          >
                            <Plus className="mr-2 h-4 w-4" /> Add Fuel Type
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Active Fuel Types</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {fuelTypes.map(fuel => (
                          <div key={fuel.id} className="flex items-center justify-between p-4 bg-accent/30 border border-border rounded-2xl hover:border-primary/30 transition-all group">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Zap className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-foreground">{fuel.name}</p>
                                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Adjustment: {fuel.price}%</p>
                              </div>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                if (confirm(`Delete ${fuel.name}?`)) {
                                  updateFuelTypes(fuelTypes.filter(f => f.id !== fuel.id));
                                  toast.success("Fuel type removed");
                                }
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="applicability" className="p-8 m-0">
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Service Applicability Matrix</h3>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Define which vehicles can book specific services.</p>
                      </div>
                      <select 
                        className="h-11 bg-accent border border-border rounded-xl px-4 text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary/20 min-w-[250px]"
                        value={editingServiceId || ""}
                        onChange={(e) => {
                          const id = e.target.value;
                          setEditingServiceId(id);
                          const service = services.find(s => s.id === id);
                          if (service) {
                            setServiceApplicability({
                              makes: service.applicableMakes || [],
                              models: service.applicableModels || [],
                              fuels: service.applicableFuelTypes || []
                            });
                          }
                        }}
                      >
                        <option value="">Select Service to Configure...</option>
                        {services.map(s => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </select>
                    </div>

                    {editingServiceId ? (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Makes */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Applicable Makes</label>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-[8px] font-black uppercase tracking-widest"
                              onClick={() => setServiceApplicability(prev => ({ ...prev, makes: carMakes.map(m => m.name) }))}
                            >
                              Select All
                            </Button>
                          </div>
                          <div className="bg-accent/30 rounded-2xl border border-border p-4 max-h-[300px] overflow-y-auto space-y-2">
                            {carMakes.map(make => (
                              <label key={make.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-colors cursor-pointer group">
                                <input 
                                  type="checkbox" 
                                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                                  checked={serviceApplicability.makes.includes(make.name)}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setServiceApplicability(prev => ({
                                      ...prev,
                                      makes: checked 
                                        ? [...prev.makes, make.name]
                                        : prev.makes.filter(m => m !== make.name)
                                    }));
                                  }}
                                />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{make.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Models */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Applicable Models</label>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-[8px] font-black uppercase tracking-widest"
                              onClick={() => setServiceApplicability(prev => ({ ...prev, models: carModels.map(m => m.name) }))}
                            >
                              Select All
                            </Button>
                          </div>
                          <div className="bg-accent/30 rounded-2xl border border-border p-4 max-h-[300px] overflow-y-auto space-y-2">
                            {carModels.map(model => (
                              <label key={model.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-colors cursor-pointer group">
                                <input 
                                  type="checkbox" 
                                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                                  checked={serviceApplicability.models.includes(model.name)}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setServiceApplicability(prev => ({
                                      ...prev,
                                      models: checked 
                                        ? [...prev.models, model.name]
                                        : prev.models.filter(m => m !== model.name)
                                    }));
                                  }}
                                />
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{model.name}</span>
                                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{model.make}</span>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Fuel Types */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Applicable Fuel Types</label>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-[8px] font-black uppercase tracking-widest"
                              onClick={() => setServiceApplicability(prev => ({ ...prev, fuels: fuelTypes.map(f => f.name) }))}
                            >
                              Select All
                            </Button>
                          </div>
                          <div className="bg-accent/30 rounded-2xl border border-border p-4 max-h-[300px] overflow-y-auto space-y-2">
                            {fuelTypes.map(fuel => (
                              <label key={fuel.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-colors cursor-pointer group">
                                <input 
                                  type="checkbox" 
                                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
                                  checked={serviceApplicability.fuels.includes(fuel.name)}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    setServiceApplicability(prev => ({
                                      ...prev,
                                      fuels: checked 
                                        ? [...prev.fuels, fuel.name]
                                        : prev.fuels.filter(f => f !== fuel.name)
                                    }));
                                  }}
                                />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">{fuel.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="lg:col-span-3 pt-6 border-t border-border flex justify-end gap-4">
                          <Button 
                            variant="outline" 
                            onClick={() => setEditingServiceId(null)}
                            className="h-11 px-8 rounded-xl font-black uppercase tracking-widest text-[10px]"
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={() => {
                              const updatedServices = services.map(s => {
                                if (s.id === editingServiceId) {
                                  return {
                                    ...s,
                                    applicableMakes: serviceApplicability.makes,
                                    applicableModels: serviceApplicability.models,
                                    applicableFuelTypes: serviceApplicability.fuels
                                  };
                                }
                                return s;
                              });
                              updateServices(updatedServices);
                              toast.success("Service applicability updated");
                              setEditingServiceId(null);
                            }}
                            className="h-11 px-12 bg-primary hover:opacity-90 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
                          >
                            Save Configuration
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-3xl bg-accent/10">
                        <Wrench className="h-12 w-12 text-muted-foreground/20 mb-4" />
                        <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Select a service above to configure its vehicle applicability</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="technicians" className="p-8 m-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {technicians.map((tech) => (
                      <div key={tech.id} className="p-6 rounded-2xl border border-border bg-accent/30 flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black">
                            {tech.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-black tracking-tight">{tech.name}</h4>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{tech.specialty}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                            tech.status === 'available' ? "bg-emerald-500/10 text-emerald-600" :
                            tech.status === 'busy' ? "bg-amber-500/10 text-amber-600" :
                            "bg-rose-500/10 text-rose-600"
                          )}>
                            {tech.status}
                          </span>
                          
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant={tech.status === 'available' ? "default" : "outline"}
                              className="h-8 px-2 text-[8px] font-black uppercase"
                              onClick={() => {
                                const updated = technicians.map(t => t.id === tech.id ? { ...t, status: 'available' as const } : t);
                                updateTechnicians(updated);
                                toast.success(`${tech.name} is now Available`);
                              }}
                            >
                              Avail
                            </Button>
                            <Button 
                              size="sm" 
                              variant={tech.status === 'busy' ? "default" : "outline"}
                              className="h-8 px-2 text-[8px] font-black uppercase"
                              onClick={() => {
                                const updated = technicians.map(t => t.id === tech.id ? { ...t, status: 'busy' as const } : t);
                                updateTechnicians(updated);
                                toast.success(`${tech.name} is now Busy`);
                              }}
                            >
                              Busy
                            </Button>
                            <Button 
                              size="sm" 
                              variant={tech.status === 'off' ? "default" : "outline"}
                              className="h-8 px-2 text-[8px] font-black uppercase"
                              onClick={() => {
                                const updated = technicians.map(t => t.id === tech.id ? { ...t, status: 'off' as const } : t);
                                updateTechnicians(updated);
                                toast.success(`${tech.name} is now Offline`);
                              }}
                            >
                              Off
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
