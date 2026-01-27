import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  children?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const DashboardCard = ({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  onClick,
  className = "" 
}: DashboardCardProps) => {
  return (
    <Card 
      className={`transition-all hover:shadow-lg cursor-pointer ${className}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="p-3 rounded-xl bg-accent">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          {description && (
            <CardDescription className="mt-1">{description}</CardDescription>
          )}
        </div>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
};
