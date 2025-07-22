import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Eye, Share2, Edit } from "lucide-react";
import brain from "brain";
import { BlogPost } from "types";
import MainNavigation from "components/MainNavigation";

interface Props {}

export default function BlogPost({}: Props) {
  const [searchParams] = useSearchParams();
  const slug = searchParams.get('slug');
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPost(slug);
    }
  }, [slug]);

  const loadPost = async (postSlug: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await brain.get_blog_post({ slug: postSlug });
      
      if (response.status === 404) {
        setError("Post not found");
        return;
      }
      
      const data = await response.json();
      setPost(data);
    } catch (err) {
      console.error('Failed to load post:', err);
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sharePost = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt || '',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            <div className="h-96 bg-white/50 rounded-3xl animate-pulse mb-8"></div>
            <div className="h-8 bg-white/50 rounded-full animate-pulse mb-4"></div>
            <div className="h-6 bg-white/50 rounded-full animate-pulse w-2/3 mb-8"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-4 bg-white/50 rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="backdrop-blur-md bg-white/80 border border-white/30 rounded-3xl p-12 max-w-md mx-auto transform rotate-1 text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-4">
            {error === "Post not found" ? "Post Not Found" : "Something Went Wrong"}
          </h1>
          <p className="text-slate-600 mb-6">
            {error === "Post not found" 
              ? "The post you're looking for doesn't exist or has been moved." 
              : "We couldn't load this post right now."}
          </p>
          <Button onClick={() => navigate('/')} className="rounded-full font-bold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <MainNavigation />
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            {/* Professional glassmorphic card */}
            <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-700">
              {/* Meta Information */}
              <div className="flex items-center justify-center space-x-6 text-slate-600 mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">{formatDate(post.published_date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">{post.view_count} views</span>
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
                {post.title}
              </h1>
              
              {post.excerpt && (
                <p className="text-2xl text-slate-700 font-light leading-relaxed mb-8">
                  {post.excerpt}
                </p>
              )}

              {/* Categories and Tags */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {post.categories.map((category) => (
                  <Badge key={category} variant="secondary" className="rounded-full font-bold text-lg px-4 py-2">
                    {category}
                  </Badge>
                ))}
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="rounded-full font-bold text-lg px-4 py-2">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <Card className="backdrop-blur-md bg-white/80 border border-white/30 rounded-3xl shadow-xl overflow-hidden transform rotate-1 hover:rotate-0 transition-all duration-500">
          <CardHeader className="pb-0">
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="w-4 h-4 bg-purple-500 transform rotate-45"></div>
              <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              <div className="w-4 h-4 bg-indigo-500 transform -rotate-12"></div>
            </div>
          </CardHeader>
          
          <CardContent className="px-12 pb-12">
            <div 
              className="prose prose-lg prose-slate max-w-none
                prose-headings:font-black prose-headings:text-slate-900
                prose-h2:text-3xl prose-h2:transform prose-h2:-rotate-1 prose-h2:mb-6
                prose-h3:text-2xl prose-h3:transform prose-h3:rotate-1
                prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-lg
                prose-strong:text-slate-900 prose-strong:font-bold
                prose-em:text-purple-600 prose-em:font-medium
                prose-a:text-blue-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
                prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:bg-purple-50/50
                prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:transform prose-blockquote:rotate-1
                prose-code:bg-slate-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono
                prose-pre:bg-slate-900 prose-pre:rounded-2xl prose-pre:transform prose-pre:-rotate-1"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>') }}
            />
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-16">
          <Button 
            onClick={() => navigate('/')}
            size="lg" 
            className="rounded-full font-black text-lg px-8 py-3 transform hover:scale-105 transition-all"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to All Stories
          </Button>
        </div>
      </div>
    </div>
  );
}
