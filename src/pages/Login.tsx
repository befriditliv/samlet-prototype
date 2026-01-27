import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import jarvisLogo from "@/assets/jarvis-logo.svg";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (selectedRole) {
      setRole(selectedRole as UserRole);
      if (selectedRole === "manager") {
        navigate("/manager");
      } else {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={jarvisLogo} alt="Jarvis Logo" className="h-20 w-20" />
          </div>
          <CardTitle className="text-2xl font-bold">Jarvis Key Account Manager</CardTitle>
          <CardDescription>Vælg din rolle for at fortsætte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Rolle</label>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Vælg din rolle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="key_account_manager">Key Account Manager</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleLogin} 
            className="w-full" 
            disabled={!selectedRole}
          >
            Log ind
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
