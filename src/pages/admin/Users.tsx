import { useState } from "react";
import { useData, User } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users as UsersIcon, Search, Shield, User as UserIcon, CheckCircle, XCircle, Plus, Trash2 } from "lucide-react";
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
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    phone: "",
    role: "user",
    verified: false,
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
    const updated = users.filter(user => user.id !== id);
    updateUsers(updated);
    toast.success("User deleted successfully");
  };

  const handleCreateUser = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to create users.");
      return;
    }
    if (!newUser.name || !newUser.email || !newUser.phone) {
      toast.error("Please fill all fields");
      return;
    }
    
    const userToCreate: User = {
      id: Math.random().toString(36).substring(2, 9),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role as User['role'],
      verified: newUser.verified || false,
    };

    updateUsers([userToCreate, ...users]);
    toast.success("User created successfully");
    setIsDialogOpen(false);
    setNewUser({ name: "", email: "", phone: "", role: "user", verified: false });
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Manage Users</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={adminRole !== 'admin'}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input 
                    value={newUser.name} 
                    onChange={e => setNewUser({...newUser, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    type="email"
                    value={newUser.email} 
                    onChange={e => setNewUser({...newUser, email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input 
                    value={newUser.phone} 
                    onChange={e => setNewUser({...newUser, phone: e.target.value})}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role</label>
                  <Select 
                    value={newUser.role} 
                    onValueChange={(val) => setNewUser({...newUser, role: val as User['role']})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input 
                    type="checkbox" 
                    id="verified"
                    checked={newUser.verified}
                    onChange={e => setNewUser({...newUser, verified: e.target.checked})}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="verified" className="text-sm font-medium">Verified User</label>
                </div>
                <Button className="w-full mt-4" onClick={handleCreateUser}>
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-slate-500">
              <UsersIcon className="h-12 w-12 text-slate-300 mb-4" />
              <p>No users found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-center justify-between p-6">
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                    <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-slate-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {user.name}
                        {user.verified && <CheckCircle className="h-4 w-4 text-green-500" />}
                      </h3>
                      <div className="text-sm text-slate-500 flex flex-col sm:flex-row sm:gap-4">
                        <span>{user.email}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{user.phone}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-slate-400" />
                      <Select 
                        value={user.role} 
                        onValueChange={(val) => handleRoleChange(user.id, val as User['role'])}
                        disabled={adminRole !== 'admin'}
                      >
                        <SelectTrigger className="w-32 h-9 text-sm">
                          <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="user">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={adminRole !== 'admin'}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
