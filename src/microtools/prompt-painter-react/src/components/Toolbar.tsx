import { Copy, Trash2, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface ToolbarProps {
  onFormat: () => void;
  onCopy: () => void;
  onClear: () => void;
}

export const Toolbar = ({ onFormat, onCopy, onClear }: ToolbarProps) => {
  const handleCopy = () => {
    onCopy();
    toast.success("Code copied to clipboard!", {
      duration: 2000,
    });
  };

  const handleClear = () => {
    onClear();
    toast.info("Editor cleared", {
      duration: 2000,
    });
  };

  const handleFormat = () => {
    onFormat();
    toast.success("Code formatted!", {
      duration: 2000,
    });
  };

  const buttonClass = "glass-panel hover:scale-105 smooth-transition hover:glow-effect";

  return (
    <motion.div
      className="flex flex-wrap gap-3"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Button
        onClick={handleFormat}
        className={buttonClass}
        variant="default"
        size="lg"
      >
        <Wand2 className="w-4 h-4 mr-2" />
        Format
      </Button>

      <Button
        onClick={handleCopy}
        className={buttonClass}
        variant="secondary"
        size="lg"
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy
      </Button>

      <Button
        onClick={handleClear}
        className={buttonClass}
        variant="outline"
        size="lg"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Clear
      </Button>
    </motion.div>
  );
};
