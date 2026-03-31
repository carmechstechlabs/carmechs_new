import { useState } from "react";
import { useData, Notification, User } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Bell, Search, Filter, Trash2, CheckCircle2, 
  AlertCircle, Info, AlertTriangle, Mail, Send,
  User as UserIcon, Clock, MoreVertical, Check
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Notifications() {
  const { notifications, updateNotifications, addNotification, users, adminRole } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    userId: "all",
    title: "",
    message: "",
    type: "info" as Notification["type"]
  });

  const handleSendNotification = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to send notifications.");
      return;
    }
    if (!newNotification.title || !newNotification.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (newNotification.userId === "all") {
      // Send to all users
      users.forEach(user => {
        addNotification({
          userId: user.id,
          title: newNotification.title,
          message: newNotification.message,
          type: newNotification.type
        });
      });
      toast.success(`Notification sent to all ${users.length} users`);
    } else {
      // Send to specific user
      addNotification(newNotification);
      toast.success("Notification sent successfully");
    }

    setNewNotification({ userId: "all", title: "", message: "", type: "info" });
    setIsSendModalOpen(false);
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    updateNotifications(updated);
  };

  const deleteNotification = (id: string) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to delete notifications.");
      return;
    }
    const updated = notifications.filter(n => n.id !== id);
    updateNotifications(updated);
    toast.success("Notification deleted");
  };

  const clearAll = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to clear notifications.");
      return;
    }
    if (confirm("Are you sure you want to clear all notifications?")) {
      updateNotifications([]);
      toast.success("All notifications cleared");
    }
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         n.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || n.type === typeFilter;
    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'warning': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'error': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <Bell className="h-3 w-3" /> Communication
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Notification Center</h1>
          <p className="text-slate-500 text-sm font-medium">Manage and broadcast messages to your users.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <Button 
            onClick={() => setIsSendModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
          >
            <Send className="mr-2 h-4 w-4" /> Broadcast Message
          </Button>
          <Button 
            variant="outline"
            onClick={clearAll}
            disabled={notifications.length === 0}
            className="rounded-2xl px-6 h-12 font-black uppercase tracking-widest text-[10px] border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search notifications..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-white border-slate-200 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-slate-300 font-bold text-xs uppercase tracking-widest shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 h-12 shadow-sm">
          <Filter className="h-4 w-4 text-primary" />
          <select
            className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 focus:outline-none cursor-pointer pr-4 w-full"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="info">Information</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-24 text-slate-400 gap-4">
                  <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                    <Bell className="h-10 w-10 opacity-20" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-900/40">No Notifications</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Your inbox is empty</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredNotifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={cn(
                  "bg-white border-slate-200 shadow-sm hover:border-primary/30 transition-all duration-500 group overflow-hidden",
                  notif.read && "opacity-60"
                )}>
                  <CardContent className="p-6 flex items-center gap-6">
                    <div className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center border shrink-0",
                      getTypeStyles(notif.type)
                    )}>
                      {getTypeIcon(notif.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={cn(
                          "text-lg font-black uppercase tracking-tight truncate",
                          notif.read ? "text-slate-500" : "text-slate-900"
                        )}>
                          {notif.title}
                        </h3>
                        {!notif.read && (
                          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{notif.message}</p>
                    </div>

                    <div className="hidden md:flex items-center gap-8 shrink-0">
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recipient</span>
                        <div className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase tracking-tighter">
                          <UserIcon className="h-3 w-3 text-primary" />
                          {users.find(u => u.id === notif.userId)?.name || 'Unknown'}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sent At</span>
                        <div className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase tracking-tighter">
                          <Clock className="h-3 w-3 text-primary" />
                          {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!notif.read && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => markAsRead(notif.id)}
                            className="h-10 w-10 rounded-xl text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteNotification(notif.id)}
                          className="h-10 w-10 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <Dialog open={isSendModalOpen} onOpenChange={setIsSendModalOpen}>
        <DialogContent className="bg-white rounded-[2.5rem] border-slate-200 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Broadcast Message</DialogTitle>
            <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Send a notification to one or all users.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recipient</label>
              <Select 
                value={newNotification.userId} 
                onValueChange={(val) => setNewNotification({...newNotification, userId: val})}
              >
                <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold text-xs">
                  <SelectValue placeholder="Select Recipient" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="all">All Users</SelectItem>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.name} ({user.role})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Notification Type</label>
              <Select 
                value={newNotification.type} 
                onValueChange={(val) => setNewNotification({...newNotification, type: val as Notification["type"]})}
              >
                <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Title</label>
              <Input 
                placeholder="e.g. System Maintenance" 
                value={newNotification.title}
                onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold text-xs"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Message</label>
              <Input 
                placeholder="Enter your message here..." 
                value={newNotification.message}
                onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold text-xs"
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsSendModalOpen(false)}
              className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendNotification}
              className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
            >
              Send Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
