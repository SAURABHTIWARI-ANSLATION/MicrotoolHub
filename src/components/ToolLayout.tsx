import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { ToolConfig } from "@/microtools/types";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ToolLayoutProps {
  config: ToolConfig;
  children: React.ReactNode;
}

export const ToolLayout = ({ config, children }: ToolLayoutProps) => {
  const IconComponent = (Icons[config.icon as keyof typeof Icons] as LucideIcon) || Icons.Wrench;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-grow">
        {/* Back Button */}
        <Link to="/">
          <Button variant="ghost" className="mb-6 group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to All Tools
          </Button>
        </Link>

        {/* Tool Header */}
        <div className="mb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-6">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[var(--shadow-card)]">
                <IconComponent className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold text-foreground">{config.name}</h1>
                  {config.featured && (
                    <Badge variant="default" className="gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl">{config.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline">{config.category}</Badge>
                  {config.tags?.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        {/* Tool Content */}
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};
