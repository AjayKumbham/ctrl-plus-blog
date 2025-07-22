import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye, Upload, X, Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import brain from "brain";
import { CreateBlogPostRequest } from "types";
import MainNavigation from "components/MainNavigation";

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title must be less than 255 characters"),
  excerpt: z.string().optional(),
  featured_image: z.string().url().optional().or(z.literal("")),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  meta_description: z.string().max(160, "Meta description must be less than 160 characters").optional(),
  meta_keywords: z.array(z.string()).default([]),
  is_published: z.boolean().default(false),
  scheduled_date: z.string().optional()
});

type CreatePostForm = z.infer<typeof createPostSchema>;

interface Props {}

export default function CreatePost({}: Props) {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newTag, setNewTag] = useState("");
  const [newKeyword, setNewKeyword] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      categories: [],
      tags: [],
      meta_keywords: [],
      is_published: false
    }
  });

  const watchedCategories = watch("categories");
  const watchedTags = watch("tags");
  const watchedKeywords = watch("meta_keywords");
  const isPublished = watch("is_published");

  // Rich text editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      })
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none min-h-[300px] p-4 border-0 outline-0 focus:outline-0',
      },
    },
  });

  const addCategory = () => {
    if (newCategory.trim() && !watchedCategories.includes(newCategory.trim())) {
      setValue("categories", [...watchedCategories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  const removeCategory = (category: string) => {
    setValue("categories", watchedCategories.filter(c => c !== category));
  };

  const addTag = () => {
    if (newTag.trim() && !watchedTags.includes(newTag.trim())) {
      setValue("tags", [...watchedTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setValue("tags", watchedTags.filter(t => t !== tag));
  };

  const addKeyword = () => {
    if (newKeyword.trim() && !watchedKeywords.includes(newKeyword.trim())) {
      setValue("meta_keywords", [...watchedKeywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (keyword: string) => {
    setValue("meta_keywords", watchedKeywords.filter(k => k !== keyword));
  };

  const onSubmit = async (data: CreatePostForm) => {
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    setIsLoading(true);
    
    try {
      const postData: CreateBlogPostRequest = {
        title: data.title,
        content: content,
        excerpt: data.excerpt || undefined,
        featured_image: data.featured_image || undefined,
        categories: data.categories,
        tags: data.tags,
        meta_description: data.meta_description || undefined,
        meta_keywords: data.meta_keywords,
        is_published: data.is_published,
        scheduled_date: data.scheduled_date ? new Date(data.scheduled_date) : undefined
      };

      const response = await brain.create_blog_post(postData);
      const result = await response.json();
      
      toast.success(data.is_published ? "Post published successfully!" : "Draft saved successfully!");
      navigate(`/blog-post?slug=${result.slug}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const saveDraft = () => {
    setValue("is_published", false);
    handleSubmit(onSubmit)();
  };

  const publishPost = () => {
    setValue("is_published", true);
    handleSubmit(onSubmit)();
  };

  if (!editor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <MainNavigation />
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-black">Post Title</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  {...register("title")}
                  placeholder="Enter your post title..."
                  className="text-xl font-bold border-0 bg-transparent p-0 focus-visible:ring-0 placeholder:text-slate-400"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-2">{errors.title.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Rich Text Editor */}
            <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-black">Content</CardTitle>
                  
                  {/* Editor Toolbar */}
                  <div className="flex items-center space-x-2 bg-slate-100 rounded-lg p-2">
                    <Button
                      size="sm"
                      variant={editor.isActive('bold') ? 'default' : 'ghost'}
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      className="w-8 h-8 p-0"
                    >
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={editor.isActive('italic') ? 'default' : 'ghost'}
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      className="w-8 h-8 p-0"
                    >
                      <Italic className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
                      onClick={() => editor.chain().focus().toggleBulletList().run()}
                      className="w-8 h-8 p-0"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
                      onClick={() => editor.chain().focus().toggleOrderedList().run()}
                      className="w-8 h-8 p-0"
                    >
                      <ListOrdered className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <EditorContent editor={editor} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-black">Publishing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="published" className="font-bold">Publish immediately</Label>
                  <Switch
                    id="published"
                    checked={isPublished}
                    onCheckedChange={(checked) => setValue("is_published", checked)}
                  />
                </div>
                
                {isPublished && (
                  <div>
                    <Label htmlFor="scheduled_date" className="font-bold">Schedule for later</Label>
                    <Input
                      id="scheduled_date"
                      type="datetime-local"
                      {...register("scheduled_date")}
                      className="mt-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Featured Image */}
            <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-black">Featured Image</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  {...register("featured_image")}
                  placeholder="Image URL (e.g., https://...)"
                  className="mb-2"
                />
                {errors.featured_image && (
                  <p className="text-red-500 text-sm">{errors.featured_image.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Categories & Tags */}
            <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-black">Categories & Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="categories" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="categories">Categories</TabsTrigger>
                    <TabsTrigger value="tags">Tags</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="categories" className="space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Add category"
                        onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                      />
                      <Button onClick={addCategory} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {watchedCategories.map((category) => (
                        <Badge key={category} variant="secondary" className="flex items-center space-x-1">
                          <span>{category}</span>
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-red-500" 
                            onClick={() => removeCategory(category)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tags" className="space-y-3">
                    <div className="flex space-x-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tag"
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      />
                      <Button onClick={addTag} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {watchedTags.map((tag) => (
                        <Badge key={tag} variant="outline" className="flex items-center space-x-1">
                          <span>{tag}</span>
                          <X 
                            className="w-3 h-3 cursor-pointer hover:text-red-500" 
                            onClick={() => removeTag(tag)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-black">SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="excerpt" className="font-bold">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    {...register("excerpt")}
                    placeholder="Brief description of your post..."
                    rows={3}
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_description" className="font-bold">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    {...register("meta_description")}
                    placeholder="SEO meta description (160 chars max)..."
                    rows={2}
                    className="mt-2"
                  />
                  {errors.meta_description && (
                    <p className="text-red-500 text-sm mt-1">{errors.meta_description.message}</p>
                  )}
                </div>
                
                <div>
                  <Label className="font-bold">SEO Keywords</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add SEO keyword"
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    />
                    <Button onClick={addKeyword} size="sm">Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {watchedKeywords.map((keyword) => (
                      <Badge key={keyword} variant="secondary" className="flex items-center space-x-1">
                        <span>{keyword}</span>
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-red-500" 
                          onClick={() => removeKeyword(keyword)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
