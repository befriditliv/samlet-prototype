import { Badge } from "@/components/ui/badge";
import { Building2, Mail, Phone } from "lucide-react";

interface ClientStatusCardProps {
  name: string;
  tier: "A" | "B" | "C";
  status: "active" | "at-risk" | "opportunity";
  lastContact: string;
  engagementScore: number;
}

export const ClientStatusCard = ({ 
  name, 
  tier, 
  status, 
  lastContact, 
  engagementScore 
}: ClientStatusCardProps) => {
  const getTierColor = () => {
    switch (tier) {
      case "A":
        return "bg-primary text-primary-foreground";
      case "B":
        return "bg-secondary text-secondary-foreground";
      case "C":
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success border-success/20";
      case "at-risk":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "opportunity":
        return "bg-warning/10 text-warning border-warning/20";
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{name}</h3>
            <p className="text-sm text-muted-foreground">Last contact: {lastContact}</p>
          </div>
        </div>
        <Badge className={getTierColor()}>Tier {tier}</Badge>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <Badge variant="outline" className={getStatusColor()}>
          {status.replace("-", " ")}
        </Badge>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Engagement:</span>
          <span className="font-semibold text-primary">{engagementScore}%</span>
        </div>
      </div>
    </div>
  );
};
