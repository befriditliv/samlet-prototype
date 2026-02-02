import { ArrowLeft, ChevronDown, User, Mail, Shield, Globe, Bell, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { HcpSearch } from "@/components/HcpSearch";
import { AskJarvis } from "@/components/AskJarvis";
import { NavigationMenu } from "@/components/NavigationMenu";

const Settings = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("da");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const getRoleDisplayName = () => {
    switch (role) {
      case "key_account_manager":
        return "Key Account Manager";
      case "manager":
        return "Manager";
      default:
        return "User";
    }
  };

  const getInitials = () => {
    return role === "manager" ? "M" : "KAM";
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your profile settings have been updated.",
    });
  };

  const handleBack = () => {
    if (role === "manager") {
      navigate("/manager");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold text-foreground">Settings</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-full max-w-md">
                <HcpSearch />
              </div>
              <AskJarvis />
              <NavigationMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Profile Header Card */}
          <Card className="p-8 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/10 border-primary/20">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-primary-foreground">{getInitials()}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-success border-2 border-card flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-success-foreground" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground">{getRoleDisplayName()}</h2>
                <p className="text-muted-foreground">bruger@example.com</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    Active
                  </span>
                  <span className="text-xs text-muted-foreground">• Member since 2024</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Profile Settings Card */}
          <Card className="overflow-hidden">
            <div className="p-6 border-b bg-muted/30">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Details
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Update your profile settings. Some fields are managed by your organization.
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Name Field */}
              <div className="grid gap-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Name
                </Label>
                <Input
                  id="name"
                  value="User"
                  disabled
                  className="bg-muted/50 border-dashed"
                />
                <p className="text-xs text-muted-foreground">Managed by your organization</p>
              </div>

              {/* Email Field */}
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="email"
                  value="bruger@example.com"
                  disabled
                  className="bg-muted/50 border-dashed"
                />
                <p className="text-xs text-muted-foreground">Managed by your organization</p>
              </div>

              {/* Role Field */}
              <div className="grid gap-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Role
                </Label>
                <Input
                  id="role"
                  value={getRoleDisplayName()}
                  disabled
                  className="bg-muted/50 border-dashed"
                />
                <p className="text-xs text-muted-foreground">Managed by your organization</p>
              </div>

              <Separator />

              {/* Language Field */}
              <div className="grid gap-2">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Language (Locale)
                </Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="da">🇩🇰 Dansk</SelectItem>
                    <SelectItem value="en">🇬🇧 English</SelectItem>
                    <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                    <SelectItem value="sv">🇸🇪 Svenska</SelectItem>
                    <SelectItem value="no">🇳🇴 Norsk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <Button onClick={handleSave} className="px-8">
                  Save changes
                </Button>
              </div>
            </div>
          </Card>

          {/* Notifications Card */}
          <Card className="overflow-hidden">
            <div className="p-6 border-b bg-muted/30">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notifications
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Manage how you receive notifications.
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch 
                  checked={emailNotifications} 
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications in browser</p>
                </div>
                <Switch 
                  checked={pushNotifications} 
                  onCheckedChange={setPushNotifications}
                />
              </div>
            </div>
          </Card>

          {/* Advanced Settings */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <Card className="overflow-hidden">
              <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                    <Download className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <span className="font-semibold text-foreground block">Advanced settings</span>
                    <span className="text-sm text-muted-foreground">Data export and more</span>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${advancedOpen ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-6 pb-6 border-t">
                  <div className="space-y-4 pt-6">
                    <div className="p-4 rounded-lg bg-muted/30 border border-dashed">
                      <h4 className="font-medium text-foreground mb-1">Data export</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Download a copy of your data.
                      </p>
                      <Button variant="outline" size="sm" disabled>
                        <Download className="h-4 w-4 mr-2" />
                        Export data
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Contact your administrator for additional advanced settings.
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

        </div>
      </main>
    </div>
  );
};

export default Settings;
