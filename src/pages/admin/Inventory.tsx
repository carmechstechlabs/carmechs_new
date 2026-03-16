import { useState } from "react";
import { useData, InventoryItem } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, Search, Trash2, Edit2, Package, 
  AlertTriangle, CheckCircle2, XCircle, Filter,
  ArrowUpDown, Download, IndianRupee, Tag
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger 
} from "@/components/ui/dialog";

export function Inventory() {
  const { inventory, updateInventory, adminRole } = useData();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: "",
    sku: "",
    category: "",
    quantity: 0,
    minQuantity: 5,
    price: 0,
    status: "in_stock"
  });

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                         item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(inventory.map(item => item.category)));

  const handleSave = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to modify inventory.");
      return;
    }

    if (!newItem.name || !newItem.sku || !newItem.category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    let updatedInventory: InventoryItem[];
    if (editingItem) {
      updatedInventory = inventory.map(item => 
        item.id === editingItem.id ? { ...item, ...newItem } as InventoryItem : item
      );
      toast.success("Item updated successfully");
    } else {
      const itemToAdd: InventoryItem = {
        ...newItem as InventoryItem,
        id: `inv_${Date.now()}`,
        status: (newItem.quantity || 0) <= 0 ? 'out_of_stock' : 
                (newItem.quantity || 0) <= (newItem.minQuantity || 5) ? 'low_stock' : 'in_stock'
      };
      updatedInventory = [...inventory, itemToAdd];
      toast.success("Item added to inventory");
    }

    updateInventory(updatedInventory);
    setIsAddDialogOpen(false);
    setEditingItem(null);
    setNewItem({
      name: "",
      sku: "",
      category: "",
      quantity: 0,
      minQuantity: 5,
      price: 0,
      status: "in_stock"
    });
  };

  const handleDelete = (id: string) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to delete items.");
      return;
    }
    updateInventory(inventory.filter(item => item.id !== id));
    toast.success("Item removed from inventory");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-emerald-100 text-emerald-600';
      case 'low_stock': return 'bg-amber-100 text-amber-600';
      case 'out_of_stock': return 'bg-primary/10 text-primary';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Inventory Management</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Track and manage your spare parts and supplies.</p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="outline" className="rounded-xl border-slate-200 font-bold uppercase tracking-widest text-[10px]">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingItem(null); setNewItem({ name: "", sku: "", category: "", quantity: 0, minQuantity: 5, price: 0, status: "in_stock" }); }} className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-xl shadow-primary/10 h-12 px-6">
                <Plus className="h-4 w-4 mr-2" /> Add New Item
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2rem] border-slate-200 max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-black uppercase tracking-tight">
                  {editingItem ? "Edit Inventory Item" : "Add New Item"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Name</label>
                  <Input 
                    value={newItem.name} 
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="e.g., Synthetic Engine Oil"
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">SKU / Part Number</label>
                    <Input 
                      value={newItem.sku} 
                      onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                      placeholder="SKU-12345"
                      className="h-12 rounded-xl font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                    <Input 
                      value={newItem.category} 
                      onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                      placeholder="e.g., Consumables"
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Quantity</label>
                    <Input 
                      type="number"
                      value={newItem.quantity} 
                      onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value)})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Min Qty</label>
                    <Input 
                      type="number"
                      value={newItem.minQuantity} 
                      onChange={(e) => setNewItem({...newItem, minQuantity: parseInt(e.target.value)})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                    <Input 
                      type="number"
                      value={newItem.price} 
                      onChange={(e) => setNewItem({...newItem, price: parseFloat(e.target.value)})}
                      className="h-12 rounded-xl"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl">Cancel</Button>
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-8">
                  {editingItem ? "Update Item" : "Add Item"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Items</p>
                <p className="text-2xl font-black text-slate-900">{inventory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Low Stock</p>
                <p className="text-2xl font-black text-slate-900">{inventory.filter(i => i.status === 'low_stock').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                <XCircle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Out of Stock</p>
                <p className="text-2xl font-black text-slate-900">{inventory.filter(i => i.status === 'out_of_stock').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <IndianRupee className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Value</p>
                <p className="text-2xl font-black text-slate-900">
                  ₹{inventory.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-white overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by name or SKU..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 rounded-xl border-slate-200 bg-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 h-12 bg-white border border-slate-200 rounded-xl">
              <Filter className="h-4 w-4 text-slate-400" />
              <select 
                className="bg-transparent text-xs font-bold uppercase tracking-widest outline-none"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Level</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredInventory.map((item) => (
                  <motion.tr 
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">{item.sku}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                        <Tag className="h-3 w-3" /> {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full max-w-[100px] overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              item.quantity <= item.minQuantity ? "bg-amber-500" : "bg-emerald-500"
                            )}
                            style={{ width: `${Math.min((item.quantity / (item.minQuantity * 3)) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{item.quantity} units</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-black text-slate-900">₹{item.price.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                        getStatusColor(item.status)
                      )}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => { setEditingItem(item); setNewItem(item); setIsAddDialogOpen(true); }}
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(item.id)}
                          className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredInventory.length === 0 && (
            <div className="py-20 text-center">
              <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <Package className="h-10 w-10 text-slate-200" />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No items found</h3>
              <p className="text-sm text-slate-500 font-medium">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
