import { useState } from "react";
import { useData, User } from "@/context/DataContext";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users as UsersIcon, Search, Shield, User as UserIcon, CheckCircle, XCircle, Plus, Trash2, Edit2, Ban } from "lucide-react";
import { toast } from "sonner";
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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#3b2c1f] tracking-tight uppercase">User Management</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Monitor and manage access for all platform users.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <Input 
              placeholder="Search by name, email or phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setEditingId(null);
              setUserFormData({ name: "", email: "", phone: "", role: "user", verified: false, blocked: false, walletBalance: 0 });
            }
          }}>
            <DialogTrigger asChild>
              <Button 
                disabled={adminRole !== 'admin'} 
                onClick={() => {
                  setEditingId(null);
                  setUserFormData({ name: "", email: "", phone: "", role: "user", verified: false, blocked: false, walletBalance: 0 });
                }}
                className="h-11 px-6 bg-[#1e1b18] hover:bg-primary text-white font-bold rounded-xl transition-all shadow-lg shadow-black/5"
              >
                <Plus className="mr-2 h-4 w-4" />
                Register User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-[2rem] border-none shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-[#3b2c1f] uppercase tracking-tight">
                  {editingId ? "Update User Profile" : "Register New User"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <Input 
                      value={userFormData.name} 
                      onChange={e => setUserFormData({...userFormData, name: e.target.value})}
                      placeholder="John Doe"
                      className="h-12 rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                    <Select 
                      value={userFormData.role} 
                      onValueChange={(val) => setUserFormData({...userFormData, role: val as User['role']})}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-slate-200">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="user">Standard User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <Input 
                    type="email"
                    value={userFormData.email} 
                    onChange={e => setUserFormData({...userFormData, email: e.target.value})}
                    placeholder="john@example.com"
                    className="h-12 rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Password</label>
                  <Input 
                    type="text"
                    value={userFormData.password} 
                    onChange={e => setUserFormData({...userFormData, password: e.target.value})}
                    placeholder="Set a password for admin/staff login"
                    className="h-12 rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary"
                  />
                  <p className="text-[9px] text-slate-400 ml-1">Required for users with Admin or Viewer roles to login.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <Input 
                      value={userFormData.phone} 
                      onChange={e => setUserFormData({...userFormData, phone: e.target.value})}
                      placeholder="+91 9876543210"
                      className="h-12 rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Wallet (₹)</label>
                    <Input 
                      type="number"
                      value={userFormData.walletBalance} 
                      onChange={e => setUserFormData({...userFormData, walletBalance: Number(e.target.value)})}
                      placeholder="0"
                      className="h-12 rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="verified"
                      checked={userFormData.verified}
                      onChange={e => setUserFormData({...userFormData, verified: e.target.checked})}
                      className="h-5 w-5 rounded-lg border-slate-300 text-primary focus:ring-primary transition-all cursor-pointer"
                    />
                    <label htmlFor="verified" className="text-xs font-bold text-slate-600 uppercase tracking-wide cursor-pointer">Verified Status</label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      id="blocked"
                      checked={userFormData.blocked}
                      onChange={e => setUserFormData({...userFormData, blocked: e.target.checked})}
                      className="h-5 w-5 rounded-lg border-slate-300 text-red-600 focus:ring-red-500 transition-all cursor-pointer"
                    />
                    <label htmlFor="blocked" className="text-xs font-bold text-red-600 uppercase tracking-wide cursor-pointer">Restrict Access</label>
                  </div>
                </div>

                <Button className="w-full h-14 mt-4 bg-[#1e1b18] hover:bg-primary text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-black/10" onClick={handleSaveUser}>
                  {editingId ? "Confirm Updates" : "Finalize Registration"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-200 bg-transparent shadow-none">
            <CardContent className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <UsersIcon className="h-8 w-8 text-slate-300" />
              </div>
              <p className="font-bold uppercase tracking-widest text-xs">No user records found</p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="overflow-hidden border-slate-200 hover:border-primary/30 transition-all hover:shadow-md group">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row items-center justify-between p-6 gap-6">
                  <div className="flex items-center gap-5 flex-1">
                    <div className="h-14 w-14 bg-[#1e1b18] rounded-2xl flex items-center justify-center shadow-inner relative shrink-0">
                      <UserIcon className="h-7 w-7 text-primary" />
                      {user.blocked && (
                        <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                          <Ban className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-[#3b2c1f] text-lg truncate uppercase tracking-tight">
                          {user.name}
                        </h3>
                        {user.verified && <CheckCircle className="h-4 w-4 text-emerald-500" />}
                        <span className={cn(
                          "text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest",
                          user.role === 'admin' ? "bg-primary/10 text-primary" : 
                          user.role === 'viewer' ? "bg-blue-100 text-blue-600" : 
                          "bg-slate-100 text-slate-500"
                        )}>
                          {user.role}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex flex-wrap items-center gap-y-1 gap-x-4 font-medium">
                        <span className="flex items-center gap-1.5"><Search className="h-3 w-3 opacity-40" /> {user.email}</span>
                        <span className="flex items-center gap-1.5"><UserIcon className="h-3 w-3 opacity-40" /> {user.phone}</span>
                        <span className="text-primary font-bold">Balance: ₹{user.walletBalance || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Quick Role</span>
                      <Select 
                        value={user.role} 
                        onValueChange={(val) => handleRoleChange(user.id, val as User['role'])}
                        disabled={adminRole !== 'admin'}
                      >
                        <SelectTrigger className="w-32 h-10 text-xs font-bold rounded-xl border-slate-200">
                          <SelectValue placeholder="Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEditClick(user)}
                        disabled={adminRole !== 'admin'}
                        className="h-10 w-10 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={adminRole !== 'admin'}
                        className="h-10 w-10 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
