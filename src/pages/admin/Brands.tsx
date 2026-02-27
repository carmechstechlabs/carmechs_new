import { useState, ChangeEvent } from "react";
import { useData, Brand } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Save, X, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "@/components/ImageUpload";

export function Brands() {
  const { brands, updateBrands, adminRole } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Brand>>({});

  const handleEdit = (brand: Brand) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to edit brands.");
      return;
    }
    setEditingId(brand.id);
    setFormData(brand);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to delete brands.");
      return;
    }
    if (confirm("Are you sure you want to delete this brand?")) {
      updateBrands(brands.filter(b => b.id !== id));
      toast.success("Brand deleted successfully");
    }
  };

  const handleSave = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to save brands.");
      return;
    }
    if (!formData.name || !formData.imageUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newBrand: Brand = {
      id: editingId || Date.now().toString(),
      name: formData.name || "",
      imageUrl: formData.imageUrl || "",
    };

    if (editingId) {
      updateBrands(brands.map(b => b.id === editingId ? newBrand : b));
      toast.success("Brand updated successfully");
    } else {
      updateBrands([...brands, newBrand]);
      toast.success("Brand added successfully");
    }

    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Manage Brands</h1>
        <Button 
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({}); }}
          disabled={adminRole !== 'admin'}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Brand
        </Button>
      </div>

      {(isAdding || editingId) && (
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Brand" : "Add New Brand"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand Name</label>
                <Input 
                  placeholder="Brand Name (e.g. Toyota)" 
                  value={formData.name || ""} 
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand Logo</label>
                <ImageUpload 
                  value={formData.imageUrl || ""}
                  onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                />
                <p className="text-xs text-slate-500 mt-2">Max size 5MB. Transparent PNG recommended.</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setIsAdding(false); setEditingId(null); }}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Brand
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.map((brand) => (
          <Card key={brand.id} className="hover:shadow-md transition-shadow overflow-hidden">
            <CardContent className="p-0">
              <div className="h-32 bg-slate-50 flex items-center justify-center p-6 border-b">
                <img src={brand.imageUrl} alt={brand.name} className="max-h-full max-w-full object-contain" />
              </div>
              <div className="p-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{brand.name}</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(brand)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(brand.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {brands.length === 0 && (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500">No brands added yet. Click "Add Brand" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
