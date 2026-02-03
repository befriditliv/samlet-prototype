import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { ArrowRight } from "lucide-react";
import jarvisLogo from "@/assets/jarvis-logo.svg";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [email, setEmail] = useState("");
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (selectedRole) {
      setRole(selectedRole as UserRole);
      if (selectedRole === "manager") {
        navigate("/manager");
      } else if (selectedRole === "key_account_manager_app") {
        navigate("/app");
      } else {
        navigate("/");
      }
    }
  };

  const handleSSO = () => {
    if (selectedRole) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="w-full px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">J</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground mb-3">
              Welcome back
            </h1>
            <p className="text-muted-foreground">
              Sign in to Jarvis
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* SSO Button */}
            <Button
              onClick={handleSSO}
              variant="outline"
              className="w-full h-12 rounded-xl border-border/60 bg-background hover:bg-accent/50 font-medium transition-all duration-200"
              disabled={!selectedRole}
            >
              Continue with SSO
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-3">
              <div className="flex-1 h-px bg-border/60" />
              <span className="text-muted-foreground text-xs uppercase tracking-wider">or</span>
              <div className="flex-1 h-px bg-border/60" />
            </div>

            {/* Email Input */}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 rounded-xl border-border/60 bg-background px-4 text-base focus-visible:ring-1 focus-visible:ring-primary/50"
            />

            {/* Role Selector */}
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full h-12 rounded-xl border-border/60 bg-background px-4 focus:ring-1 focus:ring-primary/50">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/60">
                <SelectItem value="key_account_manager" className="rounded-lg">
                  Key Account Manager (Web)
                </SelectItem>
                <SelectItem value="key_account_manager_app" className="rounded-lg">
                  Key Account Manager (App)
                </SelectItem>
                <SelectItem value="manager" className="rounded-lg">
                  Manager
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Sign In Button */}
            <Button 
              onClick={handleLogin} 
              className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-foreground/90 font-medium transition-all duration-200"
              disabled={!selectedRole}
            >
              Sign in
            </Button>
          </div>

          {/* Footer Note */}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Role selection is for prototype navigation only
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-8 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          Jarvis Key Account Manager
        </p>
      </footer>
    </div>
  );
};

export default Login;
