import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Edit, 
  Eye, 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp,
  Calendar,
  Clock,
  Settings,
  Folder,
  Hash,
  ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import brain from "brain";
import { BlogPost } from "types";
import MainNavigation from "components/MainNavigation";

interface Props {}

export default function Dashboard({}: Props) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0,
    thisMonthViews: 0,
    avgReadTime: "0:00"
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [postsResponse, draftsResponse] = await Promise.all([
        brain.get_blog_posts(),
        brain.get_draft_posts()
      ]);
      
      const postsData = await postsResponse.json();
      const draftsData = await draftsResponse.json();
      
      const allPosts = [...(postsData.posts || []), ...(draftsData.drafts || [])];
      const publishedPosts = postsData.posts || [];
      const draftPosts = draftsData.drafts || [];
      
      setPosts(allPosts.slice(0, 10)); // Show latest 10 posts
      
      // Calculate stats
      const totalViews = publishedPosts.reduce((sum: number, post: BlogPost) => sum + post.view_count, 0);
      const avgReadTime = Math.round(publishedPosts.reduce((sum: number, post: BlogPost) => 
        sum + (post.content?.length || 0), 0) / publishedPosts.length / 200) || 0;
      
      setStats({
        totalPosts: allPosts.length,
        publishedPosts: publishedPosts.length,
        draftPosts: draftPosts.length,
        totalViews,
        thisMonthViews: Math.round(totalViews * 0.3), // Simulate current month
        avgReadTime: `${Math.floor(avgReadTime / 60)}:${(avgReadTime % 60).toString().padStart(2, '0')}`
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const quickStats = [
    {
      title: "Total Posts",
      value: stats.totalPosts.toString(),
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Published",
      value: stats.publishedPosts.toString(),
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Drafts",
      value: stats.draftPosts.toString(),
      icon: Edit,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const quickActions = [
    {
      title: "New Post",
      description: "Create a new blog post",
      icon: Plus,
      action: () => window.open('/Create', '_self'),
      color: "from-purple-600 to-blue-600"
    },
    {
      title: "View Drafts",
      description: "Manage your draft posts",
      icon: Edit,
      action: () => window.open('/Drafts', '_self'),
      color: "from-green-600 to-teal-600"
    },
    {
      title: "Analytics",
      description: "View detailed analytics",
      icon: BarChart3,
      action: () => window.open('/Analytics', '_self'),
      color: "from-orange-600 to-red-600"
    },
    {
      title: "Settings",
      description: "Configure your blog",
      icon: Settings,
      action: () => window.open('/Settings', '_self'),
      color: "from-indigo-600 to-purple-600"
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <MainNavigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
              Dashboard
            </h1>
            <p className="text-xl text-slate-600 font-light">
              Welcome back! Here's what's happening with your blog.
            </p>
          </div>
          
          <Button 
            onClick={() => window.open('/Create', '_self')}
            className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Post
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="backdrop-blur-md bg-white/80 border border-white/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-slate-200 rounded mb-3"></div>
                      <div className="h-8 bg-slate-200 rounded"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-slate-600">{stat.title}</div>
                        <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                          <Icon className={`w-4 h-4 ${stat.color}`} />
                        </div>
                      </div>
                      <div className="text-3xl font-black text-slate-900">{stat.value}</div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="backdrop-blur-md bg-white/80 grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="management">Management</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => {
                      const Icon = action.icon;
                      return (
                        <Button
                          key={index}
                          variant="outline"
                          onClick={action.action}
                          className="h-20 flex flex-col items-center justify-center space-y-2 hover:shadow-lg transition-all group"
                        >
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} group-hover:scale-110 transition-transform`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-sm">{action.title}</div>
                            <div className="text-xs text-slate-600">{action.description}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent Activity */}
              <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {isLoading ? (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse flex items-center space-x-3">
                          <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-slate-200 rounded mb-1"></div>
                            <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      posts.slice(0, 4).map((post, index) => (
                        <div key={post.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                          <div className={`p-2 rounded-full ${
                            post.is_published ? 'bg-green-100' : 'bg-orange-100'
                          }`}>
                            {post.is_published ? (
                              <Eye className="w-4 h-4 text-green-600" />
                            ) : (
                              <Edit className="w-4 h-4 text-orange-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm truncate">{post.title}</div>
                            <div className="text-xs text-slate-600">
                              {post.is_published ? 'Published' : 'Draft'} • {formatDate(post.created_at)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Content Tab */}
          <TabsContent value="content">
            <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Posts</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('/', '_self')}
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-6 bg-slate-200 rounded mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-xl font-black text-slate-900 mb-2">No posts yet</h3>
                    <p className="text-slate-600 mb-4">Create your first blog post to get started</p>
                    <Button 
                      onClick={() => window.open('/Create', '_self')}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Post
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors border border-slate-100">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-bold text-slate-900">{post.title}</h3>
                            <Badge 
                              variant={post.is_published ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {post.is_published ? "Published" : "Draft"}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-slate-600">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.created_at)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.view_count} views</span>
                            </span>
                            {post.categories.length > 0 && (
                              <span className="flex items-center space-x-1">
                                <Folder className="w-4 h-4" />
                                <span>{post.categories[0]}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`/Edit?slug=${post.slug}`, '_self')}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`/Post?slug=${post.slug}`, '_self')}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Management Tab */}
          <TabsContent value="management">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Categories */}
              <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => window.open('/Categories', '_self')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Folder className="w-5 h-5 text-purple-600" />
                    <span>Categories</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">Organize your content with categories</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Categories
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
              
              {/* Tags */}
              <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => window.open('/Tags', '_self')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Hash className="w-5 h-5 text-blue-600" />
                    <span>Tags</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">Label and discover content with tags</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Tags
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
              
              {/* Analytics */}
              <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                onClick={() => window.open('/Analytics', '_self')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-green-600" />
                    <span>Analytics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">Track performance and engagement</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Analytics
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
