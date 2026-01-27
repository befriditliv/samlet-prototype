import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FilterCategory {
  label: string;
  items: { name: string; count: number }[];
}

interface DataFiltersProps {
  categories: FilterCategory[];
}

export const DataFilters = ({ categories }: DataFiltersProps) => {
  // Calculate max count across all items for relative sizing
  const maxCount = Math.max(
    ...categories.flatMap(cat => cat.items.map(item => item.count))
  );

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Data for all discovered insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.label} className="space-y-3">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {category.label}
              </h4>
              <div className="space-y-2">
                {category.items.map((item) => {
                  const widthPercent = Math.max((item.count / maxCount) * 100, 15);
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-foreground font-medium truncate max-w-[70%]">
                          {item.name}
                        </span>
                        <span className="text-muted-foreground text-xs shrink-0">
                          {item.count}
                        </span>
                      </div>
                      <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-500"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
