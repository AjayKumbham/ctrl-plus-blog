import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search, Folder } from "lucide-react";
import { toast } from "sonner";
import brain from "brain";
import MainNavigation from "components/MainNavigation";

interface Props {}

export default function Categories({}: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await brain.get_categories();
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(category => 
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
      setIsCreateOpen(false);
      toast.success("Category created successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <MainNavigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
            Categories
          </h1>
          <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
            Organize your content with categories
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 backdrop-blur-md bg-white/80 border-white/30"
            />
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold">
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="backdrop-blur-md bg-white/90">
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateCategory()}
                />
                <div className="flex gap-2">
                  <Button onClick={handleCreateCategory} className="flex-1">
                    Create
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse backdrop-blur-md bg-white/50">
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-12 max-w-lg mx-auto">
              <Folder className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-2xl font-black text-slate-900 mb-4">
                {searchTerm ? "No categories found" : "No categories yet"}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm ? "Try a different search term" : "Create your first category to organize posts"}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setIsCreateOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category, index) => (
              <Card key={category} className="group backdrop-blur-md bg-white/80 border border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                      {category}
                    </CardTitle>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="rounded-full">
                      {Math.floor(Math.random() * 20) + 1} posts
                    </Badge>
                    <Button variant="outline" size="sm" className="font-bold">
                      View Posts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
