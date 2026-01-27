import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const EmployeeOverview = () => {
  const [overview, setOverview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-employee-overview');
        
        if (error) {
          console.error("Error fetching overview:", error);
          toast({
            title: "Error",
            description: "Failed to generate overview. Please try again.",
            variant: "destructive",
          });
          return;
        }

        setOverview(data.overview);
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Failed to generate overview. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, [toast]);

  return (
    <Card className="bg-gradient-to-br from-card via-card/95 to-accent/10">
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div 
            className="prose prose-slate max-w-none
              [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-foreground
              [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-foreground
              [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-foreground
              [&_p]:text-foreground [&_p]:leading-relaxed [&_p]:mb-4
              [&_ul]:space-y-2 [&_ul]:mb-4
              [&_li]:text-foreground [&_li]:leading-relaxed
              [&_strong]:font-semibold [&_strong]:text-foreground
              [&_em]:italic [&_em]:text-muted-foreground"
            dangerouslySetInnerHTML={{ 
              __html: overview
                .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
                .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.+?)\*/g, '<em>$1</em>')
                .split('\n')
                .map(line => {
                  const trimmed = line.trim();
                  if (trimmed.startsWith('# ')) return `<h1>${trimmed.substring(2)}</h1>`;
                  if (trimmed.startsWith('## ')) return `<h2>${trimmed.substring(3)}</h2>`;
                  if (trimmed.startsWith('### ')) return `<h3>${trimmed.substring(4)}</h3>`;
                  if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                    return `<li class="flex gap-2"><span class="text-primary mt-0.5">•</span><span class="flex-1">${trimmed.substring(2)}</span></li>`;
                  }
                  if (trimmed === '') return '<br/>';
                  return `<p>${trimmed}</p>`;
                })
                .join('')
                .replace(/<li/g, '<ul class="list-none pl-0"><li')
                .replace(/<\/li>(?!\s*<li)/g, '</li></ul>')
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};
