import { useState } from "react";
import { useData, NavigationItem } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ExternalLink, 
  Link as LinkIcon, 
  Save,
  ArrowUp,
  ArrowDown,
  Edit2,
  X
} from "lucide-react";
import { motion, Reorder } from "motion/react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NavigationManager() {
  const { navigationItems, updateNavigationItems } = useData();
  const [items, setItems] = useState<NavigationItem[]>(navigationItems);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [newItem, setNewItem] = useState<Partial<NavigationItem>>({
    label: "",
    path: "",
    isActive: true,
    isExternal: false,
  });

  const handleSave = () => {
    updateNavigationItems(items);
    toast.success("Navigation menu updated successfully");
  };

  const handleAddItem = () => {
    if (!newItem.label || !newItem.path) {
      toast.error("Label and Path are required");
      return;
    }

    const item: NavigationItem = {
      id: Math.random().toString(36).substring(2, 9),
      label: newItem.label!,
      path: newItem.path!,
      order: items.length + 1,
      isActive: newItem.isActive ?? true,
      isExternal: newItem.isExternal ?? false,
    };

    const updatedItems = [...items, item];
    setItems(updatedItems);
    setIsAdding(false);
    setNewItem({ label: "", path: "", isActive: true, isExternal: false });
    toast.success("Item added to menu");
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;

    const updatedItems = items.map(item => 
      item.id === editingItem.id ? editingItem : item
    );
    setItems(updatedItems);
    setEditingItem(null);
    toast.success("Item updated");
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    // Re-order remaining items
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      order: index + 1
    }));
    setItems(reorderedItems);
    toast.success("Item removed from menu");
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    
    // Update order property
    const reorderedItems = newItems.map((item, idx) => ({
      ...item,
      order: idx + 1
    }));
    
    setItems(reorderedItems);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Navigation Menu</h1>
          <p className="text-slate-500 text-sm">Manage your website's main navigation links.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl font-bold uppercase tracking-wider text-[10px] h-10"
            onClick={() => setItems(navigationItems)}
          >
            Reset Changes
          </Button>
          <Button 
            className="rounded-xl font-bold uppercase tracking-wider text-[10px] h-10 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
            onClick={handleSave}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Menu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50">
              <CardTitle className="text-sm font-black uppercase tracking-wider">Menu Structure</CardTitle>
              <CardDescription className="text-xs">Drag and drop to reorder or use the arrows.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Reorder.Group axis="y" values={items} onReorder={setItems} className="divide-y divide-slate-50">
                {items.map((item, index) => (
                  <Reorder.Item 
                    key={item.id} 
                    value={item}
                    className="p-4 flex items-center gap-4 bg-white hover:bg-slate-50/50 transition-colors group"
                  >
                    <div className="cursor-grab active:cursor-grabbing text-slate-300 group-hover:text-slate-400">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{item.label}</span>
                        {!item.isActive && (
                          <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded">Hidden</span>
                        )}
                        {item.isExternal && (
                          <ExternalLink className="h-3 w-3 text-slate-400" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">{item.path}</div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10"
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10"
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === items.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => setEditingItem(item)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
              
              {items.length === 0 && (
                <div className="p-12 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                    <LinkIcon className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-bold text-slate-400">No menu items yet.</p>
                  <Button 
                    variant="link" 
                    className="text-primary font-bold text-xs"
                    onClick={() => setIsAdding(true)}
                  >
                    Add your first link
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Add Item Form */}
          <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50">
              <CardTitle className="text-sm font-black uppercase tracking-wider">
                {editingItem ? "Edit Item" : "Add Menu Item"}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Label</Label>
                <Input 
                  placeholder="e.g. Services" 
                  className="rounded-xl font-bold h-11"
                  value={editingItem ? editingItem.label : newItem.label}
                  onChange={(e) => editingItem 
                    ? setEditingItem({...editingItem, label: e.target.value})
                    : setNewItem({...newItem, label: e.target.value})
                  }
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Path / URL</Label>
                <Input 
                  placeholder="e.g. /services or https://..." 
                  className="rounded-xl font-bold h-11"
                  value={editingItem ? editingItem.path : newItem.path}
                  onChange={(e) => editingItem 
                    ? setEditingItem({...editingItem, path: e.target.value})
                    : setNewItem({...newItem, path: e.target.value})
                  }
                />
                <p className="text-[9px] text-slate-400 font-medium italic">Use /#id for section links (e.g. /#brands)</p>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-0.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900">Active</Label>
                  <p className="text-[9px] text-slate-500 font-medium">Show in navigation</p>
                </div>
                <Switch 
                  checked={editingItem ? editingItem.isActive : newItem.isActive}
                  onCheckedChange={(checked) => editingItem 
                    ? setEditingItem({...editingItem, isActive: checked})
                    : setNewItem({...newItem, isActive: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="space-y-0.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-900">External</Label>
                  <p className="text-[9px] text-slate-500 font-medium">Open in new tab</p>
                </div>
                <Switch 
                  checked={editingItem ? editingItem.isExternal : newItem.isExternal}
                  onCheckedChange={(checked) => editingItem 
                    ? setEditingItem({...editingItem, isExternal: checked})
                    : setNewItem({...newItem, isExternal: checked})
                  }
                />
              </div>

              <div className="pt-2 flex gap-2">
                {editingItem ? (
                  <>
                    <Button 
                      variant="outline" 
                      className="flex-1 rounded-xl font-bold uppercase tracking-wider text-[10px] h-11"
                      onClick={() => setEditingItem(null)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="flex-1 rounded-xl font-bold uppercase tracking-wider text-[10px] h-11 bg-primary hover:bg-primary/90 text-white"
                      onClick={handleUpdateItem}
                    >
                      Update
                    </Button>
                  </>
                ) : (
                  <Button 
                    className="w-full rounded-xl font-bold uppercase tracking-wider text-[10px] h-11 bg-primary hover:bg-primary/90 text-white"
                    onClick={handleAddItem}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Menu
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-slate-900 text-white">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Pro Tip
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-slate-400 space-y-2 leading-relaxed">
              <p>Reordering items here will immediately reflect in the main website header once you click <span className="text-white font-bold">Save Menu</span>.</p>
              <p>Keep the menu concise (5-7 items max) for the best user experience on mobile and desktop.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
