import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Calendar, Eye, Search, Filter, SortDesc } from "lucide-react";
import { toast } from "sonner";
import brain from "brain";
import { BlogPost } from "types";
import MainNavigation from "components/MainNavigation";

interface Props {}

export default function Drafts({}: Props) {
  const [drafts, setDrafts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      const response = await brain.get_draft_posts();
      const data = await response.json();
      setDrafts(data.posts || []);
    } catch (error) {
      console.error("Failed to load drafts:", error);
      toast.error("Failed to load draft posts");
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

  const filteredDrafts = drafts.filter((draft) => {
    const matchesSearch = draft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         draft.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || draft.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const allCategories = Array.from(
    new Set(drafts.flatMap(draft => draft.categories))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <MainNavigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
            Draft Posts
          </h1>
          <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
            Work in progress. Continue writing your stories.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search drafts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 backdrop-blur-md bg-white/80 border-white/30"
              />
            </div>
          </div>
          
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full sm:w-auto">
            <TabsList className="backdrop-blur-md bg-white/80">
              <TabsTrigger value="all">All</TabsTrigger>
              {allCategories.slice(0, 4).map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Drafts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse backdrop-blur-md bg-white/50 border border-white/30">
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredDrafts.length === 0 ? (
          <div className="text-center py-16">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-12 max-w-lg mx-auto">
              <h3 className="text-2xl font-black text-slate-900 mb-4">
                {searchTerm || selectedCategory !== "all" ? "No drafts found" : "No drafts yet"}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filters"
                  : "Start writing your first draft post"}
              </p>
              <Button 
                onClick={() => window.open('/create-post', '_self')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold"
              >
                Start Writing
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDrafts.map((draft) => (
              <Card key={draft.id} className="group backdrop-blur-md bg-white/80 border border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden">
                {draft.featured_image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={draft.featured_image}
                      alt={draft.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <Badge className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600">
                      Draft
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4 text-sm text-slate-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(draft.updated_at)}</span>
                    </div>
                    {!draft.featured_image && (
                      <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">
                        Draft
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {draft.title}
                  </CardTitle>
                  
                  {draft.excerpt && (
                    <p className="text-slate-600 font-light leading-relaxed line-clamp-3">
                      {draft.excerpt}
                    </p>
                  )}
                </CardHeader>
                
                <CardContent className="pb-4">
                  <div className="flex flex-wrap gap-2">
                    {draft.categories.slice(0, 2).map((category) => (
                      <Badge key={category} variant="secondary" className="rounded-full text-xs font-bold">
                        {category}
                      </Badge>
                    ))}
                    {draft.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-full text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Eye className="w-4 h-4" />
                    <span>{draft.view_count} views</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="group/btn font-bold"
                      onClick={() => window.open(`/EditPost?slug=${draft.slug}`, '_self')}
                    >
                      Continue Writing
                      <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
