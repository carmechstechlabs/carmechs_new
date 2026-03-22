import { useState } from "react";
import { useData, Coupon } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Ticket, Plus, Search, Edit2, Trash2, 
  Calendar, IndianRupee, Percent, 
  CheckCircle2, XCircle, Loader2, X,
  Zap, Sparkles, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function Coupons() {
  const { coupons, addCoupon, deleteCoupon, updateCoupons, adminRole } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newCoupon, setNewCoupon] = useState<Omit<Coupon, 'id' | 'isActive'>>({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCoupon = () => {
    if (!newCoupon.code) {
      toast.error("Please enter a coupon code");
      return;
    }
    addCoupon(newCoupon);
    setIsAdding(false);
    setNewCoupon({
      code: "",
      discountType: "percentage",
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscount: 0,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    toast.success("Coupon created successfully");
  };

  const handleToggleActive = (coupon: Coupon) => {
    const updated = coupons.map(c => 
      c.id === coupon.id ? { ...c, isActive: !c.isActive } : c
    );
    updateCoupons(updated);
    toast.success(`Coupon ${!coupon.isActive ? 'activated' : 'deactivated'}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <Ticket className="h-3 w-3" /> Marketing
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Coupon Codes</h1>
          <p className="text-slate-500 text-sm font-medium">Create and manage promotional discounts for your services.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full lg:w-auto">
          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex-1 lg:flex-none">
            <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input 
              placeholder="Search coupons..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-none bg-transparent shadow-none focus-visible:ring-0 font-bold text-slate-900 placeholder:text-slate-300 uppercase tracking-widest text-xs w-full lg:w-48"
            />
          </div>
          <Button 
            onClick={() => setIsAdding(true)}
            className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> New Coupon
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCoupons.map((coupon) => (
            <motion.div
              key={coupon.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className={cn(
                "group relative overflow-hidden border-slate-200 hover:border-primary/20 transition-all duration-500 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-primary/5",
                !coupon.isActive && "opacity-60"
              )}>
                <div className={cn(
                  "absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2 transition-colors",
                  coupon.discountType === 'percentage' ? "bg-primary/10" : "bg-emerald-500/10"
                )} />
                
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                          coupon.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-400 border-slate-200"
                        )}>
                          {coupon.isActive ? "Active" : "Inactive"}
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
                          {coupon.discountType === 'percentage' ? 'Percentage' : 'Fixed'}
                        </div>
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mt-4 group-hover:text-primary transition-colors">
                        {coupon.code}
                      </h3>
                    </div>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleToggleActive(coupon)}
                        className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm"
                      >
                        {coupon.isActive ? <XCircle className="h-4 w-4 text-slate-400" /> : <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteCoupon(coupon.id)}
                        className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8 pt-4 space-y-6">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Discount</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Min Order</p>
                      <p className="text-sm font-black text-slate-900">₹{coupon.minOrderAmount}</p>
                    </div>
                    {coupon.maxDiscount && (
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Max Discount</p>
                        <p className="text-sm font-black text-slate-900">₹{coupon.maxDiscount}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/20 blur-2xl rounded-full" />
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex-1">
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Valid Until</p>
                      <p className="text-xs font-black uppercase tracking-tight">{new Date(coupon.expiryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add Coupon Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden border border-slate-200"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                    <Ticket className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">New Protocol</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Define discount parameters</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Coupon Code</label>
                  <Input 
                    placeholder="E.G. SUMMER20"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                    className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-black tracking-[0.2em] text-center"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Type</label>
                    <select 
                      value={newCoupon.discountType}
                      onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value as any})}
                      className="w-full h-12 bg-slate-50 border border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest px-4 outline-none"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Value</label>
                    <Input 
                      type="number"
                      value={newCoupon.discountValue}
                      onChange={(e) => setNewCoupon({...newCoupon, discountValue: Number(e.target.value)})}
                      className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Min Order (₹)</label>
                    <Input 
                      type="number"
                      value={newCoupon.minOrderAmount}
                      onChange={(e) => setNewCoupon({...newCoupon, minOrderAmount: Number(e.target.value)})}
                      className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Max Discount (₹)</label>
                    <Input 
                      type="number"
                      value={newCoupon.maxDiscount}
                      onChange={(e) => setNewCoupon({...newCoupon, maxDiscount: Number(e.target.value)})}
                      className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Expiry Date</label>
                  <Input 
                    type="date"
                    value={newCoupon.expiryDate}
                    onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                    className="h-12 bg-slate-50 border-slate-100 text-slate-900 rounded-xl focus:ring-primary/20 focus:border-primary/50 font-bold text-xs uppercase tracking-widest"
                  />
                </div>
              </div>

              <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                <Button 
                  variant="ghost" 
                  className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200" 
                  onClick={() => setIsAdding(false)}
                >
                  Abort
                </Button>
                <Button 
                  className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20" 
                  onClick={handleAddCoupon}
                >
                  Deploy Coupon
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
