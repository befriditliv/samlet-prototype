import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface QueuedDebrief {
  id: string;
  meetingId: string;
  data: any;
  timestamp: number;
  status: 'pending' | 'submitting' | 'submitted' | 'failed';
}

export const useDebriefQueue = () => {
  const [queue, setQueue] = useState<QueuedDebrief[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  // Load queue from localStorage on mount
  useEffect(() => {
    const savedQueue = localStorage.getItem('debriefQueue');
    if (savedQueue) {
      setQueue(JSON.parse(savedQueue));
    }
  }, []);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('debriefQueue', JSON.stringify(queue));
  }, [queue]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back online",
        description: "Syncing pending debriefs...",
      });
      processQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Debriefs will be saved and synced when you're back online",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Process queue when online
  const processQueue = async () => {
    if (!isOnline) return;

    const pendingItems = queue.filter(item => item.status === 'pending');

    for (const item of pendingItems) {
      try {
        setQueue(prev => prev.map(q =>
          q.id === item.id ? { ...q, status: 'submitting' } : q
        ));

        // Simulate API call - replace with actual submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        setQueue(prev => prev.map(q =>
          q.id === item.id ? { ...q, status: 'submitted' } : q
        ));

        toast({
          title: "Debrief submitted",
          description: `Meeting debrief synced to IOengage`,
        });

        // Remove submitted items after a delay
        setTimeout(() => {
          setQueue(prev => prev.filter(q => q.id !== item.id));
        }, 3000);

      } catch (error) {
        setQueue(prev => prev.map(q =>
          q.id === item.id ? { ...q, status: 'failed' } : q
        ));

        toast({
          title: "Sync failed",
          description: "Will retry when connection is stable",
          variant: "destructive",
        });
      }
    }
  };

  // Add debrief to queue
  const addToQueue = (meetingId: string, data: any) => {
    const newItem: QueuedDebrief = {
      id: `debrief-${Date.now()}`,
      meetingId,
      data,
      timestamp: Date.now(),
      status: isOnline ? 'submitting' : 'pending',
    };

    setQueue(prev => [...prev, newItem]);

    if (isOnline) {
      processQueue();
    } else {
      toast({
        title: "Saved offline",
        description: "Debrief will sync when you're back online",
      });
    }
  };

  // Retry failed items
  const retryFailed = () => {
    setQueue(prev => prev.map(item =>
      item.status === 'failed' ? { ...item, status: 'pending' } : item
    ));
    processQueue();
  };

  const pendingCount = queue.filter(q => q.status === 'pending' || q.status === 'submitting').length;

  return {
    queue,
    pendingCount,
    isOnline,
    addToQueue,
    retryFailed,
  };
};
