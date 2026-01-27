import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HcoDetail from "./pages/HcoDetail";
import HcpDetail from "./pages/HcpDetail";
import Kundeoversigt from "./pages/Kundeoversigt";
import Traeningsplatform from "./pages/Traeningsplatform";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/kundeoversigt" element={<Kundeoversigt />} />
          <Route path="/traeningsplatform" element={<Traeningsplatform />} />
          <Route path="/hco/:id" element={<HcoDetail />} />
          <Route path="/hcp/:id" element={<HcpDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
