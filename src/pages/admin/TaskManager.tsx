import { useState, useEffect } from "react";
import { useData, Task } from "@/context/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, Circle, Clock, AlertCircle, 
  Plus, Search, Filter, ArrowUpDown, Trash2,
  Calendar, User, MoreVertical, CheckCircle,
  AlertTriangle, Bell
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

export function TaskManager() {
  const { tasks, updateTasks, addTask, users, adminRole, addNotification } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"alphabetical" | "dueDate" | "priority">("dueDate");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium" as Task["priority"],
    assignedTo: ""
  });

  // Check for upcoming deadlines (24h)
  useEffect(() => {
    const checkDeadlines = () => {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      
      tasks.forEach(task => {
        if (!task.completed) {
          const dueDate = new Date(task.dueDate);
          if (dueDate > now && dueDate <= tomorrow) {
            // Check if we already notified (simulated by checking if notification exists in state would be better but let's just toast for now)
            // In a real app, we'd store 'notified' flag on task
          }
        }
      });
    };

    checkDeadlines();
    const interval = setInterval(checkDeadlines, 3600000); // Check every hour
    return () => clearInterval(interval);
  }, [tasks]);

  const handleAddTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }
    addTask(newTask);
    setNewTask({ title: "", description: "", dueDate: "", priority: "medium", assignedTo: "" });
    setIsAddModalOpen(false);
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    updateTasks(updated);
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      toast.success("Task completed!");
    }
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    updateTasks(updated);
    toast.success("Task deleted");
  };

  const clearCompleted = () => {
    const updated = tasks.filter(t => !t.completed);
    updateTasks(updated);
    setIsClearConfirmOpen(false);
    toast.success("Cleared all completed tasks");
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "completed" ? task.completed : !task.completed);
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    if (sortBy === "alphabetical") return a.title.localeCompare(b.title);
    if (sortBy === "dueDate") return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    if (sortBy === "priority") {
      const priorityMap = { high: 0, medium: 1, low: 2 };
      return priorityMap[a.priority] - priorityMap[b.priority];
    }
    return 0;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-400 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <Bell className="h-3 w-3" /> Productivity
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Task Manager</h1>
          <p className="text-slate-500 text-sm font-medium">Coordinate internal operations and staff assignments.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 h-12 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
          >
            <Plus className="mr-2 h-4 w-4" /> Create Task
          </Button>
          <Button 
            variant="outline"
            onClick={() => setIsClearConfirmOpen(true)}
            disabled={!tasks.some(t => t.completed)}
            className="rounded-2xl px-6 h-12 font-black uppercase tracking-widest text-[10px] border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear Completed
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search tasks..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-white border-slate-200 text-slate-900 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-slate-300 font-bold text-xs uppercase tracking-widest shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 h-12 shadow-sm">
          <Filter className="h-4 w-4 text-primary" />
          <select
            className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 focus:outline-none cursor-pointer pr-4 w-full"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 h-12 shadow-sm">
          <AlertCircle className="h-4 w-4 text-primary" />
          <select
            className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 focus:outline-none cursor-pointer pr-4 w-full"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-4 h-12 shadow-sm">
          <ArrowUpDown className="h-4 w-4 text-primary" />
          <select
            className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 focus:outline-none cursor-pointer pr-4 w-full"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="alphabetical">Sort A-Z</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="flex flex-col items-center justify-center py-24 text-slate-400 gap-4">
                  <div className="h-20 w-20 rounded-[2rem] bg-slate-50 flex items-center justify-center border border-slate-100 shadow-inner">
                    <CheckCircle2 className="h-10 w-10 opacity-20" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-900/40">No Tasks Found</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Everything is up to date</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => {
              const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
              const isUpcoming = !task.completed && new Date(task.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={cn(
                    "bg-white border-slate-200 shadow-sm hover:border-primary/30 transition-all duration-500 group overflow-hidden",
                    task.completed && "opacity-60 grayscale-[0.5]"
                  )}>
                    <CardContent className="p-6 flex items-center gap-6">
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center border transition-all shrink-0",
                          task.completed 
                            ? "bg-emerald-500 border-emerald-500 text-white" 
                            : "bg-slate-50 border-slate-200 text-slate-300 hover:border-primary hover:text-primary"
                        )}
                      >
                        {task.completed ? <CheckCircle className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className={cn(
                            "text-lg font-black uppercase tracking-tight truncate",
                            task.completed ? "text-slate-400 line-through" : "text-slate-900"
                          )}>
                            {task.title}
                          </h3>
                          <span className={cn(
                            "px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                            getPriorityColor(task.priority)
                          )}>
                            {task.priority}
                          </span>
                          {isOverdue && (
                            <span className="px-2 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                              <AlertTriangle className="h-2.5 w-2.5" /> Overdue
                            </span>
                          )}
                          {isUpcoming && !isOverdue && (
                            <span className="px-2 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" /> Due Soon
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium truncate">{task.description}</p>
                      </div>

                      <div className="hidden md:flex items-center gap-8 shrink-0">
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Due Date</span>
                          <div className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase tracking-tighter">
                            <Calendar className="h-3 w-3 text-primary" />
                            {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                        
                        {task.assignedTo && (
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assigned To</span>
                            <div className="flex items-center gap-2 text-[11px] font-black text-slate-700 uppercase tracking-tighter">
                              <User className="h-3 w-3 text-primary" />
                              {users.find(u => u.id === task.assignedTo)?.name || 'Unknown'}
                            </div>
                          </div>
                        )}

                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteTask(task.id)}
                          className="h-10 w-10 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Add Task Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="bg-white rounded-[2.5rem] border-slate-200 shadow-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">New Task</DialogTitle>
            <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Create a new operational task for the team.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Task Title</label>
              <Input 
                placeholder="e.g. Inventory Audit" 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold text-xs"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</label>
              <Input 
                placeholder="Brief details about the task..." 
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</label>
                <Input 
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold text-xs"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(val) => setNewTask({...newTask, priority: val as Task["priority"]})}
                >
                  <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assign To</label>
              <Select 
                value={newTask.assignedTo} 
                onValueChange={(val) => setNewTask({...newTask, assignedTo: val})}
              >
                <SelectTrigger className="h-12 bg-slate-50 border-slate-100 rounded-2xl font-bold text-xs">
                  <SelectValue placeholder="Select Staff" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  {users.filter(u => u.role !== 'user').map(user => (
                    <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddTask}
              className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
            >
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Confirmation Modal */}
      <Dialog open={isClearConfirmOpen} onOpenChange={setIsClearConfirmOpen}>
        <DialogContent className="bg-white rounded-[2.5rem] border-slate-200 shadow-2xl max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Clear Tasks?</DialogTitle>
            <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">This will permanently remove all completed tasks from the list.</DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsClearConfirmOpen(false)}
              className="flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px]"
            >
              Keep Them
            </Button>
            <Button 
              onClick={clearCompleted}
              className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-rose-200"
            >
              Clear All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
