import { useState } from "react";
import { useData, Testimonial } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Trash2, Edit2, Star, Quote, User, Car, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const { testimonials, updateTestimonials, adminRole } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTestimonial, setNewTestimonial] = useState({
    author: "",
    role: "",
    content: "",
    rating: 5,
    carModel: "",
    image: ""
  });
  const [editTestimonial, setEditTestimonial] = useState({
    author: "",
    role: "",
    content: "",
    rating: 5,
    carModel: "",
    image: ""
  });

  const filteredTestimonials = testimonials.filter(t => 
    t.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.carModel?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!newTestimonial.author.trim() || !newTestimonial.content.trim()) {
      toast.error("Author and Content are required");
      return;
    }
    const testimonial: Testimonial = {
      id: Math.random().toString(36).substring(2, 9),
      ...newTestimonial,
      createdAt: new Date().toISOString()
    };
    updateTestimonials([...testimonials, testimonial]);
    setNewTestimonial({
      author: "",
      role: "",
      content: "",
      rating: 5,
      carModel: "",
      image: ""
    });
    setIsAdding(false);
    toast.success("Testimonial added successfully");
  };

  const handleUpdate = (id: string) => {
    if (!editTestimonial.author.trim() || !editTestimonial.content.trim()) {
      toast.error("Author and Content are required");
      return;
    }
    const updated = testimonials.map(t => 
      t.id === id ? { ...t, ...editTestimonial } : t
    );
    updateTestimonials(updated);
    setEditingId(null);
    toast.success("Testimonial updated successfully");
  };

  const handleDelete = (id: string) => {
    if (adminRole !== 'admin') {
      toast.error("Permission denied");
      return;
    }
    updateTestimonials(testimonials.filter(t => t.id !== id));
    toast.success("Testimonial removed");
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <Quote className="h-3 w-3" /> Social Proof
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Testimonials</h1>
          <p className="text-slate-500 text-sm font-medium">Manage customer feedback and success stories.</p>
        </div>
        
        <Button 
          onClick={() => setIsAdding(true)}
          className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-primary/20 group"
        >
          <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
          Add Testimonial
        </Button>
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="SEARCH FEEDBACK..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-16 pl-14 bg-white border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest shadow-sm"
          />
        </div>
        <Card className="bg-white border-slate-100 shadow-sm rounded-2xl flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Stories</p>
            <p className="text-2xl font-black text-slate-900">{testimonials.length}</p>
          </div>
        </Card>
      </div>

      {/* Add New Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-white border-primary/20 shadow-2xl rounded-[2.5rem] overflow-hidden">
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Author Name</label>
                    <Input 
                      value={newTestimonial.author}
                      onChange={(e) => setNewTestimonial({...newTestimonial, author: e.target.value})}
                      placeholder="E.G. RAHUL SHARMA"
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Role / Title</label>
                    <Input 
                      value={newTestimonial.role}
                      onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})}
                      placeholder="E.G. CEO, TECH LABS"
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Car Model</label>
                    <Input 
                      value={newTestimonial.carModel}
                      onChange={(e) => setNewTestimonial({...newTestimonial, carModel: e.target.value})}
                      placeholder="E.G. BMW M5 COMPETITION"
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Testimonial Content</label>
                  <Textarea 
                    value={newTestimonial.content}
                    onChange={(e) => setNewTestimonial({...newTestimonial, content: e.target.value})}
                    placeholder="WRITE THE SUCCESS STORY HERE..."
                    className="min-h-[120px] bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-medium text-sm p-6"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Rating (1-5)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewTestimonial({...newTestimonial, rating: star})}
                          className={cn(
                            "h-12 w-12 rounded-xl flex items-center justify-center transition-all",
                            newTestimonial.rating >= star ? "bg-primary text-white" : "bg-slate-50 text-slate-300 hover:bg-slate-100"
                          )}
                        >
                          <Star className={cn("h-5 w-5", newTestimonial.rating >= star && "fill-white")} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Author Image URL</label>
                    <Input 
                      value={newTestimonial.image}
                      onChange={(e) => setNewTestimonial({...newTestimonial, image: e.target.value})}
                      placeholder="HTTPS://..."
                      className="h-14 bg-slate-50 border-slate-100 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 font-black text-sm uppercase tracking-widest"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsAdding(false)} className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] border-slate-200">Cancel</Button>
                  <Button onClick={handleAdd} className="h-14 px-8 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">Publish Story</Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className={cn(
              "bg-white border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 rounded-[2rem] overflow-hidden group h-full flex flex-col",
              editingId === testimonial.id && "ring-2 ring-primary/50 border-transparent"
            )}>
              <CardContent className="p-8 flex flex-col h-full">
                {editingId === testimonial.id ? (
                  <div className="space-y-4">
                    <Input 
                      value={editTestimonial.author}
                      onChange={(e) => setEditTestimonial({...editTestimonial, author: e.target.value})}
                      className="h-10 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest"
                      placeholder="AUTHOR"
                    />
                    <Input 
                      value={editTestimonial.role}
                      onChange={(e) => setEditTestimonial({...editTestimonial, role: e.target.value})}
                      className="h-10 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest"
                      placeholder="ROLE"
                    />
                    <Input 
                      value={editTestimonial.carModel}
                      onChange={(e) => setEditTestimonial({...editTestimonial, carModel: e.target.value})}
                      className="h-10 bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest"
                      placeholder="CAR MODEL"
                    />
                    <Textarea 
                      value={editTestimonial.content}
                      onChange={(e) => setEditTestimonial({...editTestimonial, content: e.target.value})}
                      className="min-h-[100px] bg-slate-50 border-slate-100 text-slate-900 rounded-xl font-medium text-xs p-4"
                      placeholder="CONTENT"
                    />
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={() => handleUpdate(testimonial.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 font-black uppercase tracking-widest text-[9px]">Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)} className="flex-1 rounded-xl h-10 font-black uppercase tracking-widest text-[9px]">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                        ))}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingId(testimonial.id);
                            setEditTestimonial({ 
                              author: testimonial.author,
                              role: testimonial.role,
                              content: testimonial.content,
                              rating: testimonial.rating,
                              carModel: testimonial.carModel || "",
                              image: testimonial.image || ""
                            });
                          }}
                          className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(testimonial.id)}
                          className="p-2 hover:bg-primary/5 rounded-lg text-slate-400 hover:text-primary transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-slate-600 font-medium leading-relaxed mb-8 flex-1 italic">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                      <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                        {testimonial.image ? (
                          <img src={testimonial.image} alt={testimonial.author} className="h-full w-full object-cover" />
                        ) : (
                          <User className="h-6 w-6 text-slate-300" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">{testimonial.author}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{testimonial.role}</p>
                        {testimonial.carModel && (
                          <div className="flex items-center gap-1.5 mt-1 text-[9px] font-black text-primary uppercase tracking-widest">
                            <Car className="h-3 w-3" /> {testimonial.carModel}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
          <Quote className="h-12 w-12 text-slate-200 mx-auto mb-4" />
          <p className="text-sm font-black text-slate-300 uppercase tracking-widest">No testimonials found matching your search</p>
        </div>
      )}
    </div>
  );
}
