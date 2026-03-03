import { useState } from "react";
import { useData, User as UserType } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Phone, Mail, Calendar, Car, Edit2, Ban, CheckCircle2, ShieldAlert, Loader2, X, Wallet, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Customers() {
  const { users, appointments, updateUser, adminRole } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.phone.includes(searchTerm) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUserAppointments = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return [];
    return appointments.filter(app => app.phone === user.phone || app.email === user.email);
  };

  const getUserCars = (userId: string) => {
    const apps = getUserAppointments(userId);
    const cars = new Set<string>();
    apps.forEach(app => cars.add(`${app.make} ${app.model} (${app.fuel})`));
    return Array.from(cars);
  };

  const handleBlockToggle = (user: UserType) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to block users.");
      return;
    }
    const newStatus = !user.blocked;
    updateUser(user.id, { blocked: newStatus });
    toast.success(`User ${newStatus ? 'blocked' : 'unblocked'} successfully`);
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to edit users.");
      return;
    }
    setIsSaving(true);
    updateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
      phone: editingUser.phone,
      verified: editingUser.verified
    });
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    setEditingUser(null);
    toast.success("User details updated successfully");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <User className="h-3 w-3" /> CRM
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Customer Base</h1>
          <p className="text-slate-500 text-sm font-medium">Manage user profiles, booking history, and system access.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm w-full lg:w-auto">
          <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <Input 
            placeholder="Search by name, phone or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-slate-900 placeholder:text-slate-300 uppercase tracking-widest text-xs w-full lg:w-64"
          />
          {searchTerm && (
            <Button variant="ghost" size="icon" onClick={() => setSearchTerm("")} className="h-8 w-8 text-slate-400 hover:text-slate-900">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredUsers.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-200"
            >
              <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-100 mx-auto mb-4">
                <User className="h-10 w-10 text-slate-300" />
              </div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-900/40">No Customers Found</p>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-slate-400">Try adjusting your search parameters</p>
            </motion.div>
          ) : (
            filteredUsers.map((user, index) => {
              const userApps = getUserAppointments(user.id);
              const userCars = getUserCars(user.id);
              
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={cn(
                    "bg-white border-slate-200 shadow-sm hover:border-red-600/30 transition-all duration-500 group overflow-hidden rounded-[2rem]",
                    user.blocked && "opacity-60 grayscale-[0.5]"
                  )}>
                    <CardHeader className="p-6 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-14 w-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:scale-110 duration-500",
                            user.blocked ? "bg-slate-400 shadow-slate-400/20" : "bg-[#e31e24] shadow-red-500/20"
                          )}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter group-hover:text-red-600 transition-colors">{user.name}</h3>
                            <div className="flex flex-wrap gap-2">
                              {user.verified ? (
                                <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-100">
                                  <CheckCircle2 className="h-2.5 w-2.5" /> Verified
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md border border-amber-100">
                                  <ShieldAlert className="h-2.5 w-2.5" /> Unverified
                                </span>
                              )}
                              {user.blocked && (
                                <span className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest bg-red-50 text-red-600 px-2 py-0.5 rounded-md border border-red-100">
                                  <Ban className="h-2.5 w-2.5" /> Blocked
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all"
                            onClick={() => setEditingUser(user)}
                            disabled={adminRole !== 'admin'}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                              "h-9 w-9 bg-white border border-slate-100 rounded-xl transition-all",
                              user.blocked ? "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200" : "text-red-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
                            )}
                            onClick={() => handleBlockToggle(user)}
                            disabled={adminRole !== 'admin'}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group/item hover:bg-white hover:border-red-600/20 transition-all">
                          <div className="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:text-red-600 transition-colors">
                            <Phone className="h-4 w-4" />
                          </div>
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 group/item hover:bg-white hover:border-red-600/20 transition-all">
                          <div className="h-8 w-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 group-hover/item:text-red-600 transition-colors">
                            <Mail className="h-4 w-4" />
                          </div>
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest truncate">{user.email}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-red-600" /> Booking History
                          </h4>
                          <span className="px-2 py-0.5 rounded-md bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-100">
                            {userApps.length} {userApps.length === 1 ? 'Entry' : 'Entries'}
                          </span>
                        </div>
                        {userApps.length > 0 && (
                          <div className="flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Last Interaction</span>
                            <span className="text-slate-900">{new Date(userApps[0].createdAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                          <Car className="h-3 w-3 text-red-600" /> Registered Fleet
                        </h4>
                        {userCars.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {userCars.map((car, i) => (
                              <span key={i} className="text-[9px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md uppercase tracking-widest">
                                {car}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest italic">No fleet data detected</p>
                        )}
                      </div>
                      
                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-3.5 w-3.5 text-emerald-500" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wallet Credits</span>
                        </div>
                        <span className="text-lg font-black text-emerald-600 tracking-tighter">₹{user.walletBalance || 0}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
                    <Edit2 className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Edit Profile</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Update customer parameters</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setEditingUser(null)} className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  <Input 
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-bold text-xs uppercase tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                  <Input 
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-bold text-xs uppercase tracking-widest"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                  <Input 
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                    className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-bold text-xs uppercase tracking-widest"
                  />
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center h-5">
                    <input 
                      type="checkbox" 
                      id="verified"
                      checked={editingUser.verified}
                      onChange={(e) => setEditingUser({...editingUser, verified: e.target.checked})}
                      className="h-5 w-5 rounded-lg border-slate-300 text-red-600 focus:ring-red-600/20 cursor-pointer"
                    />
                  </div>
                  <label htmlFor="verified" className="text-[10px] font-black text-slate-900 uppercase tracking-widest cursor-pointer flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Account Verified
                  </label>
                </div>
              </div>

              <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                <Button 
                  variant="ghost" 
                  className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200" 
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 h-12 bg-[#e31e24] hover:bg-[#c4191f] text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-red-500/20" 
                  onClick={handleSaveEdit} 
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    "Commit Changes"
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
