import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { ToolConfig } from "@/microtools/types";
import * as Icons from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  tool: ToolConfig & { path: string };
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const IconComponent = (Icons[tool.icon as keyof typeof Icons] as LucideIcon) || Icons.Wrench;

  return (
    <Link to={tool.path}>
      <Card className="group h-full p-6 transition-all duration-300 hover:shadow-[var(--shadow-hover)] border-border bg-gradient-to-b from-card to-card/80">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-accent transition-transform duration-300 group-hover:scale-110">
              <IconComponent className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-secondary text-secondary-foreground">
              {tool.category}
            </span>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {tool.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {tool.description}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
