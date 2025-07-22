import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Calendar, Eye, Search } from "lucide-react";
import { toast } from "sonner";
import brain from "brain";
import { BlogPost } from "types";
import MainNavigation from "components/MainNavigation";

interface Props {}

export default function App({}: Props) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [postsResponse, categoriesResponse] = await Promise.all([
        brain.get_blog_posts(),
        brain.get_categories()
      ]);
      
      const postsData = await postsResponse.json();
      const categoriesData = await categoriesResponse.json();
      
      setPosts(postsData.posts || []);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error("Failed to load posts:", error);
      toast.error("Failed to load blog posts");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory && post.is_published;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <MainNavigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Professional glassmorphic card */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-700">
              <h2 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 leading-tight">
                Creative
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                  Insights
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-700 mb-8 font-light leading-relaxed">
                Exploring the intersection of design, technology, and creative thinking.
                <br className="hidden md:block" />
                <span className="font-medium">Where ideas take shape.</span>
              </p>
              
              {/* Clean geometric elements */}
              <div className="flex justify-center items-center space-x-4 mb-8">
                <div className="w-4 h-4 bg-purple-500"></div>
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                <div className="w-4 h-4 bg-indigo-500"></div>
              </div>
              
              {/* Create Post Button */}
              <Button 
                onClick={() => window.open('/create-post', '_self')}
                size="lg" 
                className="rounded-full font-black text-lg px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 transition-all"
              >
                Start Writing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            {/* Professional Search */}
            <div className="relative mb-8">
              <div className="backdrop-blur-md bg-white/80 border border-white/30 rounded-2xl p-2 shadow-xl transition-all duration-300">
                <div className="flex items-center">
                  <Search className="w-5 h-5 text-slate-500 ml-4" />
                  <Input
                    placeholder="Search for insights, techniques, inspiration..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-0 bg-transparent text-lg font-medium placeholder:text-slate-500 focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  onClick={() => setSelectedCategory("all")}
                  className="rounded-full font-bold hover:scale-105 transition-all"
                >
                  All Posts
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category)}
                    className="rounded-full font-bold hover:scale-105 transition-all"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-white/50 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              {filteredPosts.length > 0 ? (
                <>
                  <div className="text-center mb-12">
                    <h3 className="text-4xl font-black text-slate-900">
                      Latest Stories
                    </h3>
                    <p className="text-slate-600 text-lg mt-2">
                      {filteredPosts.length} inspiring articles to explore
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPosts.map((post, index) => (
                      <Card key={post.id} className="group cursor-pointer backdrop-blur-md bg-white/80 border border-white/30 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:scale-105">
                        {post.featured_image && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                          </div>
                        )}
                        
                        <CardHeader className="pb-4">
                          <div className="flex items-center space-x-4 text-sm text-slate-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.published_date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.view_count}</span>
                            </div>
                          </div>
                          
                          <h4 className="text-xl font-black text-slate-900 line-clamp-2 group-hover:text-purple-600 transition-colors">
                            {post.title}
                          </h4>
                        </CardHeader>
                        
                        <CardContent className="pb-4">
                          {post.excerpt && (
                            <p className="text-slate-600 line-clamp-3 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}
                        </CardContent>
                        
                        <CardFooter className="pt-0 flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {post.categories.slice(0, 2).map((category) => (
                              <Badge key={category} variant="secondary" className="rounded-full text-xs font-bold">
                                {category}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="group/btn font-bold"
                              onClick={() => window.open(`/EditPost?slug=${post.slug}`, '_self')}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="group/btn font-bold"
                              onClick={() => window.open(`/BlogPost?slug=${post.slug}`, '_self')}
                            >
                              Read More
                              <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                  
                  {filteredPosts.length > 1 && (
                    <div className="text-center mt-16">
                      <Button size="lg" className="rounded-full font-black text-lg px-8 py-3 hover:scale-105 transition-all">
                        Load More Stories
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="backdrop-blur-md bg-white/80 border border-white/30 rounded-3xl p-12 max-w-md mx-auto">
                    <h3 className="text-2xl font-black text-slate-900 mb-4">
                      No Posts Yet
                    </h3>
                    <p className="text-slate-600">
                      The creative journey is about to begin.
                      <br />Stay tuned for inspiring content!
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
