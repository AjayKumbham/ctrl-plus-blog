import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  Code, 
  Palette, 
  Users, 
  Target, 
  Lightbulb,
  Coffee,
  Github,
  Twitter,
  Mail,
  ExternalLink
} from "lucide-react";
import MainNavigation from "components/MainNavigation";

interface Props {}

export default function About({}: Props) {
  const skills = [
    "UI/UX Design", "React", "TypeScript", "Node.js", "Design Systems",
    "Figma", "Adobe Creative Suite", "CSS Grid", "Animation", "Accessibility"
  ];

  const achievements = [
    { number: "50+", label: "Projects Completed" },
    { number: "10K+", label: "Lines of Code" },
    { number: "25+", label: "Happy Clients" },
    { number: "3+", label: "Years Experience" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion-Driven",
      description: "Every project is approached with genuine enthusiasm and dedication to creating exceptional user experiences."
    },
    {
      icon: Code,
      title: "Clean Code",
      description: "Writing maintainable, scalable, and well-documented code that stands the test of time."
    },
    {
      icon: Users,
      title: "User-Centric",
      description: "Always putting the user first, creating interfaces that are intuitive and accessible to everyone."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Constantly exploring new technologies and design patterns to push creative boundaries."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50">
      <MainNavigation />
      
      <div className="container mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-12 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6">
              About DesignCraft
            </h1>
            <p className="text-xl text-slate-600 font-light leading-relaxed max-w-3xl mx-auto mb-8">
              A creative blog dedicated to sharing insights, tutorials, and inspiration 
              in the world of design and development. Built with passion for the craft 
              and a commitment to helping others grow in their creative journey.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-sm font-bold">
                Design & Development
              </Badge>
              <Badge className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-4 py-2 text-sm font-bold">
                Tutorials & Tips
              </Badge>
              <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 text-sm font-bold">
                Creative Inspiration
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {achievements.map((achievement, index) => (
            <Card key={index} className="backdrop-blur-md bg-white/80 border border-white/30 text-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardContent className="p-6">
                <div className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
                  {achievement.number}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {achievement.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Target className="w-6 h-6 text-purple-600" />
                <span>Our Mission</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                To democratize design and development knowledge by creating accessible, 
                high-quality content that empowers creators at every level of their journey.
              </p>
              <p className="text-slate-600 leading-relaxed">
                We believe that great design and clean code can change the world, one 
                project at a time. Our mission is to share the tools, techniques, and 
                insights that make exceptional work possible.
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Coffee className="w-6 h-6 text-orange-600" />
                <span>Our Story</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 leading-relaxed">
                DesignCraft started as a personal blog to document learning experiences 
                and share discoveries in the rapidly evolving world of web design and development.
              </p>
              <p className="text-slate-600 leading-relaxed">
                What began as simple note-taking has grown into a platform where creativity 
                meets code, and where both beginners and experts can find value in our 
                carefully crafted content.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 text-center mb-12">
            What Drives Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xl">{value.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 leading-relaxed">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-16">
          <h2 className="text-4xl font-black text-slate-900 text-center mb-12">
            Skills & Expertise
          </h2>
          <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-3 justify-center">
                {skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="px-4 py-2 text-sm font-bold hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 hover:text-white hover:border-transparent transition-all cursor-pointer"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <Card className="backdrop-blur-lg bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-white/30 shadow-xl max-w-2xl mx-auto">
            <CardContent className="p-12">
              <h2 className="text-3xl font-black text-slate-900 mb-4">
                Let's Create Something Amazing
              </h2>
              <p className="text-slate-600 leading-relaxed mb-8">
                Whether you have a question, want to collaborate, or just want to say hello, 
                we'd love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => window.open('/contact', '_self')}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 font-bold"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Get In Touch
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.open('https://github.com', '_blank')}
                  className="font-bold"
                >
                  <Github className="w-4 h-4 mr-2" />
                  View on GitHub
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
