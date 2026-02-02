import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, TrendingUp, Clock, Download, AlertTriangle, CheckCircle, Calendar, User, Brain, Sparkles } from "lucide-react";

interface TaskCenterProps {
  onClose: () => void;
}

interface Task {
  id: string;
  type: "schedule" | "follow-up" | "engagement" | "opportunity";
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  hcpName?: string;
  category?: string;
  daysOverdue?: number;
  actionLabel: string;
  context?: string;
}

const mockTasks: Task[] = [
  {
    id: "1",
    type: "schedule",
    priority: "high",
    title: "Schedule Meeting with Category A Client",
    description: "Dr. Patricia Williams (Cardiology) - Last interaction 89 days ago",
    hcpName: "Dr. Patricia Williams",
    category: "Category A",
    daysOverdue: 89,
    actionLabel: "Schedule Meeting",
    context: "High-value client, overdue for engagement"
  },
  {
    id: "2",
    type: "follow-up",
    priority: "high",
    title: "Follow-up on Study Download",
    description: "Dr. James Martinez downloaded cardiovascular outcomes study yesterday",
    hcpName: "Dr. James Martinez",
    actionLabel: "Schedule Follow-up",
    context: "Downloaded: Cardiovascular Outcomes Study"
  },
  {
    id: "3",
    type: "engagement",
    priority: "medium",
    title: "Re-engage Dormant High-Access HCP",
    description: "Dr. Lisa Thompson - High access level, no interaction in 67 days",
    hcpName: "Dr. Lisa Thompson",
    daysOverdue: 67,
    actionLabel: "Reach Out",
    context: "High access level, potentially valuable"
  },
  {
    id: "4",
    type: "opportunity",
    priority: "medium",
    title: "New Study Opportunity",
    description: "Recent diabetes study relevant to Dr. Kumar's patient population",
    hcpName: "Dr. Raj Kumar",
    actionLabel: "Share Study",
    context: "Endocrinology - Diabetes focus"
  },
  {
    id: "5",
    type: "schedule",
    priority: "low",
    title: "Quarterly Check-in Due",
    description: "Dr. Smith - Routine quarterly meeting is due next week",
    hcpName: "Dr. Smith",
    actionLabel: "Schedule Meeting",
    context: "Routine maintenance"
  }
];

const taskTypeConfig = {
  schedule: {
    icon: Calendar,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  "follow-up": {
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  engagement: {
    icon: User,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10"
  },
  opportunity: {
    icon: Download,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  }
};

const priorityConfig = {
  high: {
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    label: "High Priority"
  },
  medium: {
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    label: "Medium Priority"
  },
  low: {
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    label: "Low Priority"
  }
};

export const TaskCenter = ({ onClose }: TaskCenterProps) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const handleCompleteTask = (taskId: string) => {
    setCompletedTasks(prev => [...prev, taskId]);
  };

  const activeTasks = tasks.filter(task => !completedTasks.includes(task.id));
  const highPriorityCount = activeTasks.filter(task => task.priority === "high").length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent"></div>

          <div className="relative flex items-center justify-between p-6 border-b border-border/50">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="h-2.5 w-2.5 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">AI Task Center</h2>
                <p className="text-sm text-muted-foreground">
                  {activeTasks.length} active tasks • {highPriorityCount} high priority
                </p>
              </div>
            </div>
            <Button onClick={onClose} variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0 hover:bg-destructive/10 hover:text-destructive transition-all duration-200">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(85vh-180px)] bg-gradient-to-b from-background to-background/50">
          {activeTasks.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-scale-in">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">All caught up!</h3>
              <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Your AI assistant has analyzed all your data and found no urgent tasks at the moment.
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {activeTasks.map((task, index) => {
                const typeConfig = taskTypeConfig[task.type];
                const priorityConf = priorityConfig[task.priority];
                const TypeIcon = typeConfig.icon;

                return (
                  <div
                    key={task.id}
                    className="group border border-border/50 rounded-xl p-5 hover:border-primary/30 hover:shadow-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-background hover:to-accent/5 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start justify-between gap-5">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`relative w-12 h-12 ${typeConfig.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                          <TypeIcon className={`h-5 w-5 ${typeConfig.color}`} />
                          {task.priority === "high" && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {task.title}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityConf.bgColor} ${priorityConf.color} border border-current/20`}>
                              {priorityConf.label}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{task.description}</p>

                          <div className="flex items-center gap-4 text-xs">
                            {task.context && (
                              <div className="flex items-center gap-1.5 text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md">
                                <AlertTriangle className="h-3 w-3" />
                                <span>{task.context}</span>
                              </div>
                            )}

                            {task.daysOverdue && (
                              <div className="flex items-center gap-1.5 text-orange-500 bg-orange-500/10 px-2 py-1 rounded-md border border-orange-500/20">
                                <Clock className="h-3 w-3" />
                                <span className="font-medium">{task.daysOverdue} days overdue</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-primary/20 hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          {task.actionLabel}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10"></div>
          <div className="relative p-5 border-t border-border/50 bg-accent/20">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Tasks are generated by AI based on your interaction history, HCP data, and business priorities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
