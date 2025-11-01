export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  category: string;
  featured?: boolean;
  tags?: string[];
}

export interface ToolModule {
  config: ToolConfig;
  component: React.ComponentType;
}
