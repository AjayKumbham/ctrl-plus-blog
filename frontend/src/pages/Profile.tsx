import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Calendar, MapPin, Link as LinkIcon, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@stackframe/react";
import MainNavigation from "components/MainNavigation";

interface Props {}

export default function Profile({}: Props) {
  const user = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    displayName: user?.displayName || "",
    bio: "Creative designer and blogger passionate about UI/UX and modern web design.",
    location: "San Francisco, CA",
    website: "https://designcraft.com",
    twitter: "@designcraft",
    github: "designcraft",
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const stats = [
    { label: "Posts Published", value: "24" },
    { label: "Total Views", value: "12.5K" },
    { label: "Followers", value: "342" },
    { label: "Following", value: "89" },
  ];

  const recentPosts = [
    { title: "Modern CSS Grid Layouts", views: "1.2K", date: "2 days ago" },
    { title: "React Performance Tips", views: "890", date: "1 week ago" },
    { title: "Design System Principles", views: "2.1K", date: "2 weeks ago" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <MainNavigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="backdrop-blur-md bg-white/80 border border-white/30 rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative group">
              <Avatar className="w-32 h-32 border-4 border-purple-200 group-hover:border-purple-300 transition-colors">
                <AvatarImage src={user?.profileImageUrl || ""} alt={user?.displayName || "User"} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white text-4xl font-bold">
                  {(user?.displayName || "U").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {isEditing ? (
                    <Input
                      value={profile.displayName}
                      onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                      className="text-3xl font-black border-none p-0 h-auto bg-transparent"
                      placeholder="Your name"
                    />
                  ) : (
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900">
                      {profile.displayName || "User"}
                    </h1>
                  )}
                  <div className="flex items-center space-x-4 mt-2 text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{user?.primaryEmail || "No email"}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Joined December 2023</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} size="sm" className="bg-green-600 hover:bg-green-700">
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
              
              {isEditing ? (
                <Textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  className="resize-none"
                  rows={3}
                />
              ) : (
                <p className="text-slate-600 text-lg leading-relaxed mb-4">
                  {profile.bio}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                {(isEditing ? [
                  { icon: MapPin, key: 'location', placeholder: 'Location' },
                  { icon: LinkIcon, key: 'website', placeholder: 'Website' },
                ] : [
                  { icon: MapPin, text: profile.location },
                  { icon: LinkIcon, text: profile.website },
                ]).map((item, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <item.icon className="w-4 h-4" />
                    {isEditing ? (
                      <Input
                        value={profile[item.key as keyof typeof profile]}
                        onChange={(e) => setProfile({...profile, [item.key as string]: e.target.value})}
                        placeholder={item.placeholder}
                        className="h-6 text-sm border-none p-0 bg-transparent"
                      />
                    ) : (
                      <span>{item.text}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-200">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList className="backdrop-blur-md bg-white/80">
            <TabsTrigger value="posts">Recent Posts</TabsTrigger>
            <TabsTrigger value="drafts">Drafts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts">
            <div className="grid gap-4">
              {recentPosts.map((post, index) => (
                <Card key={index} className="backdrop-blur-md bg-white/80 border border-white/30 shadow-lg hover:shadow-xl transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 mb-1">{post.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span>{post.views} views</span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Post
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="drafts">
            <Card className="backdrop-blur-md bg-white/80 border border-white/30">
              <CardContent className="p-12 text-center">
                <h3 className="text-xl font-black text-slate-900 mb-2">No drafts found</h3>
                <p className="text-slate-600 mb-4">Start writing your next post</p>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Create New Post
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="backdrop-blur-md bg-white/80 border border-white/30">
                <CardHeader>
                  <CardTitle>Page Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-slate-900">12,547</div>
                  <p className="text-sm text-green-600">+15% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-md bg-white/80 border border-white/30">
                <CardHeader>
                  <CardTitle>Unique Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-slate-900">8,924</div>
                  <p className="text-sm text-green-600">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-md bg-white/80 border border-white/30">
                <CardHeader>
                  <CardTitle>Avg. Read Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-black text-slate-900">4:32</div>
                  <p className="text-sm text-blue-600">+8% from last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
