import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  Menu, 
  Calendar, 
  Users, 
  GraduationCap, 
  Settings,
  User,
  LogOut
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = [
  {
    icon: Calendar,
    label: "Field Day",
    href: "#schedule",
    isRoute: false
  },
  {
    icon: Users,
    label: "Kundeoversigt",
    href: "/kundeoversigt",
    isRoute: true
  },
  {
    icon: GraduationCap,
    label: "Træningsplatform",
    href: "/traeningsplatform",
    isRoute: true
  }
];

export const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleMenuClick = (item: typeof menuItems[0]) => {
    setIsOpen(false);
    if (item.isRoute) {
      navigate(item.href);
    } else if (item.href.startsWith('#')) {
      const element = document.querySelector(item.href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="icon"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="w-80 p-0 flex flex-col">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-4">
            <nav className="space-y-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/50 transition-colors text-foreground text-left"
                  onClick={() => handleMenuClick(item)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <Separator className="my-6" />

            <div className="space-y-2">
              <button
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent/50 transition-colors text-foreground text-left"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/settings");
                }}
              >
                <Settings className="h-5 w-5" />
                <span className="font-medium">Indstillinger</span>
              </button>
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <User className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">
                  {role === "key_account_manager" ? "Key Account Manager" : "Manager"}
                </div>
                <div className="text-xs text-muted-foreground truncate">Bruger</div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="shrink-0"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};