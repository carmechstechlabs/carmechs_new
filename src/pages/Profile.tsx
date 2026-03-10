import React, { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, Mail, Phone, Shield, Wallet, Gift, 
  Calendar, Clock, CheckCircle2, XCircle, 
  Copy, ArrowRight, Car, Plus, Trash2,
  Wrench, Fuel, Hash, Info, ChevronRight, Zap
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Profile() {
  const { 
    currentUser, users, appointments, vehicles, addVehicle, removeVehicle, settings, processReferral, services,
    carMakes, carModels, fuelTypes
  } = useData();
  const [referralInput, setReferralInput] = useState("");
  const [isAddingVehicle, setIsAddingVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: "",
    model: "",
    year: new Date().getFullYear().toString(),
    fuelType: "Petrol",
    licensePlate: "",
  });

  const filteredModels = carModels.filter(m => m.make === newVehicle.make);

  const user = users.find(u => u.email === currentUser?.email) || {
    id: currentUser?.uid || "demo",
    name: currentUser?.displayName || currentUser?.email?.split('@')[0] || "User",
    email: currentUser?.email || "guest@example.com",
    phone: currentUser?.phoneNumber || "",
    walletBalance: 0,
    referralCode: "N/A",
    referralsCount: 0,
    verified: !!currentUser?.emailVerified
  };

  const userAppointments = appointments.filter(a => a.email === currentUser?.email || a.phone === user.phone)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const userVehicles = vehicles.filter(v => v.userId === user?.id);

  const getServiceTitle = (serviceId: string) => {
    return services.find(s => s.id === serviceId)?.title || serviceId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'cancelled': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const handleCopyReferral = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      toast.success("Referral code copied!");
    }
  };

  const handleApplyReferral = () => {
    if (!referralInput.trim()) return;
    if (user) {
      processReferral(referralInput, user.id);
      setReferralInput("");
      toast.success("Referral code applied!");
    }
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      addVehicle({
        userId: user.id,
        ...newVehicle
      });
      setIsAddingVehicle(false);
      setNewVehicle({
        make: "",
        model: "",
        year: "",
        fuelType: "Petrol",
        licensePlate: "",
      });
      toast.success("Vehicle added successfully!");
    } catch (error) {
      toast.error("Failed to add vehicle");
    }
  };

  const handleRemoveVehicle = async (id: string) => {
    try {
      removeVehicle(id);
      toast.success("Vehicle removed");
    } catch (error) {
      toast.error("Failed to remove vehicle");
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-slate-50 rounded-full">
          <User className="h-12 w-12 text-slate-300" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Please login to view your profile</h2>
        <Button asChild className="bg-primary rounded-xl px-8">
          <a href="/login">Login Now</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-primary/10 py-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                <Shield className="h-3 w-3" />
                Secure Profile
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900">
                Welcome back, <span className="text-primary">{user.name}</span>
              </h1>
              <p className="text-slate-500 text-lg">Manage your vehicle services, wallet, and rewards.</p>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-6 min-w-[280px] shadow-xl shadow-slate-200/50"
            >
              <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Wallet className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">Wallet Balance</p>
                <p className="text-3xl font-bold text-slate-900">₹{user.walletBalance || 0}</p>
              </div>
            </motion.div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Vehicles Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="lg:col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-xl shadow-slate-200/50"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 group-hover:bg-primary/10 transition-colors" />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Car className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">My Vehicles</h3>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="rounded-xl border-primary/20 text-primary hover:bg-primary/5"
                    onClick={() => setIsAddingVehicle(!isAddingVehicle)}
                  >
                    {isAddingVehicle ? <XCircle className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                    {isAddingVehicle ? "Cancel" : "Add Vehicle"}
                  </Button>
                </div>

                <AnimatePresence>
                  {isAddingVehicle && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mb-8 p-6 bg-slate-50 rounded-3xl border border-slate-100"
                    >
                      <form onSubmit={handleAddVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs text-slate-400 uppercase font-bold tracking-widest ml-1">Make</label>
                          <select 
                            className="w-full h-12 bg-white border border-slate-200 rounded-2xl text-sm font-bold uppercase px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                            value={newVehicle.make}
                            onChange={e => setNewVehicle({...newVehicle, make: e.target.value, model: ""})}
                            required
                          >
                            <option value="">Select Make</option>
                            {carMakes.map(make => (
                              <option key={make.name} value={make.name}>{make.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-slate-400 uppercase font-bold tracking-widest ml-1">Model</label>
                          <select 
                            className="w-full h-12 bg-white border border-slate-200 rounded-2xl text-sm font-bold uppercase px-4 focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                            value={newVehicle.model}
                            onChange={e => setNewVehicle({...newVehicle, model: e.target.value})}
                            required
                            disabled={!newVehicle.make}
                          >
                            <option value="">Select Model</option>
                            {filteredModels.map(model => (
                              <option key={model.name} value={model.name}>{model.name}</option>
                            ))}
                            {!filteredModels.length && newVehicle.make && (
                              <option value="Other">Other</option>
                            )}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-slate-400 uppercase font-bold tracking-widest ml-1">Year</label>
                          <Input 
                            placeholder="2023" 
                            type="number"
                            min="1990"
                            max={new Date().getFullYear()}
                            value={newVehicle.year}
                            onChange={e => setNewVehicle({...newVehicle, year: e.target.value})}
                            className="h-12 bg-white border-slate-200 rounded-2xl text-sm font-bold uppercase"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-slate-400 uppercase font-bold tracking-widest ml-1">Fuel Type</label>
                          <select 
                            className="w-full h-12 bg-white border border-slate-200 rounded-2xl text-sm font-bold uppercase px-4 focus:ring-2 focus:ring-primary/20 outline-none"
                            value={newVehicle.fuelType}
                            onChange={e => setNewVehicle({...newVehicle, fuelType: e.target.value})}
                          >
                            {fuelTypes.map(fuel => (
                              <option key={fuel.name} value={fuel.name}>{fuel.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs text-slate-400 uppercase font-bold tracking-widest ml-1">License Plate</label>
                          <Input 
                            placeholder="DL 01 AB 1234" 
                            value={newVehicle.licensePlate}
                            onChange={e => setNewVehicle({...newVehicle, licensePlate: e.target.value.toUpperCase()})}
                            className="h-12 bg-white border-slate-200 rounded-2xl text-sm font-bold uppercase"
                          />
                        </div>
                        <Button type="submit" className="md:col-span-2 h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-lg shadow-lg shadow-primary/20">
                          Register Vehicle
                        </Button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userVehicles.map((vehicle) => (
                    <motion.div 
                      key={vehicle.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 bg-slate-50 border border-slate-100 rounded-3xl flex items-center gap-4 group hover:border-primary/30 transition-all"
                    >
                      <div className="h-14 w-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors shadow-sm">
                        <Car className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-bold text-slate-900">{vehicle.make} {vehicle.model}</h4>
                          <button 
                            onClick={() => handleRemoveVehicle(vehicle.id)}
                            className="text-slate-300 hover:text-primary transition-colors p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                            {vehicle.fuelType}
                          </span>
                          {vehicle.licensePlate && (
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-2 py-0.5 rounded-lg">
                              {vehicle.licensePlate}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {userVehicles.length === 0 && !isAddingVehicle && (
                    <div className="md:col-span-2 py-12 text-center space-y-4">
                      <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto">
                        <Car className="h-10 w-10 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No vehicles registered yet</p>
                      <Button 
                        variant="link" 
                        className="text-primary font-bold uppercase tracking-widest"
                        onClick={() => setIsAddingVehicle(true)}
                      >
                        Add your first car
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Refer & Earn Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col shadow-xl shadow-slate-200/50"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Gift className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Refer & Earn</h3>
              </div>
              
              <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                Invite friends to join CarMechs. You'll both get <span className="text-emerald-600 font-bold">₹{settings.referralRewardAmount}</span> when they sign up!
              </p>

              <div className="space-y-6 mt-auto">
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-widest ml-1">Your Code</label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 font-mono text-lg flex items-center justify-center text-primary font-bold">
                      {user.referralCode}
                    </div>
                    <Button 
                      variant="outline"
                      className="h-auto px-4 rounded-2xl border-slate-200"
                      onClick={handleCopyReferral}
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-400 uppercase font-bold tracking-widest ml-1">Apply Code</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="CODE" 
                      value={referralInput}
                      onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                      className="h-12 bg-slate-50 border-slate-200 rounded-2xl text-center font-mono text-sm tracking-widest"
                    />
                    <Button 
                      className="h-12 bg-slate-900 rounded-2xl px-6 font-bold text-white"
                      onClick={handleApplyReferral}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Account Details & Appointments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Account Info */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                <User className="h-6 w-6 text-primary" />
                Account Details
              </h3>
              <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8 shadow-xl shadow-slate-200/50">
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Full Name</p>
                  <p className="text-lg font-semibold text-slate-900">{user.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Email Address</p>
                  <p className="text-lg font-semibold text-slate-600">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Phone Number</p>
                  <p className="text-lg font-semibold text-slate-900">{user.phone || "Not provided"}</p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Account Status</p>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      user.verified ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                    )}>
                      {user.verified ? 'Verified' : 'Pending'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-900">
                  <Calendar className="h-6 w-6 text-primary" />
                  Service History
                </h3>
                <div className="px-4 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500">
                  {userAppointments.length} Appointments
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50">
                {userAppointments.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {userAppointments.map((app) => (
                      <motion.div 
                        key={app.id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-6 md:p-8 hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-start gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                              <Wrench className="h-8 w-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-xl font-bold text-slate-900">{getServiceTitle(app.service)}</h4>
                              <p className="text-slate-500 font-medium">
                                {app.make} {app.model} 
                                {app.year && ` (${app.year})`} 
                                {app.licensePlate && ` • ${app.licensePlate}`}
                                • <span className="text-primary/80 uppercase text-sm tracking-widest">{app.fuel}</span>
                              </p>
                              <div className="flex flex-wrap items-center gap-4 mt-4">
                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                  <Calendar className="h-3.5 w-3.5 text-primary" />
                                  {app.date}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                  <Clock className="h-3.5 w-3.5 text-primary" />
                                  {app.time}
                                </div>
                                {app.paymentMethod && (
                                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 uppercase tracking-wider">
                                    {app.paymentMethod.replace(/_/g, ' ')}
                                    <span className={cn(
                                      "ml-1 text-[10px]",
                                      app.paymentStatus === 'paid' ? "text-emerald-600" : "text-amber-600"
                                    )}>
                                      ({app.paymentStatus})
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4">
                            <span className={cn(
                              "px-4 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-[0.2em]",
                              getStatusColor(app.status)
                            )}>
                              {app.status}
                            </span>
                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5 hover:text-primary rounded-xl group-hover:translate-x-2 transition-all">
                              View Details <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center">
                    <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Calendar className="h-10 w-10 text-slate-300" />
                    </div>
                    <h4 className="text-2xl font-bold mb-2 text-slate-900">No Service History</h4>
                    <p className="text-slate-500 mb-10 max-w-sm mx-auto">You haven't booked any car services yet. Start your journey with CarMechs today.</p>
                    <Button 
                      asChild
                      className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20"
                    >
                      <a href="/#services">Book Your First Service</a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
