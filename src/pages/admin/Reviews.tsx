import { useState } from "react";
import { useData, Review } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Star, Search, Trash2, CheckCircle2, 
  XCircle, Filter, MessageSquare, User,
  Calendar, Eye, EyeOff, ShieldCheck
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

export function Reviews() {
  const { reviews, updateReviews, adminRole } = useData();
  const [search, setSearch] = useState("");
  const [filterRating, setFilterRating] = useState("all");

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.userName.toLowerCase().includes(search.toLowerCase()) || 
                         r.comment.toLowerCase().includes(search.toLowerCase());
    const matchesRating = filterRating === "all" || r.rating.toString() === filterRating;
    return matchesSearch && matchesRating;
  });

  const handleDelete = (id: string) => {
    if (adminRole !== 'admin') {
      toast.error("You don't have permission to delete reviews.");
      return;
    }
    updateReviews(reviews.filter(r => r.id !== id));
    toast.success("Review deleted successfully");
  };

  const togglePublish = (id: string) => {
    if (adminRole !== 'admin') return;
    updateReviews(reviews.map(r => r.id === id ? { ...r, isPublished: !r.isPublished } : r));
    toast.success("Review visibility updated");
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Customer Reviews</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Monitor and manage feedback from your customers.</p>
        </div>
        
        <div className="flex items-center gap-4 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={cn(
                  "h-4 w-4",
                  star <= Number(averageRating) ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                )} 
              />
            ))}
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">
            {averageRating} <span className="text-slate-400">/ 5.0</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Reviews</p>
                <p className="text-2xl font-black text-slate-900">{reviews.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Published</p>
                <p className="text-2xl font-black text-slate-900">{reviews.filter(r => r.isPublished).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-slate-200 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Awaiting Review</p>
                <p className="text-2xl font-black text-slate-900">{reviews.filter(r => !r.isPublished).length}</p>
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
              placeholder="Search reviews..." 
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
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((review) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 hover:bg-slate-50/50 transition-all group"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 uppercase tracking-tight">{review.userName}</h4>
                          <div className="flex items-center gap-1 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={cn(
                                  "h-3 w-3",
                                  star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-200"
                                )} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="text-slate-600 font-medium leading-relaxed mb-6 italic">
                      "{review.comment}"
                    </p>

                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                        review.isPublished ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                      )}>
                        {review.isPublished ? "Published" : "Pending Approval"}
                      </span>
                      {review.serviceId && (
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-widest">
                          Service: {review.serviceId}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex lg:flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      onClick={() => togglePublish(review.id)}
                      variant="outline"
                      className={cn(
                        "h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all",
                        review.isPublished ? "hover:bg-amber-50 hover:text-amber-600" : "hover:bg-emerald-50 hover:text-emerald-600"
                      )}
                    >
                      {review.isPublished ? (
                        <><EyeOff className="h-4 w-4 mr-2" /> Unpublish</>
                      ) : (
                        <><Eye className="h-4 w-4 mr-2" /> Publish</>
                      )}
                    </Button>
                    <Button 
                      onClick={() => handleDelete(review.id)}
                      variant="ghost"
                      className="h-12 px-6 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-[10px]"
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredReviews.length === 0 && (
            <div className="py-20 text-center">
              <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-10 w-10 text-slate-200" />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">No reviews found</h3>
              <p className="text-sm text-slate-500 font-medium">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
