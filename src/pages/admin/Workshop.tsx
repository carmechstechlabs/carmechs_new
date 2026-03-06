import React, { useState } from "react";
import { useData, Appointment } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wrench, Car, Clock, CheckCircle2, 
  Activity, Zap, LayoutGrid, List,
  ArrowRight, User, AlertCircle, Timer,
  ShieldCheck, Hammer, Droplets, Gauge
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface Bay {
  id: string;
  name: string;
  status: 'available' | 'occupied' | 'maintenance';
  appointmentId?: string;
}

export function Workshop() {
  const { appointments, updateAppointments, services, users } = useData();
  const [viewMode, setViewMode] = useState<'bays' | 'kanban'>('bays');
  
  // Mock bays for visualization
  const [bays, setBays] = useState<Bay[]>([
    { id: 'bay-1', name: 'Bay 01', status: 'occupied', appointmentId: appointments.find(a => a.status === 'confirmed')?.id },
    { id: 'bay-2', name: 'Bay 02', status: 'available' },
    { id: 'bay-3', name: 'Bay 03', status: 'occupied', appointmentId: appointments.find(a => a.status === 'confirmed' && a.id !== appointments.find(a => a.status === 'confirmed')?.id)?.id },
    { id: 'bay-4', name: 'Bay 04', status: 'maintenance' },
    { id: 'bay-5', name: 'Bay 05', status: 'available' },
    { id: 'bay-6', name: 'Bay 06', status: 'available' },
  ]);

  const kanbanColumns = [
    { id: 'pending', title: 'Arrivals', icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-50' },
    { id: 'confirmed', title: 'In Service', icon: Wrench, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 'completed', title: 'Quality Check', icon: ShieldCheck, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
  ];

  const handleStatusChange = (id: string, newStatus: Appointment['status']) => {
    const updated = appointments.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    );
    updateAppointments(updated);
    toast.success(`Vehicle moved to ${newStatus}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <Activity className="h-3 w-3" /> Live Workshop Control
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
            Workshop Floor
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 border border-emerald-100 rounded-full">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Active Session</span>
            </div>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Real-time management of service bays and technician workflow.</p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner">
          <Button 
            variant={viewMode === 'bays' ? 'default' : 'ghost'}
            onClick={() => setViewMode('bays')}
            className={cn(
              "rounded-xl px-6 h-10 font-black uppercase tracking-widest text-[9px] transition-all",
              viewMode === 'bays' ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900"
            )}
          >
            <LayoutGrid className="mr-2 h-3 w-3" /> Bay View
          </Button>
          <Button 
            variant={viewMode === 'kanban' ? 'default' : 'ghost'}
            onClick={() => setViewMode('kanban')}
            className={cn(
              "rounded-xl px-6 h-10 font-black uppercase tracking-widest text-[9px] transition-all",
              viewMode === 'kanban' ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900"
            )}
          >
            <List className="mr-2 h-3 w-3" /> Workflow
          </Button>
        </div>
      </div>

      {/* Bay View */}
      <AnimatePresence mode="wait">
        {viewMode === 'bays' ? (
          <motion.div 
            key="bays"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {bays.map((bay) => {
              const appointment = appointments.find(a => a.id === bay.appointmentId);
              const service = services.find(s => s.id === appointment?.service);
              
              return (
                <Card key={bay.id} className={cn(
                  "bg-white border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden group transition-all duration-500",
                  bay.status === 'occupied' ? "border-l-4 border-l-blue-500" : 
                  bay.status === 'maintenance' ? "border-l-4 border-l-amber-500 opacity-60" : 
                  "border-l-4 border-l-emerald-500 hover:border-emerald-500/50"
                )}>
                  <CardHeader className="pb-4 border-b border-slate-50 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-black uppercase tracking-tight text-slate-900">{bay.name}</CardTitle>
                      <span className={cn(
                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                        bay.status === 'occupied' ? "bg-blue-50 text-blue-600" : 
                        bay.status === 'maintenance' ? "bg-amber-50 text-amber-600" : 
                        "bg-emerald-50 text-emerald-600"
                      )}>
                        {bay.status}
                      </span>
                    </div>
                    <div className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center border transition-all",
                      bay.status === 'occupied' ? "bg-blue-50 border-blue-100 text-blue-600" : 
                      bay.status === 'maintenance' ? "bg-amber-50 border-amber-100 text-amber-600" : 
                      "bg-emerald-50 border-emerald-100 text-emerald-600"
                    )}>
                      {bay.status === 'occupied' ? <Car className="h-5 w-5" /> : 
                       bay.status === 'maintenance' ? <AlertCircle className="h-5 w-5" /> : 
                       <CheckCircle2 className="h-5 w-5" />}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {appointment ? (
                      <div className="space-y-6">
                        <div className="flex items-start gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <Wrench className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Service</p>
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{service?.title || appointment.service}</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{appointment.make} {appointment.model}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Technician</p>
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-primary" />
                              <select 
                                className="bg-transparent text-[10px] font-bold text-slate-700 uppercase tracking-widest outline-none cursor-pointer"
                                value={appointment.technicianId || ""}
                                onChange={(e) => {
                                  const updated = appointments.map(a => 
                                    a.id === appointment.id ? { ...a, technicianId: e.target.value } : a
                                  );
                                  updateAppointments(updated);
                                  toast.success("Technician assigned");
                                }}
                              >
                                <option value="">Unassigned</option>
                                {users.filter(u => u.role === 'admin' || u.role === 'viewer').map(staff => (
                                  <option key={staff.id} value={staff.id}>{staff.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Time Elapsed</p>
                            <div className="flex items-center gap-2">
                              <Timer className="h-3 w-3 text-blue-600" />
                              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">02:45:00</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
                            <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">65%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: '65%' }}
                              className="h-full bg-blue-500 rounded-full"
                            />
                          </div>
                        </div>

                        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 font-black uppercase tracking-widest text-[9px]">
                          Update Progress
                        </Button>
                      </div>
                    ) : (
                      <div className="py-10 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="h-16 w-16 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                          <Zap className="h-8 w-8 text-slate-200" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bay Ready</p>
                          <p className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-1">Awaiting vehicle arrival</p>
                        </div>
                        {bay.status === 'available' && (
                          <Button variant="outline" className="rounded-xl border-slate-200 text-slate-500 hover:text-slate-900 font-black uppercase tracking-widest text-[8px]">
                            Assign Booking
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            key="kanban"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {kanbanColumns.map((col) => (
              <div key={col.id} className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center border shadow-sm", col.bgColor, col.color.replace('text-', 'border-').replace('500', '100'))}>
                      <col.icon className={cn("h-5 w-5", col.color)} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter leading-none">{col.title}</h3>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        {appointments.filter(a => a.status === col.id).length} Vehicles
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-100">
                    <Activity className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4 min-h-[500px] p-4 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 shadow-inner">
                  {appointments.filter(a => a.status === col.id).map((apt) => (
                    <motion.div
                      key={apt.id}
                      layoutId={apt.id}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">{apt.name}</h4>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{apt.make} {apt.model}</p>
                        </div>
                        <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                          <Car className="h-4 w-4 text-slate-300" />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                          <Wrench className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest truncate">
                          {services.find(s => s.id === apt.service)?.title || apt.service}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-slate-300" />
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{apt.time}</span>
                          </div>
                          {apt.technicianId && (
                            <div className="flex items-center gap-2 px-2 py-1 bg-slate-50 rounded-lg border border-slate-100">
                              <User className="h-2.5 w-2.5 text-primary" />
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                                {users.find(u => u.id === apt.technicianId)?.name.split(' ')[0]}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {col.id === 'pending' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleStatusChange(apt.id, 'confirmed')}
                              className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[8px] font-black uppercase tracking-widest"
                            >
                              Start <ArrowRight className="ml-1 h-2 w-2" />
                            </Button>
                          )}
                          {col.id === 'confirmed' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleStatusChange(apt.id, 'completed')}
                              className="h-8 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[8px] font-black uppercase tracking-widest"
                            >
                              Finish <CheckCircle2 className="ml-1 h-2 w-2" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workshop Stats Sidebar/Bottom */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900 border-slate-800 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                <Gauge className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Workshop Load</p>
                <p className="text-3xl font-black tracking-tighter">84%</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                <span className="text-white/40">Efficiency</span>
                <span>+12%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[84%]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-200/50">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                <Hammer className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Techs</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">12/15</p>
              </div>
            </div>
            <div className="flex -space-x-2 overflow-hidden">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-50 flex items-center justify-center text-[10px] font-black text-slate-300">
                +7
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-200/50">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                <Droplets className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consumables</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">Optimal</p>
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Critical fluids at 92% capacity</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-100 shadow-2xl shadow-slate-200/50">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg. TAT</p>
                <p className="text-3xl font-black text-slate-900 tracking-tighter">4.2h</p>
              </div>
            </div>
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> 15% faster than last week
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const TrendingUp = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);
