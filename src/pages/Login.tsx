import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { ArrowRight, Mail, ChevronDown } from "lucide-react";
import jarvisLogo from "@/assets/jarvis-logo.svg";
import loginBg from "@/assets/jarvis-login-bg.jpg";

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
    // Mock SSO - just show a message or proceed with role selection
    if (selectedRole) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${loginBg})` }}
      />
      
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#003d7a]/30 via-[#005AC8]/20 to-[#003d7a]/40" />

      {/* Jarvis Logo - Top Right */}
      <div className="absolute top-6 right-6 z-10">
        <div className="bg-primary rounded-lg p-2">
          <img src={jarvisLogo} alt="Jarvis" className="h-8 w-8 invert brightness-0" />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center">
        {/* Tagline */}
        <h1 className="text-4xl md:text-5xl font-light text-white text-center mb-12 leading-tight">
          <span className="font-bold">Helping</span> you<br />
          <span className="font-bold">succeed</span> everyday
        </h1>

        {/* Login Card */}
        <div className="w-full space-y-4">
          {/* SSO Button */}
          <Button
            onClick={handleSSO}
            variant="outline"
            className="w-full h-12 bg-white/95 hover:bg-white text-foreground border-0 rounded-full font-medium shadow-lg"
          >
            Sign in using SSO
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-white/30" />
            <span className="text-white/70 text-sm">or</span>
            <div className="flex-1 h-px bg-white/30" />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="your.email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 pl-12 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-white/60 rounded-full focus:bg-white/30"
            />
          </div>

          {/* Role Selector - For Prototype */}
          <div className="relative">
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full h-12 bg-white/20 backdrop-blur-sm border-white/30 text-white rounded-full pl-4 focus:ring-white/50 [&>span]:text-white/60 data-[state=open]:bg-white/30">
                <SelectValue placeholder="Select your role (prototype)" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="key_account_manager">Key Account Manager (Web)</SelectItem>
                <SelectItem value="key_account_manager_app">Key Account Manager (App)</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sign In Button */}
          <Button 
            onClick={handleLogin} 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-full font-medium shadow-lg"
            disabled={!selectedRole}
          >
            Sign in
          </Button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-white/50 text-sm text-center">
          Jarvis Key Account Manager
        </p>
      </div>
    </div>
  );
};

export default Login;
