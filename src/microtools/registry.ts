import { ToolModule } from "./types";

// STEP 1: Import your tool's config and component
import { config as exampleToolConfig } from "./example-tool/config";
import ExampleToolComponent from "./example-tool/index";

// STEP 2: Add your tool to this registry
// Just copy the pattern below for each new tool
export const toolsRegistry: ToolModule[] = [
  {
    config: exampleToolConfig,
    component: ExampleToolComponent,
  },
  // Add more tools here following the same pattern:
  // {
  //   config: yourToolConfig,
  //   component: YourToolComponent,
  // },
];

// Auto-generate routes and categories
export const toolRoutes = toolsRegistry.map(tool => ({
  path: `/tools/${tool.config.id}`,
  config: tool.config,
  component: tool.component,
}));

export const categories = Array.from(
  new Set(toolsRegistry.map(tool => tool.config.category))
);

export const featuredTools = toolsRegistry.filter(tool => tool.config.featured);
