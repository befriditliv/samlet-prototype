import { useState } from "react";
import { cn } from "@/lib/utils";
import { useInViewOnce } from "@/hooks/use-in-view";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plus,
  CalendarIcon,
  Users,
  MessageSquare,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { toast } from "sonner";
import { format, subDays } from "date-fns";
import { da } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ReportType = 'general' | 'market-concerns' | 'general-themes' | 'initiation-barriers' | 'competitor-insights' | 'custom';

interface SavedReport {
  id: string;
  title: string;
  createdAt: Date;
  dateRange: { from: Date; to: Date };
  employee: string;
  product: string;
  type: ReportType;
  summary: string;
}

// Mock data for saved reports
const mockReports: SavedReport[] = [
  {
    id: "1",
    title: "Ozempic Initiation Barriers",
    createdAt: new Date("2025-12-18T13:08:28"),
    dateRange: { from: subDays(new Date(), 30), to: new Date() },
    employee: "all",
    product: "ozempic",
    type: "initiation-barriers",
    summary: "A decline in Ozempic initiation has been observed, indicating hesitancy among GPs regarding dosing protocols.",
  },
  {
    id: "2",
    title: "Weekly Team Activity Summary",
    createdAt: new Date("2025-12-15T09:32:00"),
    dateRange: { from: subDays(new Date(), 7), to: new Date() },
    employee: "all",
    product: "all",
    type: "general",
    summary: "Team completed 142 HCP touchpoints this week, with strong focus on cardiology specialists.",
  },
];

export const InsightTools = () => {
  const [reports, setReports] = useState<SavedReport[]>(mockReports);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;

  const { ref: toolsRef, inView: toolsInView } = useInViewOnce<HTMLDivElement>({
    threshold: 0.15,
    rootMargin: "0px 0px -10% 0px",
  });

  const deleteReport = (id: string) => {
    setReports(prev => prev.filter(r => r.id !== id));
    toast.success('Report deleted');
  };

  const totalPages = Math.ceil(reports.length / reportsPerPage);
  const paginatedReports = reports.slice(
    (currentPage - 1) * reportsPerPage,
    currentPage * reportsPerPage
  );

  const getReportTypeLabel = (type: ReportType) => {
    switch (type) {
      case 'general': return 'General Analysis';
      case 'market-concerns': return 'Market Concerns';
      case 'general-themes': return 'General Themes';
      case 'initiation-barriers': return 'Initiation Barriers';
      case 'competitor-insights': return 'Competitor Insights';
      case 'custom': return 'Custom';
    }
  };

  return (
    <Card
      ref={toolsRef}
      className={cn(
        "border-0 bg-gradient-to-br from-card to-card/80 shadow-sm overflow-hidden",
        toolsInView && "animate-fade-in"
      )}
    >
      <CardContent className="pt-6 space-y-4">
        {/* Header with New Report button */}
        <div className="flex items-center justify-end">
          <Button 
            asChild
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all duration-300"
          >
            <Link to="/manager/new-report">
              <Plus className="h-4 w-4" />
              New Report
            </Link>
          </Button>
        </div>

        {/* Reports Table */}
        <div className="rounded-xl border-0 overflow-hidden bg-muted/20">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border/50">
                <TableHead className="py-4 px-5 w-[200px]">
                  <div className="text-sm font-semibold text-foreground">Created</div>
                  <div className="text-xs font-normal text-muted-foreground">Date & time</div>
                </TableHead>
                <TableHead className="py-4 px-5 w-[140px]">
                  <div className="text-sm font-semibold text-foreground">Filters</div>
                  <div className="text-xs font-normal text-muted-foreground">Applied</div>
                </TableHead>
                <TableHead className="py-4 px-5">
                  <div className="text-sm font-semibold text-foreground">Report</div>
                  <div className="text-xs font-normal text-muted-foreground">Title & summary</div>
                </TableHead>
                <TableHead className="py-4 px-5 text-right w-[140px]">
                  <div className="text-sm font-semibold text-foreground">Actions</div>
                  <div className="text-xs font-normal text-muted-foreground">View / Delete</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedReports.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                      <p>No reports yet. Click "New Report" to create one.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedReports.map((report, idx) => (
                  <TableRow
                    key={report.id}
                    className={cn(
                      "group hover:bg-muted/30 transition-colors border-b border-border/30 last:border-b-0",
                      toolsInView && "animate-fade-in"
                    )}
                    style={toolsInView ? { animationDelay: `${idx * 50}ms` } : undefined}
                  >
                    <TableCell className="py-4 px-5">
                      <span className="font-medium text-foreground">{format(report.createdAt, "yyyy-MM-dd")}</span>
                      <span className="text-muted-foreground ml-2 text-sm">{format(report.createdAt, "HH:mm")}</span>
                    </TableCell>
                    <TableCell className="py-4 px-5">
                      <TooltipProvider>
                        <div className="flex items-center gap-1.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors cursor-default group-hover:bg-primary/10">
                                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="animate-scale-in">
                              <p>{format(report.dateRange.from, "d. MMM", { locale: da })} - {format(report.dateRange.to, "d. MMM yyyy", { locale: da })}</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors cursor-default group-hover:bg-primary/10">
                                <Users className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="animate-scale-in">
                              <p>{report.employee === 'all' ? 'All users' : report.employee}</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="p-2 rounded-full bg-muted/50 hover:bg-muted transition-colors cursor-default group-hover:bg-primary/10">
                                <MessageSquare className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="animate-scale-in">
                              <p>{getReportTypeLabel(report.type)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="max-w-md py-4 px-5">
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{report.title}</p>
                        <p className="truncate text-sm text-muted-foreground">{report.summary}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-4 px-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-all duration-200"
                          onClick={() => deleteReport(report.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted transition-colors"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted transition-colors"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted transition-colors"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-muted transition-colors"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
