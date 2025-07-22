import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle,
  Clock,
  Globe,
  Twitter,
  Github,
  Linkedin,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import MainNavigation from "components/MainNavigation";

interface Props {}

export default function Contact({}: Props) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", category: "", message: "" });
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      description: "Send us an email anytime",
      value: "hello@designcraft.com",
      action: "mailto:hello@designcraft.com"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with us in real-time",
      value: "Available 9 AM - 6 PM PST",
      action: "#"
    },
    {
      icon: Phone,
      title: "Phone",
      description: "Call us for urgent matters",
      value: "+1 (555) 123-4567",
      action: "tel:+15551234567"
    }
  ];

  const socialLinks = [
    { icon: Twitter, label: "Twitter", url: "https://twitter.com/designcraft" },
    { icon: Github, label: "GitHub", url: "https://github.com/designcraft" },
    { icon: Linkedin, label: "LinkedIn", url: "https://linkedin.com/company/designcraft" },
  ];

  const faqItems = [
    {
      question: "How long does it take to get a response?",
      answer: "We typically respond to all inquiries within 24 hours during business days."
    },
    {
      question: "Do you offer consulting services?",
      answer: "Yes! We provide design and development consulting. Contact us to discuss your project."
    },
    {
      question: "Can I guest post on your blog?",
      answer: "We welcome high-quality guest posts. Please include writing samples in your message."
    },
    {
      question: "Do you offer design reviews?",
      answer: "We offer design feedback and code reviews for both individuals and teams."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <MainNavigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-slate-600 font-light max-w-3xl mx-auto leading-relaxed">
            Have a question, idea, or just want to say hello? We'd love to hear from you. 
            Choose the best way to reach us below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl">
                  <Send className="w-6 h-6 text-purple-600" />
                  <span>Send us a Message</span>
                </CardTitle>
                <p className="text-slate-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="John Doe"
                        required
                        className="backdrop-blur-md bg-white/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@example.com"
                        required
                        className="backdrop-blur-md bg-white/50"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger className="backdrop-blur-md bg-white/50">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="collaboration">Collaboration</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="guest-post">Guest Post</SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        placeholder="Brief description of your inquiry"
                        required
                        className="backdrop-blur-md bg-white/50"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Tell us more about your inquiry..."
                      required
                      rows={6}
                      className="backdrop-blur-md bg-white/50 resize-none"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle>Other Ways to Reach Us</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <div key={index}>
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900">{method.title}</div>
                          <div className="text-sm text-slate-600 mb-1">{method.description}</div>
                          <div className="text-sm font-medium text-purple-600">{method.value}</div>
                        </div>
                      </div>
                      {index < contactMethods.length - 1 && <Separator className="mt-4" />}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Office Info */}
            <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Location</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-bold text-slate-900">DesignCraft Studio</div>
                  <div className="text-slate-600">123 Creative Avenue</div>
                  <div className="text-slate-600">San Francisco, CA 94102</div>
                  <div className="text-slate-600">United States</div>
                </div>
                <Separator />
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Mon - Fri: 9 AM - 6 PM PST</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Globe className="w-4 h-4" />
                  <span>Remote-first team</span>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
              <CardHeader>
                <CardTitle>Follow Us</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(social.url, '_blank')}
                        className="flex items-center space-x-2 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white hover:border-transparent transition-all"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{social.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
            <p className="text-slate-600">
              Quick answers to common questions. Don't see yours? Feel free to ask!
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqItems.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="font-bold text-slate-900">{item.question}</div>
                  <div className="text-slate-600 text-sm leading-relaxed">{item.answer}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
