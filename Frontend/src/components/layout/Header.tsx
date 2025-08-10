import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Shield, Moon, Sun, LogOut, Globe } from "lucide-react";

const translations = {
  en: {
    logout: "Logout",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
  },
  hi: {
    logout: "लॉग आउट",
    language: "भाषा",
    theme: "थीम",
    light: "हल्का",
    dark: "गहरा",
  },
  es: {
    logout: "Cerrar Sesión",
    language: "Idioma",
    theme: "Tema",
    light: "Claro",
    dark: "Oscuro",
  },
};

export const Header = () => {
  const { user, logout } = useAuth();
  const { theme, language, toggleTheme, setLanguage } = useTheme();
  const t = translations[language];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-destructive text-destructive-foreground';
      case 'patrol': return 'bg-primary text-primary-foreground';
      case 'desk': return 'bg-secondary text-secondary-foreground';
      case 'field': return 'bg-accent text-accent-foreground';
      case 'investigating': return 'bg-primary/80 text-primary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <header className="bg-gradient-to-r from-primary to-primary-glow shadow-lg border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3">
          <Shield className="w-8 h-8 text-primary-foreground" />
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">InteliCop</h1>
            <p className="text-xs text-primary-foreground/80">Criminal Management System</p>
          </div>
        </div>

        {/* User Info & Controls */}
        <div className="flex items-center space-x-4">
          {/* User Info */}
          {user && (
            <div className="flex items-center space-x-2">
              <div className="text-right text-sm text-primary-foreground">
                <p className="font-medium">{user.fullName}</p>
                <p className="text-xs opacity-80">{user.badge && `Badge: ${user.badge}`}</p>
              </div>
              <Badge className={getRoleBadgeColor(user.role)}>
                {user.role.toUpperCase()}
              </Badge>
            </div>
          )}

          {/* Language Selector */}
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-20 h-8 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground">
              <Globe className="w-4 h-4" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="hi">हि</SelectItem>
              <SelectItem value="es">ES</SelectItem>
            </SelectContent>
          </Select>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-primary-foreground hover:bg-destructive/20"
          >
            <LogOut className="w-4 h-4 mr-1" />
            {t.logout}
          </Button>
        </div>
      </div>
    </header>
  );
};