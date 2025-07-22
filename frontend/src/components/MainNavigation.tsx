import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Menu,
  Home,
  PenTool,
  FileText,
  Settings,
  User,
  Search,
  Tag,
  Folder,
  BarChart3,
  LogOut,
  Moon,
  Sun,
  Bell,
  Plus,
  Info,
  Mail,
  LayoutDashboard
} from "lucide-react";
import { useUser } from "@stackframe/react";
import { useTheme } from "@/hooks/use-theme";

interface Props {}

export default function MainNavigation({}: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUser();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    return location.pathname.startsWith(path) && path !== "/";
  };

  // Public navigation items (visible to everyone)
  const publicNavItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Categories", path: "/categories", icon: Folder },
    { label: "Tags", path: "/tags", icon: Tag },
    { label: "About", path: "/about", icon: Info },
    { label: "Contact", path: "/contact", icon: Mail },
  ];

  // Admin/authenticated navigation items (visible only to logged-in users)
  const adminNavItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Write", path: "/create-post", icon: PenTool },
    { label: "Drafts", path: "/drafts", icon: FileText },
    { label: "Analytics", path: "/analytics", icon: BarChart3 },
  ];

  const userMenuItems = [
    { label: "Profile", path: "/profile", icon: User },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  // Combine nav items based on auth status
  const mainNavItems = user ? [...publicNavItems, ...adminNavItems] : publicNavItems;

  return (
    <>
      {/* Main Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-white/30 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div 
                onClick={() => navigate("/")}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white font-black text-xl">D</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-2xl font-black text-slate-900">DesignCraft</h1>
                  <p className="text-sm text-slate-600 font-medium -mt-1">Creative Blog</p>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Button
                    key={item.path}
                    variant={active ? "default" : "ghost"}
                    onClick={() => navigate(item.path)}
                    className={`font-bold transition-all ${
                      active 
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105" 
                        : "hover:bg-white/50 hover:scale-105"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate("/search")}
                className="hover:bg-white/50"
              >
                <Search className="w-4 h-4" />
              </Button>

              {/* Quick Create - Only show to authenticated users */}
              {user && (
                <Button 
                  onClick={() => navigate("/create-post")}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Write</span>
                </Button>
              )}

              {/* Theme Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-white/50">
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="backdrop-blur-md bg-white/90">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/50">
                      <Avatar className="h-9 w-9 border-2 border-purple-200">
                        <AvatarImage src={user.profileImageUrl || ""} alt={user.displayName || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white font-bold">
                          {(user.displayName || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 backdrop-blur-md bg-white/90" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">{user.displayName || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{
                        user.primaryEmail || "No email"
                      }</p>
                    </div>
                    <DropdownMenuSeparator />
                    {userMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem key={item.path} onClick={() => navigate(item.path)}>
                          <Icon className="w-4 h-4 mr-2" />
                          {item.label}
                        </DropdownMenuItem>
                      );
                    })}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.location.href = '/auth/sign-out'}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => window.location.href = '/auth/sign-in'}
                    className="font-bold hover:bg-white/50"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => window.location.href = '/auth/sign-up'}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold"
                  >
                    Sign Up
                  </Button>
                </div>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="lg:hidden hover:bg-white/50"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 backdrop-blur-md bg-white/95">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="text-lg font-black text-slate-900 mb-4">Navigation</div>
                    
                    {/* Public Navigation */}
                    <div className="space-y-2">
                      <div className="text-sm font-bold text-slate-700 mb-2">Blog</div>
                      {publicNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        
                        return (
                          <Button
                            key={item.path}
                            variant={active ? "default" : "ghost"}
                            onClick={() => {
                              navigate(item.path);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`justify-start font-bold transition-all w-full ${
                              active 
                                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" 
                                : "hover:bg-white/50"
                            }`}
                          >
                            <Icon className="w-4 h-4 mr-3" />
                            {item.label}
                          </Button>
                        );
                      })}
                    </div>
                    
                    {/* Admin Navigation - Only show to authenticated users */}
                    {user && (
                      <div className="space-y-2 pt-4 border-t border-slate-200">
                        <div className="text-sm font-bold text-slate-700 mb-2">Admin</div>
                        {adminNavItems.map((item) => {
                          const Icon = item.icon;
                          const active = isActive(item.path);
                          
                          return (
                            <Button
                              key={item.path}
                              variant={active ? "default" : "ghost"}
                              onClick={() => {
                                navigate(item.path);
                                setIsMobileMenuOpen(false);
                              }}
                              className={`justify-start font-bold transition-all w-full ${
                                active 
                                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white" 
                                  : "hover:bg-white/50"
                              }`}
                            >
                              <Icon className="w-4 h-4 mr-3" />
                              {item.label}
                            </Button>
                          );
                        })}
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-slate-200">
                      <div className="text-sm font-bold text-slate-700 mb-3">Account</div>
                      {user ? (
                        <>
                          {userMenuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                              <Button
                                key={item.path}
                                variant="ghost"
                                onClick={() => {
                                  navigate(item.path);
                                  setIsMobileMenuOpen(false);
                                }}
                                className="justify-start font-medium w-full"
                              >
                                <Icon className="w-4 h-4 mr-3" />
                                {item.label}
                              </Button>
                            );
                          })}
                          <Button
                            variant="ghost"
                            onClick={() => window.location.href = '/auth/sign-out'}
                            className="justify-start font-medium w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            Log out
                          </Button>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            onClick={() => window.location.href = '/auth/sign-in'}
                            className="w-full font-bold"
                          >
                            Sign In
                          </Button>
                          <Button 
                            onClick={() => window.location.href = '/auth/sign-up'}
                            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold"
                          >
                            Sign Up
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
