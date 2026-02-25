import { useState } from "react";
import { useData, User as UserType } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, Phone, Mail, Calendar, Car, Edit2, Ban, CheckCircle2, ShieldAlert, Loader2, X } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500">
            <User className="h-12 w-12 text-slate-300 mb-4 mx-auto" />
            <p>No customers found.</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const userApps = getUserAppointments(user.id);
            const userCars = getUserCars(user.id);
            
            return (
              <Card key={user.id} className={cn(
                "hover:shadow-md transition-all border-l-4",
                user.blocked ? "border-l-red-500 opacity-75" : "border-l-transparent"
              )}>
                <CardHeader className="pb-4 border-b border-slate-100">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center text-white font-bold",
                        user.blocked ? "bg-slate-400" : "bg-primary"
                      )}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span>{user.name}</span>
                        <div className="flex gap-2 mt-1">
                          {user.verified ? (
                            <span className="flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded-full border border-emerald-100">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Verified
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full border border-amber-100">
                              <ShieldAlert className="h-2.5 w-2.5" /> Unverified
                            </span>
                          )}
                          {user.blocked && (
                            <span className="flex items-center gap-1 text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-full border border-red-100">
                              <Ban className="h-2.5 w-2.5" /> Blocked
                            </span>
                          )}
                        </div>
                      </div>
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-400 hover:text-primary"
                        onClick={() => setEditingUser(user)}
                        disabled={adminRole !== 'admin'}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn(
                          "h-8 w-8",
                          user.blocked ? "text-emerald-500 hover:text-emerald-600" : "text-red-400 hover:text-red-500"
                        )}
                        onClick={() => handleBlockToggle(user)}
                        disabled={adminRole !== 'admin'}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-2 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span>{user.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Booking History
                    </h4>
                    <p className="text-sm font-medium text-slate-900">
                      {userApps.length} {userApps.length === 1 ? 'Booking' : 'Bookings'}
                    </p>
                    {userApps.length > 0 && (
                      <p className="text-xs text-slate-500 mt-1">
                        Last booking: {new Date(userApps[0].createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Car className="h-3 w-3" /> Vehicles
                    </h4>
                    {userCars.length > 0 ? (
                      <ul className="space-y-1">
                        {userCars.map((car, i) => (
                          <li key={i} className="text-sm text-slate-700 bg-slate-50 px-2 py-1 rounded">
                            {car}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No vehicles registered</p>
                    )}
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Wallet Balance</span>
                    <span className="text-sm font-bold text-emerald-600">₹{user.walletBalance || 0}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-bold text-slate-900">Edit Customer</h3>
                <Button variant="ghost" size="icon" onClick={() => setEditingUser(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input 
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <Input 
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <Input 
                    value={editingUser.phone}
                    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="verified"
                    checked={editingUser.verified}
                    onChange={(e) => setEditingUser({...editingUser, verified: e.target.checked})}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="verified" className="text-sm font-medium cursor-pointer">Phone Verified</label>
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setEditingUser(null)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleSaveEdit} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
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
