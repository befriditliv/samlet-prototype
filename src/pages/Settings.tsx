import { ArrowLeft, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { HcpSearch } from "@/components/HcpSearch";
import { AskJarvis } from "@/components/AskJarvis";
import { NavigationMenu } from "@/components/NavigationMenu";
import jarvisLogo from "@/assets/jarvis-logo.svg";

const Settings = () => {
  const { role } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("da");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const getRoleDisplayName = () => {
    switch (role) {
      case "key_account_manager":
        return "KEY ACCOUNT MANAGER";
      case "manager":
        return "MANAGER";
      default:
        return "BRUGER";
    }
  };

  const handleSave = () => {
    toast({
      title: "Indstillinger gemt",
      description: "Dine profilindstillinger er blevet opdateret.",
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
              <h1 className="text-xl font-bold text-foreground">Indstillinger</h1>
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
        <div className="max-w-xl mx-auto space-y-6">
          {/* Profile Settings Card */}
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Profilindstillinger</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Opdater dine profilindstillinger her. Nogle indstillinger skal muligvis opdateres af din administrator.
                </p>
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">
                    Navn <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    value="Bruger"
                    disabled
                    className="bg-muted/50"
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    value="bruger@example.com"
                    disabled
                    className="bg-muted/50"
                  />
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <Label htmlFor="role">
                    Rolle <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="role"
                    value={getRoleDisplayName()}
                    disabled
                    className="bg-muted/50"
                  />
                </div>

                {/* Language Field */}
                <div className="space-y-2">
                  <Label htmlFor="language">
                    Sprog (Locale) <span className="text-destructive">*</span>
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Vælg sprog" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="da">Dansk (Danish)</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="de">Deutsch (German)</SelectItem>
                      <SelectItem value="sv">Svenska (Swedish)</SelectItem>
                      <SelectItem value="no">Norsk (Norwegian)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-center pt-4">
                <Button onClick={handleSave} className="px-8">
                  Opdater profilindstillinger
                </Button>
              </div>
            </div>
          </Card>

          {/* Advanced Settings */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <Card className="overflow-hidden">
              <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-accent/5 transition-colors">
                <span className="font-medium text-foreground">Advancerede indstillinger</span>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${advancedOpen ? "rotate-180" : ""}`} />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="p-4 pt-0 border-t">
                  <div className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                      Avancerede indstillinger er tilgængelige for administratorer.
                    </p>
                    <div className="space-y-2">
                      <Label>Notifikationer</Label>
                      <p className="text-sm text-muted-foreground">
                        Kontakt din administrator for at ændre notifikationsindstillinger.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Data eksport</Label>
                      <p className="text-sm text-muted-foreground">
                        Kontakt din administrator for at eksportere dine data.
                      </p>
                    </div>
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
