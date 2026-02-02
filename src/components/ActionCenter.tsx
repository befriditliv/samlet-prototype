import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  Clock, 
  TrendingDown, 
  ShieldAlert, 
  UserX,
  Building2,
  ChevronRight
} from "lucide-react";
import { format, subDays } from "date-fns";

type SignalSeverity = 'critical' | 'warning' | 'info';

interface SignalCard {
  id: string;
  title: string;
  description: string;
  count: number;
  severity: SignalSeverity;
  icon: React.ReactNode;
  filterParam: string;
  entityType: 'hcp' | 'hco';
}

const getSeverityColor = (severity: SignalSeverity, count: number) => {
  if (count === 0) return 'text-muted-foreground';
  switch (severity) {
    case 'critical': return 'text-destructive';
    case 'warning': return 'text-warning';
    case 'info': return 'text-primary';
  }
};

const getSeverityDot = (severity: SignalSeverity, count: number) => {
  if (count === 0) return 'bg-muted-foreground/30';
  switch (severity) {
    case 'critical': return 'bg-destructive';
    case 'warning': return 'bg-warning';
    case 'info': return 'bg-primary';
  }
};

export const ActionCenter = () => {
  const navigate = useNavigate();
  const [signals, setSignals] = useState<SignalCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSignalCounts();
  }, []);

  const fetchSignalCounts = async () => {
    setLoading(true);
    const thirtyDaysAgo = subDays(new Date(), 30);
    const sixtyDaysAgo = subDays(new Date(), 60);

    try {
      const { count: overdueCount } = await supabase
        .from('hcps')
        .select('*', { count: 'exact', head: true })
        .or(`last_meeting_date.is.null,last_meeting_date.lt.${format(thirtyDaysAgo, 'yyyy-MM-dd')}`);

      const { count: missingConsentCount } = await supabase
        .from('hcps')
        .select('*', { count: 'exact', head: true })
        .or('marketing_consent.is.null,marketing_consent.eq.false');

      const { count: highValueLowEngagementCount } = await supabase
        .from('hcps')
        .select('*', { count: 'exact', head: true })
        .in('access_level', ['Tier A', 'Tier B', 'High', 'Medium'])
        .or(`last_meeting_date.is.null,last_meeting_date.lt.${format(sixtyDaysAgo, 'yyyy-MM-dd')}`);

      const today = format(new Date(), 'yyyy-MM-dd');
      const { data: hcpsWithNextStep } = await supabase
        .from('interactions')
        .select('hcp_id')
        .gte('interaction_date', today);
      
      const hcpIdsWithNextStep = new Set((hcpsWithNextStep || []).map(i => i.hcp_id).filter(Boolean));
      
      const { count: totalHcpCount } = await supabase
        .from('hcps')
        .select('*', { count: 'exact', head: true });
      
      const noNextStepCount = (totalHcpCount || 0) - hcpIdsWithNextStep.size;

      const { count: hcoHighValueCount } = await supabase
        .from('hcos')
        .select('*', { count: 'exact', head: true })
        .in('tier', ['Tier A', 'Tier B', 'A', 'B']);

      const signalCards: SignalCard[] = [
        {
          id: 'overdue',
          title: 'Overdue for contact',
          description: '30+ days since last meeting',
          count: overdueCount || 0,
          severity: (overdueCount || 0) > 10 ? 'critical' : (overdueCount || 0) > 5 ? 'warning' : 'info',
          icon: <Clock className="h-4 w-4" />,
          filterParam: 'overdue',
          entityType: 'hcp'
        },
        {
          id: 'missing-consent',
          title: 'Missing consent',
          description: 'No marketing consent',
          count: missingConsentCount || 0,
          severity: (missingConsentCount || 0) > 20 ? 'critical' : (missingConsentCount || 0) > 10 ? 'warning' : 'info',
          icon: <ShieldAlert className="h-4 w-4" />,
          filterParam: 'missing-consent',
          entityType: 'hcp'
        },
        {
          id: 'high-value-low-engagement',
          title: 'High-value, low engagement',
          description: 'Priority HCPs inactive 60+ days',
          count: highValueLowEngagementCount || 0,
          severity: (highValueLowEngagementCount || 0) > 5 ? 'critical' : (highValueLowEngagementCount || 0) > 2 ? 'warning' : 'info',
          icon: <TrendingDown className="h-4 w-4" />,
          filterParam: 'high-value-low-engagement',
          entityType: 'hcp'
        },
        {
          id: 'no-next-step',
          title: 'No next step',
          description: 'No upcoming meetings planned',
          count: noNextStepCount > 0 ? noNextStepCount : 0,
          severity: noNextStepCount > 20 ? 'warning' : 'info',
          icon: <UserX className="h-4 w-4" />,
          filterParam: 'no-next-step',
          entityType: 'hcp'
        },
        {
          id: 'hco-high-value',
          title: 'High-value HCOs',
          description: 'Priority accounts',
          count: hcoHighValueCount || 0,
          severity: 'info',
          icon: <Building2 className="h-4 w-4" />,
          filterParam: 'high-value',
          entityType: 'hco'
        }
      ];

      const severityOrder = { critical: 0, warning: 1, info: 2 };
      signalCards.sort((a, b) => {
        if (a.count === 0 && b.count === 0) return 0;
        if (a.count === 0) return 1;
        if (b.count === 0) return -1;
        const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
        if (severityDiff !== 0) return severityDiff;
        return b.count - a.count;
      });

      setSignals(signalCards);
    } catch (error) {
      console.error('Error fetching signal counts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewList = (signal: SignalCard) => {
    navigate(`/client-overview?type=${signal.entityType}&filter=${signal.filterParam}`);
  };

  if (loading) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="py-8">
          <div className="text-center text-muted-foreground text-sm">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Signals</h2>
          <p className="text-sm text-muted-foreground">Key metrics and alerts to help you prioritize your outreach</p>
        </div>
        <button 
          onClick={() => navigate('/client-overview')}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          View all clients
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {signals.map((signal) => (
          <Card 
            key={signal.id}
            onClick={() => handleViewList(signal)}
            className="border shadow-sm hover:shadow-md transition-all cursor-pointer group bg-card"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`${getSeverityColor(signal.severity, signal.count)}`}>
                  {signal.icon}
                </div>
                {signal.count > 0 && (
                  <div className={`h-2 w-2 rounded-full ${getSeverityDot(signal.severity, signal.count)}`} />
                )}
              </div>
              
              <div className={`text-2xl font-semibold mb-1 ${getSeverityColor(signal.severity, signal.count)}`}>
                {signal.count}
              </div>
              <div className="text-sm font-medium text-foreground truncate">{signal.title}</div>
              <div className="text-xs text-muted-foreground truncate">{signal.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
