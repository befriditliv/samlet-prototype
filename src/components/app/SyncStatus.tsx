import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebriefQueue } from "@/hooks/useDebriefQueue";

export const SyncStatus = () => {
  const { queue, pendingCount, isOnline, retryFailed } = useDebriefQueue();

  // Don't show anything if queue is empty
  if (pendingCount === 0 && queue.length === 0) return null;

  const hasSubmitting = queue.some(q => q.status === 'submitting');
  const hasFailed = queue.some(q => q.status === 'failed');
  const hasPending = queue.some(q => q.status === 'pending');

  // Determine indicator color and animation
  const getIndicatorStyle = () => {
    if (!isOnline) return "bg-muted-foreground";
    if (hasFailed) return "bg-destructive";
    if (hasSubmitting) return "bg-primary animate-pulse";
    if (hasPending) return "bg-primary/60";
    return "bg-green-500";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 hover:bg-muted active:scale-95 transition-all">
          {/* Status icon */}
          {hasSubmitting ? (
            <Loader2 className="h-3 w-3 animate-spin text-primary" />
          ) : hasFailed ? (
            <AlertCircle className="h-3 w-3 text-destructive" />
          ) : (
            <span className={`block w-2 h-2 rounded-full ${getIndicatorStyle()}`} />
          )}
          {/* Count */}
          <span className="text-[10px] font-medium text-muted-foreground">
            {pendingCount}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="end">
        <div className="p-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Synchronization</h4>
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isOnline ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div className="p-2 max-h-60 overflow-y-auto">
          {queue.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">No pending items</p>
          ) : (
            <div className="space-y-1">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {item.status === 'submitting' && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    )}
                    {item.status === 'pending' && (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-primary/40" />
                    )}
                    {item.status === 'submitted' && (
                      <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    )}
                    {item.status === 'failed' && (
                      <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      Meeting debrief
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {item.status === 'submitting' && 'Sending...'}
                      {item.status === 'pending' && 'Waiting'}
                      {item.status === 'submitted' && 'Sent'}
                      {item.status === 'failed' && 'Failed'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {hasFailed && (
          <div className="p-2 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={retryFailed}
              className="w-full h-8 text-xs rounded-lg"
            >
              Try again
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
