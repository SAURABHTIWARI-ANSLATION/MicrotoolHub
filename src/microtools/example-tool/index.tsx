import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";

const ExampleTool = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    // Your tool logic here
    setOutput(`Processed: ${input.toUpperCase()}`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Tool Description */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
        <h2 className="text-xl font-semibold text-foreground mb-2">How to Use</h2>
        <p className="text-muted-foreground">
          This is an example tool. Enter some text below and click "Process" to see it in action.
          Replace this entire component with your tool's functionality.
        </p>
      </Card>

      {/* Tool Interface */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Input</h3>
          <div className="space-y-4">
            <Input
              placeholder="Enter your text here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-background"
            />
            <Button onClick={handleProcess} className="w-full">
              Process
            </Button>
          </div>
        </Card>

        {/* Output Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Output</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={!output}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <div className="min-h-[100px] p-4 bg-muted rounded-lg">
            <p className="text-foreground font-mono">{output || "Output will appear here..."}</p>
          </div>
        </Card>
      </div>

      {/* Additional Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">Features</h3>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Feature 1: Describe your tool's main feature</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Feature 2: Another key capability</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">•</span>
            <span>Feature 3: What makes this tool useful</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default ExampleTool;
