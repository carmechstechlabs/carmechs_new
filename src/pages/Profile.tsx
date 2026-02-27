import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, Users, Copy, CheckCircle2, Gift, ArrowRight, Calendar, Clock, ChevronRight, Wrench, User, Shield, Zap, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function Profile() {
  const { users, settings, processReferral, appointments, services, currentUser } = useData();
  
  // Find the user data in our database that matches the logged-in Firebase user
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

  const [referralInput, setReferralInput] = useState("");

  const userAppointments = appointments.filter(app => 
    app.email === user.email || app.phone === user.phone
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getServiceTitle = (serviceId: string) => {
    return services.find(s => s.id === serviceId)?.title || serviceId;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    toast.success("Referral code copied!");
  };

  const handleApplyReferral = () => {
    if (!referralInput) {
      toast.error("Please enter a referral code");
      return;
    }
    if (referralInput === user.referralCode) {
      toast.error("You cannot use your own referral code");
      return;
    }
    processReferral(referralInput, user.id);
    setReferralInput("");
    toast.success("Referral code applied successfully!");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 py-24">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                <Shield className="h-3 w-3" />
                Secure Profile
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Welcome back, <span className="text-gradient">{user.name}</span>
              </h1>
              <p className="text-slate-400 text-lg">Manage your vehicle services, wallet, and rewards.</p>
            </div>
            
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="glass-dark border border-white/10 rounded-3xl p-6 flex items-center gap-6 min-w-[280px]"
            >
              <div className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                <Wallet className="h-7 w-7" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">Wallet Balance</p>
                <p className="text-3xl font-bold text-white">₹{user.walletBalance || 0}</p>
              </div>
            </motion.div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Refer & Earn Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="lg:col-span-2 glass-dark border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32 group-hover:bg-primary/20 transition-colors" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Gift className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-bold">Refer & Earn Rewards</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <p className="text-slate-400 leading-relaxed">
                      Share your unique code with friends. When they join, you both get <span className="text-emerald-400 font-bold">₹{settings.referralRewardAmount}</span> in your wallets!
                    </p>
                    
                    <div className="space-y-3">
                      <label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Your Referral Code</label>
                      <div className="flex gap-3">
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 font-mono text-xl flex items-center justify-between group/code">
                          <span className="text-primary tracking-wider">{user.referralCode}</span>
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 opacity-0 group-hover/code:opacity-100 transition-opacity" />
                        </div>
                        <Button 
                          className="h-auto px-6 rounded-2xl bg-white/10 hover:bg-white/20 border-white/10"
                          onClick={copyReferralCode}
                        >
                          <Copy className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center p-8 bg-white/5 rounded-3xl border border-white/5">
                    <div className="text-5xl font-bold text-white mb-2">{user.referralsCount || 0}</div>
                    <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">Total Referrals</div>
                    <div className="mt-6 flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 w-10 rounded-full border-2 border-[#050505] bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                      <div className="h-10 w-10 rounded-full border-2 border-[#050505] bg-primary flex items-center justify-center text-[10px] font-bold">
                        +{user.referralsCount || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Apply Referral Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="glass-dark border border-white/10 rounded-[2.5rem] p-8 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Redeem Code</h3>
              </div>
              
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Enter a friend's referral code to link accounts and unlock exclusive benefits.
              </p>

              <div className="space-y-4 mt-auto">
                <Input 
                  placeholder="ENTER CODE" 
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl text-center font-mono text-xl tracking-[0.2em] uppercase focus:ring-primary"
                />
                <Button 
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-lg shadow-primary/20"
                  onClick={handleApplyReferral}
                >
                  Apply Now
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Instant Wallet Credit
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-400">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  No Expiry Balance
                </div>
              </div>
            </motion.div>
          </div>

          {/* Account Details & Appointments */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Account Info */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <User className="h-6 w-6 text-primary" />
                Account Details
              </h3>
              <div className="glass-dark border border-white/10 rounded-3xl p-8 space-y-8">
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Full Name</p>
                  <p className="text-lg font-semibold">{user.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Email Address</p>
                  <p className="text-lg font-semibold text-slate-300">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Phone Number</p>
                  <p className="text-lg font-semibold">{user.phone || "Not provided"}</p>
                </div>
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Account Status</p>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      user.verified ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
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
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-primary" />
                  Service History
                </h3>
                <div className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-400">
                  {userAppointments.length} Appointments
                </div>
              </div>

              <div className="glass-dark border border-white/10 rounded-3xl overflow-hidden">
                {userAppointments.length > 0 ? (
                  <div className="divide-y divide-white/5">
                    {userAppointments.map((app) => (
                      <motion.div 
                        key={app.id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-6 md:p-8 hover:bg-white/[0.02] transition-colors group"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-start gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                              <Wrench className="h-8 w-8 text-primary" />
                            </div>
                            <div className="space-y-2">
                              <h4 className="text-xl font-bold text-white">{getServiceTitle(app.service)}</h4>
                              <p className="text-slate-400 font-medium">{app.make} {app.model} • <span className="text-primary/80 uppercase text-sm tracking-widest">{app.fuel}</span></p>
                              <div className="flex flex-wrap items-center gap-4 mt-4">
                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                  <Calendar className="h-3.5 w-3.5 text-primary" />
                                  {app.date}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                  <Clock className="h-3.5 w-3.5 text-primary" />
                                  {app.time}
                                </div>
                                {app.paymentMethod && (
                                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 uppercase tracking-wider">
                                    {app.paymentMethod.replace(/_/g, ' ')}
                                    <span className={cn(
                                      "ml-1 text-[10px]",
                                      app.paymentStatus === 'paid' ? "text-emerald-400" : "text-amber-400"
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
                              "px-4 py-1.5 rounded-full text-[10px] font-black border uppercase tracking-[0.2em]",
                              getStatusColor(app.status)
                            )}>
                              {app.status}
                            </span>
                            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 hover:text-primary rounded-xl group-hover:translate-x-2 transition-all">
                              View Details <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center">
                    <div className="h-20 w-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <Calendar className="h-10 w-10 text-slate-600" />
                    </div>
                    <h4 className="text-2xl font-bold mb-2">No Service History</h4>
                    <p className="text-slate-500 mb-10 max-w-sm mx-auto">You haven't booked any car services yet. Start your journey with CarMechs today.</p>
                    <Button 
                      asChild
                      className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20"
                    >
                      <a href="/book">Book Your First Service</a>
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
