import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Shield, Lock, User, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const translations = {
  en: {
    title: "InteliCop Login",
    subtitle: "Criminal Management System",
    username: "Username",
    password: "Password",
    login: "Sign In",
    loggingIn: "Signing In...",
    invalidCredentials: "Invalid username or password",
    demoAccounts: "Demo Accounts",
    admin: "Admin",
    patrol: "Patrol Officer", 
    desk: "Desk Officer",
    field: "Field Officer",
    investigating: "Investigating Officer"
  },
  hi: {
    title: "इंटेलिकॉप लॉगिन",
    subtitle: "आपराधिक प्रबंधन प्रणाली",
    username: "उपयोगकर्ता नाम",
    password: "पासवर्ड",
    login: "साइन इन",
    loggingIn: "साइन इन हो रहा है...",
    invalidCredentials: "गलत उपयोगकर्ता नाम या पासवर्ड",
    demoAccounts: "डेमो खाते",
    admin: "प्रशासक",
    patrol: "गश्ती अधिकारी",
    desk: "डेस्क अधिकारी", 
    field: "फील्ड अधिकारी",
    investigating: "जांच अधिकारी"
  },
  es: {
    title: "Inicio de Sesión InteliCop",
    subtitle: "Sistema de Gestión Criminal",
    username: "Usuario",
    password: "Contraseña", 
    login: "Iniciar Sesión",
    loggingIn: "Iniciando Sesión...",
    invalidCredentials: "Usuario o contraseña inválidos",
    demoAccounts: "Cuentas Demo",
    admin: "Administrador",
    patrol: "Oficial de Patrulla",
    desk: "Oficial de Escritorio",
    field: "Oficial de Campo", 
    investigating: "Oficial Investigador"
  }
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const { language } = useTheme();
  const { toast } = useToast();
  const t = translations[language];
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(username, password);
    if (!success) {
      toast({
        variant: "destructive",
        title: t.invalidCredentials,
        description: "Please check your credentials and try again.",
      });
    }else {
      // Redirect on successful login:
      navigate("/dashboard", { replace: true });
    }
  };

  const quickLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
  };

  const demoAccounts = [
    { user: "admin", pass: "admin123", role: t.admin, color: "bg-destructive" },
    { user: "patrol01", pass: "patrol123", role: t.patrol, color: "bg-primary" },
    { user: "desk01", pass: "desk123", role: t.desk, color: "bg-secondary" },
    { user: "field01", pass: "field123", role: t.field, color: "bg-accent" },
    { user: "inv01", pass: "inv123", role: t.investigating, color: "bg-primary/80" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo Section */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-full flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            {t.title}
          </h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Lock className="w-5 h-5" />
              {t.login}
            </CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">{t.username}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t.password}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary"
                disabled={isLoading}
              >
                {isLoading ? t.loggingIn : t.login}
              </Button>
            </form>

            {/* Demo Accounts */}
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">{t.demoAccounts}</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {demoAccounts.map((account) => (
                  <Button
                    key={account.user}
                    variant="outline"
                    size="sm"
                    onClick={() => quickLogin(account.user, account.pass)}
                    className="justify-start text-xs"
                  >
                    <div className={`w-2 h-2 rounded-full ${account.color} mr-2`} />
                    {account.role}: {account.user}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}