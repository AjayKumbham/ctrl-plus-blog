import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Search as SearchIcon, 
  Filter, 
  Calendar, 
  Eye, 
  ArrowRight,
  FileText,
  Hash,
  Folder,
  Clock,
  SortDesc,
  X
} from "lucide-react";
import { toast } from "sonner";
import brain from "brain";
import { BlogPost } from "types";
import MainNavigation from "components/MainNavigation";

interface Props {}

interface SearchFilters {
  category: string;
  tag: string;
  dateRange: string;
  sortBy: string;
}

export default function Search({}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    category: "all",
    tag: "all",
    dateRange: "all",
    sortBy: "relevance"
  });

  useEffect(() => {
    loadFiltersData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const debounceTimeout = setTimeout(() => {
        performSearch();
      }, 500);
      return () => clearTimeout(debounceTimeout);
    } else {
      setResults([]);
      setHasSearched(false);
    }
  }, [searchTerm, filters]);

  const loadFiltersData = async () => {
    try {
      const [categoriesResponse, tagsResponse] = await Promise.all([
        brain.get_categories(),
        brain.get_tags()
      ]);
      
      const categoriesData = await categoriesResponse.json();
      const tagsData = await tagsResponse.json();
      
      setCategories(categoriesData.categories || []);
      setTags(tagsData.tags || []);
    } catch (error) {
      console.error("Failed to load filter data:", error);
    }
  };

  const performSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Simulate search API call
      const response = await brain.get_blog_posts();
      const data = await response.json();
      
      // Filter results based on search term and filters
      let filteredResults = (data.posts || []).filter((post: BlogPost) => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             post.content?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = filters.category === "all" || post.categories.includes(filters.category);
        const matchesTag = filters.tag === "all" || post.tags.includes(filters.tag);
        
        return matchesSearch && matchesCategory && matchesTag && post.is_published;
      });
      
      // Apply sorting
      if (filters.sortBy === "date") {
        filteredResults.sort((a: BlogPost, b: BlogPost) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } else if (filters.sortBy === "views") {
        filteredResults.sort((a: BlogPost, b: BlogPost) => b.view_count - a.view_count);
      }
      
      setResults(filteredResults);
    } catch (error) {
      console.error("Search failed:", error);
      toast.error("Search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      tag: "all",
      dateRange: "all",
      sortBy: "relevance"
    });
  };

  const hasActiveFilters = filters.category !== "all" || filters.tag !== "all" || filters.dateRange !== "all" || filters.sortBy !== "relevance";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const popularSearches = [
    "React hooks", "CSS Grid", "TypeScript", "Design systems", 
    "Performance", "Accessibility", "Animation", "UI patterns"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <MainNavigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
            Search
          </h1>
          <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
            Find the content you're looking for
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles, tutorials, and tips..."
              className="pl-12 pr-4 py-4 text-lg backdrop-blur-md bg-white/80 border-white/30 rounded-2xl shadow-xl focus:shadow-2xl transition-all"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="max-w-4xl mx-auto mb-8">
          <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex flex-wrap gap-4 flex-1">
                  <div className="min-w-40">
                    <Select value={filters.category} onValueChange={(value) => setFilters({...filters, category: value})}>
                      <SelectTrigger className="backdrop-blur-md bg-white/50">
                        <Folder className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="min-w-40">
                    <Select value={filters.tag} onValueChange={(value) => setFilters({...filters, tag: value})}>
                      <SelectTrigger className="backdrop-blur-md bg-white/50">
                        <Hash className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Tag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tags</SelectItem>
                        {tags.map((tag) => (
                          <SelectItem key={tag} value={tag}>#{tag}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="min-w-40">
                    <Select value={filters.sortBy} onValueChange={(value) => setFilters({...filters, sortBy: value})}>
                      <SelectTrigger className="backdrop-blur-md bg-white/50">
                        <SortDesc className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevance">Relevance</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="views">Views</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {hasActiveFilters && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                    className="flex items-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Clear Filters</span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {!hasSearched && !searchTerm ? (
          <div className="max-w-4xl mx-auto">
            {/* Popular Searches */}
            <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SearchIcon className="w-5 h-5" />
                  <span>Popular Searches</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {popularSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchTerm(search)}
                      className="rounded-full hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white hover:border-transparent transition-all"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Search Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {isLoading ? "Searching..." : `${results.length} result${results.length !== 1 ? 's' : ''}`}
                </h2>
                {searchTerm && (
                  <p className="text-slate-600">
                    for "<span className="font-bold">{searchTerm}</span>"
                  </p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse backdrop-blur-md bg-white/50">
                    <CardContent className="p-6">
                      <div className="h-6 bg-slate-200 rounded mb-2"></div>
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : results.length === 0 ? (
              <Card className="backdrop-blur-md bg-white/80 border border-white/30 text-center py-12">
                <CardContent>
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-xl font-black text-slate-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-slate-600 mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="text-sm text-slate-500">Suggestions:</span>
                    {popularSearches.slice(0, 4).map((search, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchTerm(search)}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        {search}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {results.map((post) => (
                  <Card key={post.id} className="group backdrop-blur-md bg-white/80 border border-white/30 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {post.featured_image && (
                          <div className="lg:w-48 h-32 lg:h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                              {post.title}
                            </h3>
                          </div>
                          
                          {post.excerpt && (
                            <p className="text-slate-600 leading-relaxed mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(post.created_at)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{post.view_count} views</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{Math.ceil(post.content?.length / 1000) || 5} min read</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-2">
                              {post.categories.slice(0, 2).map((category) => (
                                <Badge key={category} variant="secondary" className="rounded-full text-xs">
                                  {category}
                                </Badge>
                              ))}
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="rounded-full text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="group/btn font-bold"
                              onClick={() => window.open(`/Post?slug=${post.slug}`, '_self')}
                            >
                              Read More
                              <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
