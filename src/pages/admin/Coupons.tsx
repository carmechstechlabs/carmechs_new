import { useState } from "react";
import { useData, Coupon } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, Search, Trash2, Edit2, Ticket, 
  Calendar, Percent, IndianRupee, CheckCircle2, 
  XCircle, Copy, Clock, Filter, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger 
} from "@/components/ui/dialog";

export function Coupons() {
  const { coupons, updateCoupons, adminRole } = useData();
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true
  });

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to modify coupons.");
      return;
    }

    if (!newCoupon.code || !newCoupon.discountValue) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let updatedCoupons: Coupon[];
    if (editingCoupon) {
      updatedCoupons = coupons.map(c => 
        c.id === editingCoupon.id ? { ...c, ...newCoupon } as Coupon : c
      );
      toast.success("Coupon updated successfully");
    } else {
      const couponToAdd: Coupon = {
        ...newCoupon as Coupon,
        id: `cpn_${Date.now()}`,
        code: newCoupon.code.toUpperCase()
      };
      updatedCoupons = [...coupons, couponToAdd];
      toast.success("Coupon created successfully");
    }

    updateCoupons(updatedCoupons);
    setIsAddDialogOpen(false);
    setEditingCoupon(null);
    setNewCoupon({
      code: "",
      discountType: "percentage",
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscount: 0,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true
    });
  };

  const handleDelete = (id: string) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to delete coupons.");
      return;
    }
    updateCoupons(coupons.filter(c => c.id !== id));
    toast.success("Coupon removed successfully");
  };

  const toggleStatus = (id: string) => {
    if (adminRole !== 'admin') return;
    updateCoupons(coupons.map(c => c.id === id ? { ...c, isActive: !c.isActive } : c));
    toast.success("Coupon status updated");
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Promotions & Coupons</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Create and manage discount codes for your customers.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingCoupon(null); setNewCoupon({ code: "", discountType: "percentage", discountValue: 0, minOrderAmount: 0, maxDiscount: 0, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], isActive: true }); }} className="bg-[#e31e24] hover:bg-[#c4191f] text-white font-bold rounded-xl shadow-xl shadow-red-500/10 h-12 px-6">
              <Plus className="h-4 w-4 mr-2" /> New Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-[2rem] border-slate-200 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-black uppercase tracking-tight">
                {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Coupon Code</label>
                <Input 
                  value={newCoupon.code} 
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  placeholder="e.g., WELCOME50"
                  className="h-12 rounded-xl font-black uppercase tracking-widest"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Discount Type</label>
                  <select 
                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 font-bold text-slate-700 outline-none"
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value as any})}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Value</label>
                  <Input 
                    type="number"
                    value={newCoupon.discountValue} 
                    onChange={(e) => setNewCoupon({...newCoupon, discountValue: parseFloat(e.target.value)})}
                    className="h-12 rounded-xl font-bold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Min Order (₹)</label>
                  <Input 
                    type="number"
                    value={newCoupon.minOrderAmount} 
                    onChange={(e) => setNewCoupon({...newCoupon, minOrderAmount: parseFloat(e.target.value)})}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Discount (₹)</label>
                  <Input 
                    type="number"
                    value={newCoupon.maxDiscount} 
                    onChange={(e) => setNewCoupon({...newCoupon, maxDiscount: parseFloat(e.target.value)})}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expiry Date</label>
                <Input 
                  type="date"
                  value={newCoupon.expiryDate} 
                  onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl">Cancel</Button>
              <Button onClick={handleSave} className="bg-[#e31e24] hover:bg-[#c4191f] text-white font-bold rounded-xl px-8">
                {editingCoupon ? "Update Coupon" : "Create Coupon"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCoupons.map((coupon) => (
            <motion.div 
              key={coupon.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative"
            >
              <Card className="rounded-[2.5rem] border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden bg-white">
                <div className="p-8">
                  <div className="flex items-start justify-between mb-8">
                    <div className="h-16 w-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-600 group-hover:scale-110 transition-all duration-500 border border-slate-100 group-hover:border-red-100">
                      <Ticket className="h-8 w-8" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => { setEditingCoupon(coupon); setNewCoupon(coupon); setIsAddDialogOpen(true); }}
                        className="h-10 w-10 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDelete(coupon.id)}
                        className="h-10 w-10 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter group-hover:text-red-600 transition-colors">
                      {coupon.code}
                    </h3>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(coupon.code); toast.success("Code copied!"); }}
                      className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mb-8">
                    <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      {coupon.discountType === 'percentage' ? <Percent className="h-3 w-3" /> : <IndianRupee className="h-3 w-3" />}
                      {coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : ''} OFF
                    </div>
                    <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Exp: {coupon.expiryDate}
                    </div>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-slate-100">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">Min Order</span>
                      <span className="text-slate-900">₹{coupon.minOrderAmount}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400">Max Discount</span>
                      <span className="text-slate-900">₹{coupon.maxDiscount || 'No Limit'}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => toggleStatus(coupon.id)}
                  className={cn(
                    "w-full py-4 text-[10px] font-black uppercase tracking-widest transition-all",
                    coupon.isActive 
                      ? "bg-emerald-500 text-white hover:bg-emerald-600" 
                      : "bg-slate-200 text-slate-500 hover:bg-slate-300"
                  )}
                >
                  {coupon.isActive ? "Active & Public" : "Disabled / Private"}
                </button>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredCoupons.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Ticket className="h-10 w-10 text-slate-200" />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No coupons found</h3>
            <p className="text-sm text-slate-500 font-medium">Create your first promotion code.</p>
          </div>
        )}
      </div>
    </div>
  );
}
