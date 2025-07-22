import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Users, 
  Clock, 
  Heart,
  Share,
  MessageSquare,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";
import MainNavigation from "components/MainNavigation";

interface Props {}

export default function Analytics({}: Props) {
  const [timeRange, setTimeRange] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => setIsLoading(false), 1500);
  }, [timeRange]);

  const overviewStats = [
    {
      title: "Total Views",
      value: "24,567",
      change: "+12.5%",
      trend: "up",
      icon: Eye,
      color: "text-blue-600"
    },
    {
      title: "Unique Visitors",
      value: "18,234",
      change: "+8.3%",
      trend: "up",
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Avg. Read Time",
      value: "4:32",
      change: "+15.2%",
      trend: "up",
      icon: Clock,
      color: "text-purple-600"
    },
    {
      title: "Engagement Rate",
      value: "68.4%",
      change: "+5.7%",
      trend: "up",
      icon: Heart,
      color: "text-red-600"
    }
  ];

  const topPosts = [
    {
      title: "Modern CSS Grid Layouts",
      views: "3,245",
      engagement: "74%",
      date: "Dec 15, 2023"
    },
    {
      title: "React Performance Optimization",
      views: "2,891",
      engagement: "69%",
      date: "Dec 12, 2023"
    },
    {
      title: "Design System Best Practices",
      views: "2,567",
      engagement: "72%",
      date: "Dec 10, 2023"
    },
    {
      title: "TypeScript Advanced Patterns",
      views: "2,234",
      engagement: "67%",
      date: "Dec 8, 2023"
    },
    {
      title: "Micro-interactions in UI Design",
      views: "1,987",
      engagement: "71%",
      date: "Dec 5, 2023"
    }
  ];

  const trafficSources = [
    { source: "Direct", percentage: 42, visitors: "7,658" },
    { source: "Google Search", percentage: 28, visitors: "5,106" },
    { source: "Social Media", percentage: 18, visitors: "3,282" },
    { source: "Referrals", percentage: 8, visitors: "1,459" },
    { source: "Email", percentage: 4, visitors: "729" }
  ];

  const deviceBreakdown = [
    { device: "Desktop", percentage: 58, icon: Monitor, visitors: "10,576" },
    { device: "Mobile", percentage: 35, icon: Smartphone, visitors: "6,382" },
    { device: "Tablet", percentage: 7, icon: Tablet, visitors: "1,276" }
  ];

  const engagementMetrics = [
    { metric: "Likes", value: "1,234", change: "+18%" },
    { metric: "Shares", value: "567", change: "+24%" },
    { metric: "Comments", value: "89", change: "+12%" },
    { metric: "Bookmarks", value: "345", change: "+31%" }
  ];

  const StatCard = ({ stat, isLoading }: { stat: any, isLoading: boolean }) => {
    const Icon = stat.icon;
    
    return (
      <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-lg hover:shadow-xl transition-all">
        <CardContent className="p-6">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded mb-3"></div>
              <div className="h-8 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-16"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium text-slate-600">{stat.title}</div>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
              <div className={`text-xs font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {stat.change} from last period
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <MainNavigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
              Analytics
            </h1>
            <p className="text-xl text-slate-600 font-light">
              Track your blog's performance and engagement
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 backdrop-blur-md bg-white/80">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {overviewStats.map((stat, index) => (
            <StatCard key={index} stat={stat} isLoading={isLoading} />
          ))}
        </div>

        {/* Main Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="backdrop-blur-md bg-white/80 grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Chart Placeholder */}
              <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Traffic Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="h-64 bg-slate-200 rounded animate-pulse"></div>
                  ) : (
                    <div className="h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                        <p className="text-slate-600">Interactive chart would go here</p>
                        <p className="text-sm text-slate-500">Showing views over time</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Real-time Stats */}
              <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Real-time Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="h-4 bg-slate-200 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Active visitors</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="font-bold">23</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Views this hour</span>
                        <span className="font-bold">156</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Page views today</span>
                        <span className="font-bold">2,431</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Bounce rate</span>
                        <span className="font-bold text-green-600">32.4%</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Audience Tab */}
          <TabsContent value="audience">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Traffic Sources */}
              <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {trafficSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-900">{source.source}</span>
                            <span className="text-sm text-slate-600">{source.percentage}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${source.percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">{source.visitors} visitors</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Device Breakdown */}
              <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
                <CardHeader>
                  <CardTitle>Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deviceBreakdown.map((device, index) => {
                      const Icon = device.icon;
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <Icon className="w-5 h-5 text-slate-600" />
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-slate-900">{device.device}</span>
                                <span className="text-sm text-slate-600">{device.percentage}%</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-green-600 to-teal-600 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${device.percentage}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-slate-500 mt-1">{device.visitors} visitors</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Content Tab */}
          <TabsContent value="content">
            <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPosts.map((post, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-1">{post.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views} views</span>
                          </span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`${parseInt(post.engagement) > 70 ? 'border-green-200 text-green-800 bg-green-50' : 'border-blue-200 text-blue-800 bg-blue-50'}`}
                      >
                        {post.engagement} engagement
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Engagement Tab */}
          <TabsContent value="engagement">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {engagementMetrics.map((metric, index) => (
                <Card key={index} className="backdrop-blur-md bg-white/80 border border-white/30 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="text-2xl font-black text-slate-900 mb-1">{metric.value}</div>
                    <div className="text-sm text-slate-600 mb-2">{metric.metric}</div>
                    <div className="text-xs text-green-600 font-medium">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      {metric.change}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Engagement Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600">Engagement chart would go here</p>
                    <p className="text-sm text-slate-500">Showing likes, shares, and comments over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
