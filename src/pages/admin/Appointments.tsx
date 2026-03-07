import { useState } from "react";
import { useData, Appointment } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Phone, Car, Wrench, Search, MoreVertical, CheckCircle, XCircle, CreditCard, IndianRupee, Shield, Activity, Zap, Filter, ArrowRight, Mail, MapPin, Info, CheckCircle2, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function Appointments() {
  const { appointments, updateAppointments, services, adminRole, technicians } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<'date_asc' | 'date_desc' | 'created_at_desc'>('created_at_desc');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleStatusChange = (id: string, newStatus: Appointment['status']) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to change appointment status.");
      return;
    }
    const updated = appointments.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    );
    updateAppointments(updated);
    toast.success(`Appointment marked as ${newStatus}`);
  };

  const handleTechnicianChange = (id: string, techId: string) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to assign technicians.");
      return;
    }
    const updated = appointments.map(app => 
      app.id === id ? { ...app, technicianId: techId } : app
    );
    updateAppointments(updated);
    const techName = technicians.find(t => t.id === techId)?.name || "Technician";
    toast.success(`Assigned ${techName} to appointment`);
  };

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm) ||
      app.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (services.find(s => s.id === app.service)?.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (services.find(s => s.id === app.service)?.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const isOverdue = new Date(app.date) < new Date() && app.status !== 'completed' && app.status !== 'cancelled';
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "overdue" ? isOverdue : app.status === statusFilter);
    
    const matchesPriority = priorityFilter === "all" || app.priority === priorityFilter;
    const matchesService = serviceFilter === "all" || app.service === serviceFilter;
    
    let matchesDate = true;
    if (dateFilter !== "all") {
      const appDate = new Date(app.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dateFilter === "today") {
        matchesDate = appDate.toDateString() === today.toDateString();
      } else if (dateFilter === "upcoming") {
        matchesDate = appDate >= today;
      } else if (dateFilter === "past") {
        matchesDate = appDate < today;
      }
    }

    return matchesSearch && matchesStatus && matchesService && matchesDate && matchesPriority;
  }).sort((a, b) => {
    if (sortBy === 'date_asc') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === 'date_desc') return new Date(b.date).getTime() - new Date(a.date).getTime();
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getStatusColor = (status: string, isOverdue?: boolean) => {
    if (isOverdue) return 'text-red-600 bg-red-50 border-red-100';
    switch (status) {
      case 'pending': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'confirmed': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'completed': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'cancelled': return 'text-primary bg-primary/5 border-primary/10';
      default: return 'text-slate-400 bg-slate-50 border-slate-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-400 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <Activity className="h-3 w-3" /> Management
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Appointments</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and monitor all service bookings.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search Customer, Vehicle..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-white border-slate-200 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-slate-300 font-bold text-xs uppercase tracking-widest shadow-sm"
            />
          </div>
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 h-12 shadow-sm">
              <Wrench className="h-4 w-4 text-primary" />
              <select
                className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 focus:outline-none cursor-pointer pr-4"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="all" className="bg-white">All Services</option>
                {services.map(s => (
                  <option key={s.id} value={s.id} className="bg-white">{s.title}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 h-12 shadow-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <select
                className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 focus:outline-none cursor-pointer pr-4"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all" className="bg-white">All Dates</option>
                <option value="today" className="bg-white">Today</option>
                <option value="upcoming" className="bg-white">Upcoming</option>
                <option value="past" className="bg-white">Past</option>
              </select>
            </div>
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 h-12 shadow-sm">
              <Filter className="h-4 w-4 text-primary" />
              <select
                className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 focus:outline-none cursor-pointer pr-4"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all" className="bg-white">All Status</option>
                <option value="pending" className="bg-white">Pending</option>
                <option value="confirmed" className="bg-white">Confirmed</option>
                <option value="completed" className="bg-white">Completed</option>
                <option value="cancelled" className="bg-white">Cancelled</option>
                <option value="overdue" className="bg-white">Overdue</option>
              </select>
            </div>
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 h-12 shadow-sm">
              <Shield className="h-4 w-4 text-primary" />
              <select
                className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 focus:outline-none cursor-pointer pr-4"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all" className="bg-white">All Priority</option>
                <option value="high" className="bg-white">High</option>
                <option value="medium" className="bg-white">Medium</option>
                <option value="low" className="bg-white">Low</option>
              </select>
            </div>
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 h-12 shadow-sm">
              <Activity className="h-4 w-4 text-primary" />
              <select
                className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 focus:outline-none cursor-pointer pr-4"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="created_at_desc" className="bg-white">Newest First</option>
                <option value="date_asc" className="bg-white">Date (Asc)</option>
                <option value="date_desc" className="bg-white">Date (Desc)</option>
              </select>
            </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAppointments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-24 text-slate-400 gap-4">
                  <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                    <Calendar className="h-10 w-10 opacity-20" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-900/40">No Bookings Found</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Adjust filters to see more results</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white border-slate-200 shadow-sm hover:border-primary/30 transition-all duration-500 group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row">
                      {/* Left Column: Customer & Vehicle */}
                      <div className="p-8 lg:w-1/3 bg-slate-50 border-r border-slate-100 relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
                        
                        <div className="flex justify-between items-start mb-8 relative z-10">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">
                              <User className="h-3 w-3" /> Customer
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-primary transition-colors">{appointment.name}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500",
                              getStatusColor(appointment.status, new Date(appointment.date) < new Date() && appointment.status !== 'completed' && appointment.status !== 'cancelled')
                            )}>
                              {appointment.status}
                            </span>
                            <span className={cn(
                              "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border",
                              getPriorityColor(appointment.priority)
                            )}>
                              {appointment.priority}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone</span>
                              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                                <Phone className="h-3 w-3 text-primary" /> {appointment.phone}
                              </div>
                            </div>
                            {appointment.email && (
                              <div className="space-y-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600 truncate">
                                  <span className="text-primary font-black">@</span> {appointment.email}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="pt-6 border-t border-slate-200">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Vehicle Details</span>
                            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 group-hover:border-primary/20 transition-all shadow-sm">
                              <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                                <Car className="h-5 w-5 text-primary" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[13px] font-black text-slate-900 uppercase tracking-tighter">
                                  {appointment.make} {appointment.model}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{appointment.fuel} Engine</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Service & Details */}
                      <div className="p-8 lg:w-2/3 flex flex-col justify-between relative bg-white">
                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
                        
                        <div className="relative z-10">
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-10">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">
                                <Wrench className="h-3 w-3" /> Service
                              </div>
                              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                                {services.find(s => s.id === appointment.service)?.title || 'Unknown Service'}
                              </h3>
                            </div>
                            
                              <div className="w-full sm:w-48">
                                <Select 
                                  value={appointment.technicianId || ""} 
                                  onValueChange={(val) => handleTechnicianChange(appointment.id, val)}
                                  disabled={adminRole !== 'admin'}
                                >
                                  <SelectTrigger className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] focus:ring-primary/20 shadow-sm">
                                    <SelectValue placeholder="Assign Technician" />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border-slate-200 text-slate-900">
                                    {technicians.map(tech => (
                                      <SelectItem key={tech.id} value={tech.id} className="text-[10px] font-black uppercase tracking-widest focus:bg-primary/5 focus:text-primary">
                                        {tech.name} ({tech.specialty})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="w-full sm:w-48">
                                <Select 
                                  value={appointment.status} 
                                onValueChange={(val) => handleStatusChange(appointment.id, val as Appointment['status'])}
                                disabled={adminRole !== 'admin'}
                              >
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] focus:ring-primary/20 shadow-sm">
                                  <SelectValue placeholder="Update Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-slate-200 text-slate-900">
                                  <SelectItem value="pending" className="text-[10px] font-black uppercase tracking-widest focus:bg-primary/5 focus:text-primary">Pending</SelectItem>
                                  <SelectItem value="confirmed" className="text-[10px] font-black uppercase tracking-widest focus:bg-primary/5 focus:text-primary">Confirmed</SelectItem>
                                  <SelectItem value="completed" className="text-[10px] font-black uppercase tracking-widest focus:bg-primary/5 focus:text-primary">Completed</SelectItem>
                                  <SelectItem value="cancelled" className="text-[10px] font-black uppercase tracking-widest focus:bg-primary/5 focus:text-primary">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-primary/30 transition-all group/stat">
                              <Calendar className="h-5 w-5 text-primary group-hover/stat:scale-110 transition-transform" />
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</span>
                                <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-primary/30 transition-all group/stat">
                              <Clock className="h-5 w-5 text-primary group-hover/stat:scale-110 transition-transform" />
                              <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Time</span>
                                <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">{appointment.time}</span>
                              </div>
                            </div>
                            {appointment.paymentMethod && (
                              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-primary/30 transition-all group/stat">
                                <CreditCard className="h-5 w-5 text-primary group-hover/stat:scale-110 transition-transform" />
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">
                                      {appointment.paymentMethod.split('_')[0]}
                                    </span>
                                    <span className={cn(
                                      "text-[8px] px-1.5 py-0.5 rounded-lg font-black uppercase tracking-widest border",
                                      appointment.paymentStatus === 'paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                                    )}>
                                      {appointment.paymentStatus}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                            {appointment.amount && (
                              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-primary/30 transition-all group/stat">
                                <IndianRupee className="h-5 w-5 text-emerald-600 group-hover/stat:scale-110 transition-transform" />
                                <div className="flex flex-col">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount</span>
                                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-tighter">₹{appointment.amount}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="mt-10 flex items-center justify-between relative z-10">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Booking Created: {new Date(appointment.createdAt).toLocaleString()}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedAppointment(appointment)}
                            className="text-[9px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 rounded-xl group/btn"
                          >
                            View Details <ArrowRight className="ml-2 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Appointment Details Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                    <Info className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Booking Details</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">ID: {selectedAppointment.id}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedAppointment(null)} className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 max-h-[70vh] overflow-y-auto scrollbar-none">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <User className="h-3 w-3 text-primary" /> Customer Profile
                    </h4>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center font-black text-lg">
                          {selectedAppointment.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{selectedAppointment.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Registered Customer</p>
                        </div>
                      </div>
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600">
                          <Phone className="h-3.5 w-3.5 text-primary" /> {selectedAppointment.phone}
                        </div>
                        {selectedAppointment.email && (
                          <div className="flex items-center gap-3 text-[11px] font-bold text-slate-600">
                            <Mail className="h-3.5 w-3.5 text-primary" /> {selectedAppointment.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Car className="h-3 w-3 text-primary" /> Vehicle Information
                    </h4>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Make & Model</span>
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{selectedAppointment.make} {selectedAppointment.model}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fuel Type</span>
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{selectedAppointment.fuel}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Year</span>
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">2022 (Estimated)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Wrench className="h-3 w-3 text-primary" /> Service Details
                    </h4>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Package</span>
                        <span className="text-[11px] font-black text-primary uppercase tracking-tight">
                          {services.find(s => s.id === selectedAppointment.service)?.title || 'Standard Service'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</span>
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                          {new Date(selectedAppointment.date).toLocaleDateString()} @ {selectedAppointment.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Technician</span>
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                          {technicians.find(t => t.id === selectedAppointment.technicianId)?.name || 'Not Assigned'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <CreditCard className="h-3 w-3 text-primary" /> Billing & Payment
                    </h4>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Method</span>
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{selectedAppointment.paymentMethod?.split('_')[0] || 'COD'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</span>
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border",
                          selectedAppointment.paymentStatus === 'paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
                        )}>
                          {selectedAppointment.paymentStatus}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Total Amount</span>
                        <span className="text-xl font-black text-emerald-600 tracking-tighter">₹{selectedAppointment.amount || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-slate-200" 
                  onClick={() => setSelectedAppointment(null)}
                >
                  Close
                </Button>
                <Button 
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20" 
                  onClick={() => {
                    toast.info("Printing receipt...");
                    setSelectedAppointment(null);
                  }}
                >
                  Print Receipt
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
