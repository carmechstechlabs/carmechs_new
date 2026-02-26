import { useState, ChangeEvent } from "react";
import { useData, Service } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";

export function Services() {
  const { services, updateServices, adminRole } = useData();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({});

  const handleEdit = (service: Service) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to edit services.");
      return;
    }
    setEditingId(service.id);
    setFormData(service);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to delete services.");
      return;
    }
    if (confirm("Are you sure you want to delete this service?")) {
      updateServices(services.filter(s => s.id !== id));
      toast.success("Service deleted successfully");
    }
  };

  const handleSave = () => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to save services.");
      return;
    }
    if (!formData.title || !formData.price || !formData.basePrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newService: Service = {
      id: editingId || formData.id || Date.now().toString(),
      title: formData.title || "",
      description: formData.description || "",
      price: formData.price || "",
      basePrice: Number(formData.basePrice) || 0,
      duration: formData.duration || "",
      iconUrl: formData.iconUrl || "",
      features: Array.isArray(formData.features) 
        ? formData.features 
        : (formData.features as string || "").split(',').map(s => s.trim()).filter(Boolean),
      checks: Array.isArray(formData.checks) 
        ? formData.checks 
        : (formData.checks as string || "").split(',').map(s => s.trim()).filter(Boolean),
    };

    if (editingId) {
      updateServices(services.map(s => s.id === editingId ? newService : s));
      toast.success("Service updated successfully");
    } else {
      updateServices([...services, newService]);
      toast.success("Service added successfully");
    }

    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  const handleIconUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 512 * 1024) { // 512KB limit
        toast.error("Icon size should be less than 512KB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, iconUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Manage Services</h1>
        <Button 
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({}); }}
          disabled={adminRole !== 'admin'}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </div>

      {(isAdding || editingId) && (
        <Card className="mb-8 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle>{editingId ? "Edit Service" : "Add New Service"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Service Title</label>
                <Input 
                  placeholder="Service Title" 
                  value={formData.title || ""} 
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Price (Display)</label>
                <Input 
                  placeholder="Price (Display)" 
                  value={formData.price || ""} 
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Base Price (Numeric)</label>
                <Input 
                  placeholder="Base Price (Numeric)" 
                  type="number"
                  value={formData.basePrice || ""} 
                  onChange={e => setFormData({...formData, basePrice: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration</label>
                <Input 
                  placeholder="Duration" 
                  value={formData.duration || ""} 
                  onChange={e => setFormData({...formData, duration: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Service Icon</label>
                <div className="flex items-center gap-4">
                  {formData.iconUrl && (
                    <div className="h-12 w-12 bg-white rounded border flex items-center justify-center overflow-hidden">
                      <img src={formData.iconUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                    </div>
                  )}
                  <div className="relative flex-1">
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={handleIconUpload}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                <p className="text-xs text-slate-500">Max size 512KB. SVG or transparent PNG recommended.</p>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea 
                placeholder="Description" 
                value={formData.description || ""} 
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Features (comma separated)</label>
              <Textarea 
                placeholder="Features (comma separated)" 
                value={Array.isArray(formData.features) ? formData.features.join(", ") : (formData.features || "")} 
                onChange={e => setFormData({...formData, features: e.target.value as any})}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setIsAdding(false); setEditingId(null); }}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Service
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {services.map((service) => (
          <Card key={service.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                {service.iconUrl && (
                  <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img src={service.iconUrl} alt={service.title} className="max-h-full max-w-full object-contain" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold">{service.title}</h3>
                  <p className="text-sm text-slate-500">{service.description}</p>
                  <div className="mt-2 flex gap-4 text-sm">
                    <span className="font-semibold text-primary">{service.price}</span>
                    <span className="text-slate-400">•</span>
                    <span>{service.duration}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => handleEdit(service)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={() => handleDelete(service.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
