import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Wrench, Car, Users, Calendar, Clock, CheckCircle2, 
  XCircle, Shield, IndianRupee, TrendingUp, ArrowUpRight, 
  ArrowDownRight, Gift, Wallet, Activity, Zap, Cpu, 
  Globe, Database, Palette, Plus, MapPin, Package, Star, AlertCircle
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area } from "recharts";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { toast } from "sonner";

export function Dashboard() {
  const { 
    services, carMakes, carModels, fuelTypes, appointments, 
    users, brands, settings, uiSettings, updateUiSettings, 
    locations, updateLocations, inventory, reviews, categories, coupons,
    vehicles, missingTables
  } = useData();
  const [primaryColor, setPrimaryColor] = useState(uiSettings.primaryColor || "#e31e24");
  const [heroBgImage, setHeroBgImage] = useState(uiSettings.heroBgImage || "");
  const [newCityName, setNewCityName] = useState("");

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
    const newLoc = { id: `loc_${Date.now()}`, name: newCityName, isPopular: false };
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
      title: "Active Users", 
      value: activeUsers, 
      description: "Verified customers",
      icon: Users, 
      color: "text-indigo-400",
      glowColor: "shadow-indigo-500/20",
      trend: "+4.2%",
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
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">Database Setup Required</h3>
              <p className="text-sm text-slate-500 mb-4">
                The following tables are missing in your Supabase project: 
                <span className="font-bold text-primary ml-1">{missingTables.join(', ')}</span>.
                Please run the SQL schema in your Supabase SQL Editor to enable all features.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white border-primary/20 text-primary hover:bg-primary/5 rounded-xl font-black uppercase tracking-widest text-[9px]"
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
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
            Management Dashboard
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-full animate-pulse">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Live Sync</span>
            </div>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Real-time operational monitoring and business analysis.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="bg-white border-slate-100 text-slate-500 hover:bg-slate-50 rounded-2xl px-4 h-12 font-black uppercase tracking-widest text-[9px] shadow-sm" asChild>
              <a href="/admin/services"><Wrench className="mr-2 h-3 w-3" /> Services</a>
            </Button>
            <Button variant="outline" className="bg-white border-slate-100 text-slate-500 hover:bg-slate-50 rounded-2xl px-4 h-12 font-black uppercase tracking-widest text-[9px] shadow-sm" asChild>
              <a href="/admin/workshop"><Wrench className="mr-2 h-3 w-3" /> Workshop</a>
            </Button>
            <Button variant="outline" className="bg-white border-slate-100 text-slate-500 hover:bg-slate-50 rounded-2xl px-4 h-12 font-black uppercase tracking-widest text-[9px] shadow-sm" asChild>
              <a href="/admin/inventory"><Package className="mr-2 h-3 w-3" /> Inventory</a>
            </Button>
            <Button className="bg-primary hover:opacity-90 text-white rounded-2xl px-6 h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 border-none">
              <TrendingUp className="mr-2 h-3 w-3" /> Reports
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-200/50 hover:border-primary/30 transition-all duration-500 group relative overflow-hidden">
              <div className={cn("absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors")} />
              <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn("p-3 rounded-2xl bg-slate-50 border border-slate-100 shadow-inner group-hover:border-primary/50 transition-colors")}>
                    <stat.icon className={cn("h-6 w-6", stat.color.replace('text-blue-400', 'text-blue-600').replace('text-amber-400', 'text-amber-600').replace('text-indigo-400', 'text-indigo-600').replace('text-emerald-400', 'text-emerald-600'))} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest",
                    stat.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-primary/10 text-primary"
                  )}>
                    {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.trend}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.title}</p>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{stat.value}</h3>
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-primary" />
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-200/50">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Revenue Analytics</span>
            </div>
            <CardTitle className="text-slate-900 uppercase tracking-tighter text-xl font-black">Revenue Trends</CardTitle>
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
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
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                <IndianRupee className="h-12 w-12 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No revenue data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-200/50">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Marketing</span>
            </div>
            <CardTitle className="text-slate-900 uppercase tracking-tighter text-xl font-black">Acquisition Sources</CardTitle>
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
                  {acquisitionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value: any) => [`${value}%`, 'Share']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-200/50">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Database className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Distribution</span>
            </div>
            <CardTitle className="text-slate-900 uppercase tracking-tighter text-xl font-black">Appointment Status</CardTitle>
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
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36}
                    formatter={(value) => <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                <Database className="h-12 w-12 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-200/50">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3 w-3 text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Analytics</span>
            </div>
            <CardTitle className="text-slate-900 uppercase tracking-tighter text-xl font-black">Booking Trends</CardTitle>
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
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
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
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="appointments" stroke={primaryColor} strokeWidth={3} fillOpacity={1} fill="url(#colorApts)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                <TrendingUp className="h-12 w-12 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No trend data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Workshop Status Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Wrench className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Workshop Live</span>
              </div>
              <CardTitle className="text-slate-900 uppercase tracking-tighter text-xl font-black">Bay Utilization</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100 rounded-xl font-black uppercase tracking-widest text-[9px]" asChild>
              <a href="/admin/workshop">Manage Workshop</a>
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((bay) => (
                <div key={bay} className={cn(
                  "p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all group",
                  bay <= 6 ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-emerald-50 border-emerald-100 text-emerald-600"
                )}>
                  <div className="text-[8px] font-black uppercase tracking-widest opacity-60">Bay {bay}</div>
                  {bay <= 6 ? <Car className="h-5 w-5 animate-pulse" /> : <CheckCircle2 className="h-5 w-5" />}
                  <div className="text-[9px] font-black uppercase tracking-widest">{bay <= 6 ? "Occupied" : "Ready"}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <CardHeader className="border-b border-slate-50 pb-6">
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-3 w-3 text-amber-600" />
              <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.3em]">Inventory Alerts</span>
            </div>
            <CardTitle className="text-slate-900 uppercase tracking-tighter text-xl font-black">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {inventory.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock').slice(0, 5).map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.name}</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">SKU: {item.sku}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={cn(
                      "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                      item.status === 'out_of_stock' ? "bg-primary/5 text-primary" : "bg-amber-50 text-amber-600"
                    )}>
                      {item.quantity} Left
                    </span>
                    <Button variant="link" className="h-auto p-0 text-[8px] font-black text-primary uppercase tracking-widest">Restock</Button>
                  </div>
                </div>
              ))}
              {inventory.filter(i => i.status === 'low_stock' || i.status === 'out_of_stock').length === 0 && (
                <div className="p-12 text-center">
                  <CheckCircle2 className="h-8 w-8 text-emerald-200 mx-auto mb-2" />
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">All Stock Levels Normal</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Live Feed</span>
              </div>
              <CardTitle className="text-slate-900 uppercase tracking-tighter text-xl font-black">Recent Bookings</CardTitle>
            </div>
            <Button variant="outline" size="sm" className="bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100 rounded-xl font-black uppercase tracking-widest text-[9px]" asChild>
              <a href="/admin/appointments">View All Bookings</a>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {recentAppointments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] text-slate-400 uppercase tracking-[0.2em] bg-slate-50 font-black">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">{apt.name}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">{apt.phone}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{apt.service}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{new Date(apt.date).toLocaleDateString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                            getStatusColor(apt.status).replace('text-amber-400', 'text-amber-600').replace('bg-amber-400/10', 'bg-amber-50').replace('border-amber-400/20', 'border-amber-100').replace('text-blue-400', 'text-blue-600').replace('bg-blue-400/10', 'bg-blue-50').replace('border-blue-400/20', 'border-blue-100').replace('text-emerald-400', 'text-emerald-600').replace('bg-emerald-400/10', 'bg-emerald-50').replace('border-emerald-400/20', 'border-emerald-100').replace('text-primary', 'text-primary').replace('bg-primary/10', 'bg-primary/5').replace('border-primary/20', 'border-primary/10')
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
                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No recent bookings found</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-200/50">
            <CardHeader className="border-b border-slate-50 pb-6">
              <div className="flex items-center gap-2 mb-1">
                <Cpu className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Activity Log</span>
              </div>
              <CardTitle className="text-slate-900 uppercase tracking-tighter text-xl font-black">Recent Events</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-6">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 group">
                      <div className={cn("mt-1 h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:border-primary/50 transition-all shadow-sm", activity.bgColor.replace('bg-blue-500/10', 'bg-blue-50').replace('bg-indigo-500/10', 'bg-indigo-50'))}>
                        <activity.icon className={cn("h-4 w-4", activity.color.replace('text-blue-400', 'text-blue-600').replace('text-indigo-400', 'text-indigo-600'))} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest group-hover:text-primary transition-colors">{activity.title}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activity.subtitle}</p>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                            {activity.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-bold text-slate-300 text-center py-10 uppercase tracking-widest">No events recorded</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden group">
            <CardHeader className="pb-4 border-b border-slate-50">
              <div className="flex items-center gap-2 mb-1">
                <Star className="h-3 w-3 text-yellow-500" />
                <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Customer Voice</span>
              </div>
              <CardTitle className="text-slate-900 uppercase tracking-tighter text-xl font-black">Recent Reviews</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="p-4 space-y-2 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{review.userName}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("h-2 w-2", i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200")} />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 line-clamp-2 italic">"{review.comment}"</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="p-8 text-center text-slate-300">
                    <p className="text-[10px] font-black uppercase tracking-widest">No Reviews Yet</p>
                  </div>
                )}
              </div>
              <Button variant="ghost" className="w-full h-10 rounded-none border-t border-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50" asChild>
                <a href="/admin/reviews">View All Reviews</a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Palette className="h-3 w-3 text-primary" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Quick Config</span>
              </div>
              <CardTitle className="text-slate-900 uppercase tracking-tighter text-xl font-black">Layout & Regions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Primary Brand Color</label>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-slate-100 shadow-sm">
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
                    className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-mono text-xs uppercase tracking-widest"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Hero Background Image</label>
                <div className="flex flex-col gap-2">
                  <Input 
                    placeholder="IMAGE URL..." 
                    value={heroBgImage}
                    onChange={handleHeroImageChange}
                    className="h-11 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest"
                  />
                  {heroBgImage && (
                    <div className="h-20 w-full rounded-xl overflow-hidden border border-slate-100">
                      <img src={heroBgImage} alt="Hero Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Quick Add City</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input 
                      placeholder="CITY NAME..." 
                      value={newCityName}
                      onChange={(e) => setNewCityName(e.target.value)}
                      className="h-11 pl-9 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest"
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
                    <span key={loc.id} className="px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      {loc.name}
                    </span>
                  ))}
                  {locations.length > 3 && (
                    <span className="px-2 py-1 text-[8px] font-black text-slate-300 uppercase tracking-widest">
                      +{locations.length - 3} More
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-3 w-3 text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.3em]">System Status</span>
              </div>
              <CardTitle className="text-slate-900 uppercase tracking-tighter text-xl font-black">Core Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 group-hover:border-emerald-200 transition-all">
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
      </div>
    </div>
  );
}
