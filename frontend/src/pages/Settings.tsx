import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Trash2,
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import MainNavigation from "components/MainNavigation";

interface Props {}

export default function Settings({}: Props) {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    // Account settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    marketingEmails: false,
    
    // Privacy settings
    profilePublic: true,
    showEmail: false,
    showStats: true,
    allowComments: true,
    
    // Content settings
    autoSave: true,
    spellCheck: true,
    defaultCategory: "general",
    publicationStatus: "draft",
    
    // Display settings
    language: "en",
    timezone: "UTC-8",
    dateFormat: "MM/DD/YYYY",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    toast.success("Password updated successfully!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const SettingRow = ({ 
    icon: Icon, 
    title, 
    description, 
    children 
  }: { 
    icon: any, 
    title: string, 
    description: string, 
    children: React.ReactNode 
  }) => (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-start space-x-3">
        <Icon className="w-5 h-5 text-slate-600 mt-0.5" />
        <div>
          <div className="font-bold text-slate-900">{title}</div>
          <div className="text-sm text-slate-600">{description}</div>
        </div>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <MainNavigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
            Settings
          </h1>
          <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
            Customize your experience and manage your account
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="backdrop-blur-md bg-white/80 grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
          </TabsList>
          
          {/* Account Settings */}
          <TabsContent value="account">
            <div className="space-y-6">
              <Card className="backdrop-blur-md bg-white/80 border border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" placeholder="Tell us about yourself..." />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-md bg-white/80 border border-white/30">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Change Password</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input 
                        id="currentPassword" 
                        type={showPasswords.current ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input 
                        id="newPassword" 
                        type={showPasswords.new ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input 
                        id="confirmPassword" 
                        type={showPasswords.confirm ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button onClick={handlePasswordChange} className="bg-gradient-to-r from-purple-600 to-blue-600">
                    Update Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Notifications */}
          <TabsContent value="notifications">
            <Card className="backdrop-blur-md bg-white/80 border border-white/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SettingRow
                  icon={Bell}
                  title="Email Notifications"
                  description="Receive notifications via email"
                >
                  <Switch 
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                  />
                </SettingRow>
                <Separator />
                <SettingRow
                  icon={Bell}
                  title="Push Notifications"
                  description="Receive push notifications in your browser"
                >
                  <Switch 
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
                  />
                </SettingRow>
                <Separator />
                <SettingRow
                  icon={Bell}
                  title="Weekly Digest"
                  description="Get a weekly summary of your activity"
                >
                  <Switch 
                    checked={settings.weeklyDigest}
                    onCheckedChange={(checked) => setSettings({...settings, weeklyDigest: checked})}
                  />
                </SettingRow>
                <Separator />
                <SettingRow
                  icon={Bell}
                  title="Marketing Emails"
                  description="Receive updates about new features and tips"
                >
                  <Switch 
                    checked={settings.marketingEmails}
                    onCheckedChange={(checked) => setSettings({...settings, marketingEmails: checked})}
                  />
                </SettingRow>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Privacy */}
          <TabsContent value="privacy">
            <Card className="backdrop-blur-md bg-white/80 border border-white/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Privacy Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <SettingRow
                  icon={User}
                  title="Public Profile"
                  description="Make your profile visible to other users"
                >
                  <Switch 
                    checked={settings.profilePublic}
                    onCheckedChange={(checked) => setSettings({...settings, profilePublic: checked})}
                  />
                </SettingRow>
                <Separator />
                <SettingRow
                  icon={User}
                  title="Show Email"
                  description="Display your email address on your public profile"
                >
                  <Switch 
                    checked={settings.showEmail}
                    onCheckedChange={(checked) => setSettings({...settings, showEmail: checked})}
                  />
                </SettingRow>
                <Separator />
                <SettingRow
                  icon={User}
                  title="Show Statistics"
                  description="Display your post and view statistics"
                >
                  <Switch 
                    checked={settings.showStats}
                    onCheckedChange={(checked) => setSettings({...settings, showStats: checked})}
                  />
                </SettingRow>
                <Separator />
                <SettingRow
                  icon={User}
                  title="Allow Comments"
                  description="Let others comment on your posts"
                >
                  <Switch 
                    checked={settings.allowComments}
                    onCheckedChange={(checked) => setSettings({...settings, allowComments: checked})}
                  />
                </SettingRow>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Content */}
          <TabsContent value="content">
            <Card className="backdrop-blur-md bg-white/80 border border-white/30">
              <CardHeader>
                <CardTitle>Content Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="defaultCategory">Default Category</Label>
                    <Select value={settings.defaultCategory} onValueChange={(value) => setSettings({...settings, defaultCategory: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="tutorial">Tutorial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="publicationStatus">Default Publication Status</Label>
                    <Select value={settings.publicationStatus} onValueChange={(value) => setSettings({...settings, publicationStatus: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Separator />
                
                <SettingRow
                  icon={Save}
                  title="Auto Save"
                  description="Automatically save your work while writing"
                >
                  <Switch 
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => setSettings({...settings, autoSave: checked})}
                  />
                </SettingRow>
                <Separator />
                <SettingRow
                  icon={SettingsIcon}
                  title="Spell Check"
                  description="Enable spell checking in the editor"
                >
                  <Switch 
                    checked={settings.spellCheck}
                    onCheckedChange={(checked) => setSettings({...settings, spellCheck: checked})}
                  />
                </SettingRow>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Display */}
          <TabsContent value="display">
            <Card className="backdrop-blur-md bg-white/80 border border-white/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5" />
                  <span>Display Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={settings.language} onValueChange={(value) => setSettings({...settings, language: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={settings.timezone} onValueChange={(value) => setSettings({...settings, timezone: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                        <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                        <SelectItem value="UTC+0">GMT (UTC+0)</SelectItem>
                        <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => setSettings({...settings, dateFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {/* Danger Zone */}
            <Card className="backdrop-blur-md bg-red-50/80 border border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-800">
                  <Trash2 className="w-5 h-5" />
                  <span>Danger Zone</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-red-800">Delete Account</div>
                    <div className="text-sm text-red-600">Permanently delete your account and all data</div>
                  </div>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Save Button */}
        <div className="flex justify-center pt-8">
          <Button 
            onClick={handleSaveSettings}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold px-8"
          >
            <Save className="w-4 h-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
