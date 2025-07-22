import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search, Hash } from "lucide-react";
import { toast } from "sonner";
import brain from "brain";
import MainNavigation from "components/MainNavigation";

interface Props {}

export default function Tags({}: Props) {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const response = await brain.get_tags();
      const data = await response.json();
      setTags(data.tags || []);
    } catch (error) {
      console.error("Failed to load tags:", error);
      toast.error("Failed to load tags");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTags = tags.filter(tag => 
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTag = () => {
    if (newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      setIsCreateOpen(false);
      toast.success("Tag created successfully!");
    }
  };

  const tagColors = [
    "bg-red-100 text-red-800 border-red-200",
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-green-100 text-green-800 border-green-200",
    "bg-yellow-100 text-yellow-800 border-yellow-200",
    "bg-purple-100 text-purple-800 border-purple-200",
    "bg-pink-100 text-pink-800 border-pink-200",
    "bg-indigo-100 text-indigo-800 border-indigo-200",
    "bg-orange-100 text-orange-800 border-orange-200",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <MainNavigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-4">
            Tags
          </h1>
          <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
            Label and discover content with tags
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 backdrop-blur-md bg-white/80 border-white/30"
            />
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold">
                <Plus className="w-4 h-4 mr-2" />
                Add Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="backdrop-blur-md bg-white/90">
              <DialogHeader>
                <DialogTitle>Create New Tag</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Tag name"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateTag()}
                />
                <div className="flex gap-2">
                  <Button onClick={handleCreateTag} className="flex-1">
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

        {/* Tags Cloud */}
        {isLoading ? (
          <div className="flex flex-wrap gap-4 justify-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-8 w-20 bg-slate-200 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="text-center py-16">
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-12 max-w-lg mx-auto">
              <Hash className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <h3 className="text-2xl font-black text-slate-900 mb-4">
                {searchTerm ? "No tags found" : "No tags yet"}
              </h3>
              <p className="text-slate-600 mb-6">
                {searchTerm ? "Try a different search term" : "Create your first tag to label posts"}
              </p>
              {!searchTerm && (
                <Button 
                  onClick={() => setIsCreateOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Tag
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Tags Cloud */}
            <div className="flex flex-wrap gap-3 justify-center">
              {filteredTags.map((tag, index) => {
                const colorClass = tagColors[index % tagColors.length];
                const postCount = Math.floor(Math.random() * 15) + 1;
                const size = postCount > 10 ? "text-xl px-6 py-3" : postCount > 5 ? "text-lg px-4 py-2" : "text-sm px-3 py-1";
                
                return (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className={`${colorClass} ${size} rounded-full font-bold cursor-pointer hover:scale-110 transition-all group`}
                  >
                    #{tag}
                    <span className="ml-2 text-xs opacity-70">{postCount}</span>
                  </Badge>
                );
              })}
            </div>

            {/* Tags List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTags.map((tag, index) => {
                const colorClass = tagColors[index % tagColors.length];
                const postCount = Math.floor(Math.random() * 15) + 1;
                
                return (
                  <Card key={`${tag}-card`} className="group backdrop-blur-md bg-white/80 border border-white/30 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-black text-slate-900 group-hover:text-purple-600 transition-colors flex items-center">
                          <Hash className="w-4 h-4 mr-1" />
                          {tag}
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
                        <Badge variant="outline" className={`${colorClass} rounded-full`}>
                          {postCount} posts
                        </Badge>
                        <Button variant="outline" size="sm" className="font-bold">
                          View Posts
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
