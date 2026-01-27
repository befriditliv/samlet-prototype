import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HcoDetail from "./pages/HcoDetail";
import HcpDetail from "./pages/HcpDetail";
import Kundeoversigt from "./pages/Kundeoversigt";
import Traeningsplatform from "./pages/Traeningsplatform";
import ManagerDashboard from "./pages/ManagerDashboard";
import NewReport from "./pages/manager/NewReport";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/manager" element={<ProtectedRoute><ManagerDashboard /></ProtectedRoute>} />
            <Route path="/manager/new-report" element={<ProtectedRoute><NewReport /></ProtectedRoute>} />
            <Route path="/kundeoversigt" element={<ProtectedRoute><Kundeoversigt /></ProtectedRoute>} />
            <Route path="/traeningsplatform" element={<ProtectedRoute><Traeningsplatform /></ProtectedRoute>} />
            <Route path="/hco/:id" element={<ProtectedRoute><HcoDetail /></ProtectedRoute>} />
            <Route path="/hcp/:id" element={<ProtectedRoute><HcpDetail /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
