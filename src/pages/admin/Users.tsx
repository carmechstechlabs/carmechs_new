import { useState } from "react";
import { useData, User } from "@/context/DataContext";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users as UsersIcon, Search, Shield, User as UserIcon, CheckCircle, XCircle, Plus, Trash2, Edit2, Ban, Activity, Zap, ShieldCheck, Key, Wallet, Phone, Mail, ArrowRight, Filter } from "lucide-react";
import { toast } from "sonner";
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

export function Users() {
  const { users, updateUsers, adminRole } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
    verified: false,
    blocked: false,
    walletBalance: 0
  });

  const handleRoleChange = (id: string, newRole: User['role']) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to change user roles.");
      return;
    }
    const updated = users.map(user => 
      user.id === id ? { ...user, role: newRole } : user
    );
    updateUsers(updated);
    toast.success(`User role updated to ${newRole}`);
  };

  const handleDeleteUser = (id: string) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to delete users.");
      return;
    }
    if (confirm("Are you sure you want to delete this user?")) {
      const updated = users.filter(user => user.id !== id);
      updateUsers(updated);
      toast.success("User deleted successfully");
    }
  };

  const handleEditClick = (user: User) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to edit users.");
      return;
    }
    setEditingId(user.id);
    setUserFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password || "",
      role: user.role,
      verified: user.verified,
      blocked: user.blocked,
      walletBalance: user.walletBalance || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to save users.");
      return;
    }
    if (!userFormData.name || !userFormData.email || !userFormData.phone) {
      toast.error("Please fill all fields");
      return;
    }
    
    if (editingId) {
      const updated = users.map(user => 
        user.id === editingId 
          ? { ...user, ...userFormData } as User 
          : user
      );
      updateUsers(updated);
      toast.success("User updated successfully");
    } else {
      const userToCreate: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: userFormData.name || "",
        email: userFormData.email || "",
        phone: userFormData.phone || "",
        password: userFormData.password || "",
        role: userFormData.role as User['role'] || "user",
        verified: userFormData.verified || false,
        blocked: userFormData.blocked || false,
        walletBalance: userFormData.walletBalance || 0,
        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        referralsCount: 0
      };
      updateUsers([userToCreate, ...users]);
      toast.success("User created successfully");
    }

    setIsDialogOpen(false);
    setEditingId(null);
    setUserFormData({ name: "", email: "", phone: "", password: "", role: "user", verified: false, blocked: false, walletBalance: 0 });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <ShieldCheck className="h-3 w-3" /> Management
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">User Directory</h1>
          <p className="text-slate-500 text-sm font-medium">Monitor and manage access for all registered users.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
            <Input 
              placeholder="Search Name, Email, or Phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 bg-white border-slate-200 text-slate-900 rounded-2xl focus:ring-red-600/20 focus:border-red-600/50 transition-all placeholder:text-slate-300 font-bold text-xs uppercase tracking-widest shadow-sm"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingId(null);
              setUserFormData({ name: "", email: "", phone: "", password: "", role: "user", verified: false, blocked: false, walletBalance: 0 });
            }
          }}>
            <DialogTrigger asChild>
              <Button 
                disabled={adminRole !== 'admin'} 
                onClick={() => {
                  setEditingId(null);
                  setUserFormData({ name: "", email: "", phone: "", password: "", role: "user", verified: false, blocked: false, walletBalance: 0 });
                }}
                className="h-12 px-8 bg-[#e31e24] hover:bg-[#c4191f] text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-500/20 group"
              >
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-white border-slate-200 rounded-[2.5rem] shadow-2xl p-0 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600 opacity-50" />
              <DialogHeader className="p-8 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
                    <Zap className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                      {editingId ? "Update User" : "Create New User"}
                    </DialogTitle>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                      {editingId ? `User ID: ${editingId}` : "Fill in the details below"}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                    <Input 
                      value={userFormData.name} 
                      onChange={e => setUserFormData({...userFormData, name: e.target.value})}
                      placeholder="e.g. John Doe"
                      className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-bold text-xs uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Role</label>
                    <Select 
                      value={userFormData.role} 
                      onValueChange={(val) => setUserFormData({...userFormData, role: val as User['role']})}
                    >
                      <SelectTrigger className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] focus:ring-red-600/20">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-200 text-slate-900">
                        <SelectItem value="admin" className="text-[10px] font-black uppercase tracking-widest focus:bg-red-50 focus:text-red-600">Administrator</SelectItem>
                        <SelectItem value="viewer" className="text-[10px] font-black uppercase tracking-widest focus:bg-red-50 focus:text-red-600">Viewer</SelectItem>
                        <SelectItem value="user" className="text-[10px] font-black uppercase tracking-widest focus:bg-red-50 focus:text-red-600">Standard User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                  <Input 
                    type="email"
                    value={userFormData.email} 
                    onChange={e => setUserFormData({...userFormData, email: e.target.value})}
                    placeholder="user@example.com"
                    className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-bold text-xs uppercase tracking-widest"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-red-600" />
                    <Input 
                      type="text"
                      value={userFormData.password} 
                      onChange={e => setUserFormData({...userFormData, password: e.target.value})}
                      placeholder="Set secure password"
                      className="h-12 pl-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-bold text-xs uppercase tracking-widest"
                    />
                  </div>
                  <p className="text-[9px] text-slate-400 px-1 font-bold uppercase tracking-widest">Required for Admin/Viewer login.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
                    <Input 
                      value={userFormData.phone} 
                      onChange={e => setUserFormData({...userFormData, phone: e.target.value})}
                      placeholder="+91 0000000000"
                      className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-bold text-xs uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Wallet Balance (₹)</label>
                    <Input 
                      type="number"
                      value={userFormData.walletBalance} 
                      onChange={e => setUserFormData({...userFormData, walletBalance: Number(e.target.value)})}
                      placeholder="0"
                      className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-red-600/20 focus:border-red-600/50 font-black text-xs uppercase tracking-widest"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3 group/check cursor-pointer">
                    <input 
                      type="checkbox" 
                      id="verified"
                      checked={userFormData.verified}
                      onChange={e => setUserFormData({...userFormData, verified: e.target.checked})}
                      className="h-5 w-5 rounded-lg border-slate-300 bg-white text-red-600 focus:ring-red-600/20 transition-all cursor-pointer"
                    />
                    <label htmlFor="verified" className="text-[10px] font-black text-slate-500 uppercase tracking-widest cursor-pointer group-hover/check:text-red-600 transition-colors">Verified User</label>
                  </div>
                  <div className="flex items-center gap-3 group/check cursor-pointer">
                    <input 
                      type="checkbox" 
                      id="blocked"
                      checked={userFormData.blocked}
                      onChange={e => setUserFormData({...userFormData, blocked: e.target.checked})}
                      className="h-5 w-5 rounded-lg border-slate-300 bg-white text-red-500 focus:ring-red-500/20 transition-all cursor-pointer"
                    />
                    <label htmlFor="blocked" className="text-[10px] font-black text-red-500/60 uppercase tracking-widest cursor-pointer group-hover/check:text-red-500 transition-colors">Block Access</label>
                  </div>
                </div>

                <Button className="w-full h-14 mt-4 bg-[#e31e24] hover:bg-[#c4191f] text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-500/20 group" onClick={handleSaveUser}>
                  {editingId ? "Save Changes" : "Create User"}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Users List */}
      <div className="grid grid-cols-1 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-24 text-slate-400 gap-4">
                  <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                    <UsersIcon className="h-10 w-10 opacity-20" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-900/40">No Users Found</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Try adjusting your search terms</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-white border-slate-200 shadow-sm hover:border-red-600/30 transition-all duration-500 group overflow-hidden rounded-[2rem]">
                  <CardContent className="p-0">
                    <div className="flex flex-col lg:flex-row items-center justify-between p-8 gap-8">
                      <div className="flex items-center gap-6 flex-1 w-full">
                        <div className="relative">
                          <div className="absolute inset-0 bg-red-600/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-inner relative z-10 group-hover:border-red-600/30 transition-all">
                            <UserIcon className="h-8 w-8 text-red-600" />
                            {user.blocked && (
                              <div className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full border-4 border-white flex items-center justify-center">
                                <Ban className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-red-600 transition-colors truncate max-w-[200px]">
                              {user.name}
                            </h3>
                            {user.verified && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                            <span className={cn(
                              "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border",
                              user.role === 'admin' ? "bg-red-50 text-red-600 border-red-100" : 
                              user.role === 'viewer' ? "bg-blue-50 text-blue-600 border-blue-100" : 
                              "bg-slate-50 text-slate-500 border-slate-100"
                            )}>
                              {user.role}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                              <Mail className="h-3 w-3 text-red-600" /> {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                              <Phone className="h-3 w-3 text-red-600" /> {user.phone}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] font-black text-emerald-500 uppercase tracking-widest">
                              <Wallet className="h-3 w-3" /> ₹{user.walletBalance || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 border-slate-100 pt-6 lg:pt-0">
                        <div className="flex flex-col gap-2 w-full sm:w-auto">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Change Role</span>
                          <Select 
                            value={user.role} 
                            onValueChange={(val) => handleRoleChange(user.id, val as User['role'])}
                            disabled={adminRole !== 'admin'}
                          >
                            <SelectTrigger className="w-full sm:w-36 h-11 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] focus:ring-red-600/20">
                              <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-900">
                              <SelectItem value="admin" className="text-[10px] font-black uppercase tracking-widest focus:bg-red-50 focus:text-red-600">Admin</SelectItem>
                              <SelectItem value="viewer" className="text-[10px] font-black uppercase tracking-widest focus:bg-red-50 focus:text-red-600">Viewer</SelectItem>
                              <SelectItem value="user" className="text-[10px] font-black uppercase tracking-widest focus:bg-red-50 focus:text-red-600">User</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditClick(user)}
                            disabled={adminRole !== 'admin'}
                            className="h-12 w-12 bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={adminRole !== 'admin'}
                            className="h-12 w-12 bg-white border border-slate-100 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
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
    </div>
  );
}
