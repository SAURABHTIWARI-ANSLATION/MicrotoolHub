import { useParams, Navigate } from "react-router-dom";
import { ToolLayout } from "@/components/ToolLayout";
import { toolRoutes } from "@/microtools/registry";

const ToolPage = () => {
  const { toolId } = useParams();
  
  const tool = toolRoutes.find(t => t.config.id === toolId);
  
  if (!tool) {
    return <Navigate to="/404" replace />;
  }

  const ToolComponent = tool.component;

  return (
    <ToolLayout config={tool.config}>
      <ToolComponent />
    </ToolLayout>
  );
};

export default ToolPage;
