import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Car, Fuel, Wrench } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Cars() {
  const { carMakes, carModels, fuelTypes, updateCarMakes, updateCarModels, updateFuelTypes, adminRole } = useData();
  const [activeTab, setActiveTab] = useState<'makes' | 'models' | 'fuels'>('makes');
  const [newItem, setNewItem] = useState("");
  const [newMultiplier, setNewMultiplier] = useState("1.0");
  const [newYear, setNewYear] = useState("");
  const [selectedMake, setSelectedMake] = useState("");
  const [editingItem, setEditingItem] = useState<{ originalName: string, name: string, multiplier: string, make?: string, year?: string } | null>(null);

  const handleAdd = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to add items.");
      return;
    }
    if (!newItem) return;
    
    const multiplier = parseFloat(newMultiplier);
    if (isNaN(multiplier)) {
      toast.error("Please enter a valid multiplier");
      return;
    }

    if (activeTab === 'models' && !selectedMake) {
      toast.error("Please select a car make");
      return;
    }

    if (activeTab === 'makes') {
      updateCarMakes([...carMakes, { name: newItem, multiplier }]);
    } else if (activeTab === 'models') {
      updateCarModels([...carModels, { name: newItem, multiplier, make: selectedMake, year: newYear }]);
    } else {
      updateFuelTypes([...fuelTypes, { name: newItem, multiplier }]);
    }
    
    setNewItem("");
    setNewMultiplier("1.0");
    setNewYear("");
    toast.success("Item added successfully");
  };

  const handleUpdate = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to update items.");
      return;
    }
    if (!editingItem || !editingItem.name) return;

    const multiplier = parseFloat(editingItem.multiplier);
    if (isNaN(multiplier)) {
      toast.error("Please enter a valid multiplier");
      return;
    }

    if (activeTab === 'models' && !editingItem.make) {
      toast.error("Please select a car make");
      return;
    }

    if (activeTab === 'makes') {
      const updatedItem = { name: editingItem.name, multiplier };
      updateCarMakes(carMakes.map(item => item.name === editingItem.originalName ? updatedItem : item));
    } else if (activeTab === 'models') {
      const updatedItem = { name: editingItem.name, multiplier, make: editingItem.make!, year: editingItem.year };
      updateCarModels(carModels.map(item => item.name === editingItem.originalName ? updatedItem : item));
    } else {
      const updatedItem = { name: editingItem.name, multiplier };
      updateFuelTypes(fuelTypes.map(item => item.name === editingItem.originalName ? updatedItem : item));
    }

    setEditingItem(null);
    toast.success("Item updated successfully");
  };

  const handleDelete = (itemName: string) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to delete items.");
      return;
    }
    if (confirm(`Delete ${itemName}?`)) {
      if (activeTab === 'makes') {
        updateCarMakes(carMakes.filter(m => m.name !== itemName));
        // Also delete associated models? Or keep them? Let's keep them for now but maybe warn.
      } else if (activeTab === 'models') {
        updateCarModels(carModels.filter(m => m.name !== itemName));
      } else {
        updateFuelTypes(fuelTypes.filter(m => m.name !== itemName));
      }
      toast.success("Item deleted successfully");
    }
  };

  const startEditing = (item: any) => {
    setEditingItem({
      originalName: item.name,
      name: item.name,
      multiplier: item.multiplier.toString(),
      make: item.make,
      year: item.year || ""
    });
  };

  const [searchTerm, setSearchTerm] = useState("");

  const tabs = [
    { id: 'makes', label: 'Car Makes', icon: Car, data: carMakes },
    { id: 'models', label: 'Car Models', icon: Wrench, data: carModels },
    { id: 'fuels', label: 'Fuel Types', icon: Fuel, data: fuelTypes },
  ];

  const filteredData = tabs.find(t => t.id === activeTab)?.data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Manage Car Data</h1>

      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b border-slate-200 pb-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setEditingItem(null); setSearchTerm(""); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? "bg-primary text-white" 
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <Input 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      {/* Add/Edit Form */}
      <Card className={editingItem ? "border-primary/50 bg-primary/5" : ""}>
        <CardHeader>
          <CardTitle>{editingItem ? "Edit Item" : `Add New ${activeTab === 'makes' ? 'Make' : activeTab === 'models' ? 'Model' : 'Fuel Type'}`}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input 
                placeholder={`Enter name...`}
                value={editingItem ? editingItem.name : newItem}
                onChange={(e) => editingItem ? setEditingItem({...editingItem, name: e.target.value}) : setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (editingItem ? handleUpdate() : handleAdd())}
              />
            </div>
            
            {activeTab === 'models' && (
              <div className="w-48">
                <label className="text-sm font-medium mb-1 block">Car Make</label>
                <Select 
                  value={editingItem ? editingItem.make : selectedMake} 
                  onValueChange={(val) => editingItem ? setEditingItem({...editingItem, make: val}) : setSelectedMake(val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Make" />
                  </SelectTrigger>
                  <SelectContent>
                    {carMakes.map((make) => (
                      <SelectItem key={make.name} value={make.name}>{make.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === 'models' && (
              <div className="w-32">
                <label className="text-sm font-medium mb-1 block">Year</label>
                <Input 
                  placeholder="e.g. 2020"
                  value={editingItem ? (editingItem.year || "") : newYear}
                  onChange={(e) => editingItem ? setEditingItem({...editingItem, year: e.target.value}) : setNewYear(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (editingItem ? handleUpdate() : handleAdd())}
                />
              </div>
            )}

            <div className="w-32">
              <label className="text-sm font-medium mb-1 block">Multiplier</label>
              <Input 
                type="number"
                step="0.1"
                placeholder="1.0"
                value={editingItem ? editingItem.multiplier : newMultiplier}
                onChange={(e) => editingItem ? setEditingItem({...editingItem, multiplier: e.target.value}) : setNewMultiplier(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (editingItem ? handleUpdate() : handleAdd())}
              />
            </div>
            {editingItem ? (
              <div className="flex gap-2">
                <Button onClick={handleUpdate}>Update</Button>
                <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
              </div>
            ) : (
              <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" /> Add
              </Button>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Multiplier affects the service price. 1.0 is standard price, 1.5 is 50% more, etc.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((item, index) => (
          <Card key={index} className="hover:shadow-sm transition-shadow">
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <span className="font-medium block">{item.name}</span>
                {activeTab === 'models' && (
                  <span className="text-xs text-slate-500 block">
                    Make: {(item as any).make} {(item as any).year ? `| Year: ${(item as any).year}` : ''}
                  </span>
                )}
                <span className="text-xs text-slate-500">Multiplier: {item.multiplier}x</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => startEditing(item)}>
                  <Edit2 className="h-4 w-4 text-slate-500" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(item.name)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredData.length === 0 && (
          <div className="col-span-full text-center py-8 text-slate-500">
            No items found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}
