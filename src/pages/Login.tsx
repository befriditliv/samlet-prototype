import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Building2, Mail } from "lucide-react";
import jarvisLogo from "@/assets/jarvis-logo.svg";
const Login = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const {
    setRole
  } = useAuth();
  const navigate = useNavigate();
  const handleLogin = () => {
    if (selectedRole) {
      setRole(selectedRole as UserRole);
      if (selectedRole === "manager") {
        navigate("/manager");
      } else if (selectedRole === "key_account_manager_app") {
        navigate("/");
      } else {
        navigate("/");
      }
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 flex flex-col items-center justify-center p-6">
      {/* Subtle branded accent line at top */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60 origin-left animate-[scaleX_1s_ease-out_forwards]" style={{ transform: 'scaleX(0)' }} />
      
      <Card className="w-full max-w-md shadow-xl border-t-0 overflow-hidden animate-fade-in">
        <div className="h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/60 origin-left animate-[scaleX_1s_ease-out_forwards]" style={{ transform: 'scaleX(0)', animationDelay: '0.3s', animationFillMode: 'forwards' }} />
        <CardHeader className="text-center space-y-4 pb-2">
          <div className="flex justify-center">
            <div className="p-3 rounded-2xl bg-primary/5 transition-transform duration-500 hover:scale-105">
              <img src={jarvisLogo} alt="Jarvis Logo" className="h-16 w-16" />
            </div>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            <CardTitle className="text-2xl font-bold">Welcome to Jarvis</CardTitle>
            <CardDescription className="mt-1">Key Account Manager Platform</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-4">
          {/* SSO Button */}
          <Button variant="outline" className="w-full h-12 gap-3 font-medium transition-all duration-200 hover:shadow-md hover:border-primary/50 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }} onClick={() => {}}>
            <Building2 className="h-5 w-5" />
            Sign in with SSO
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          {/* Email Sign-in Toggle */}
          {!showEmailLogin ? <Button variant="ghost" className="w-full gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200" onClick={() => setShowEmailLogin(true)}>
              <Mail className="h-4 w-4" />
              Sign in with email
            </Button> : <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <Input type="email" placeholder="Enter your email" className="h-11 transition-all duration-200 focus:shadow-md" />
              <Input type="password" placeholder="Enter your password" className="h-11 transition-all duration-200 focus:shadow-md" />
            </div>}

          {/* Demo Role Selector */}
          <div className="pt-2 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-dashed" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">Demo Access</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Select role</label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-full h-11">
                  <SelectValue placeholder="Choose a demo role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="key_account_manager">Key Account Manager (Web)</SelectItem>
                  <SelectItem value="key_account_manager_app">Key Account Manager (App)</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleLogin} className="w-full h-11 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]" disabled={!selectedRole}>
              Continue as Demo User
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <footer className="mt-8 text-center space-y-1 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Oda ApS. All rights reserved.
        </p>
        <p className="text-[10px] text-muted-foreground/60 flex items-center justify-center gap-1.5">
          Crafted with
          <span className="inline-block animate-pulse text-primary">♥</span>
          by the Oda Team
        </p>
      </footer>
    </div>;
};
export default Login;