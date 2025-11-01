# 🛠️ MicroTools Hub - Complete Setup Guide

## 📁 Project Structure

```
src/
├── microtools/              # 👈 ALL YOUR TOOLS GO HERE
│   ├── types.ts            # Tool type definitions
│   ├── registry.ts         # Central registry of all tools
│   │
│   ├── example-tool/       # Example tool folder
│   │   ├── config.ts       # Tool metadata (name, description, icon, etc.)
│   │   └── index.tsx       # Tool component (the actual tool UI and logic)
│   │
│   └── your-tool/          # Your new tool folder
│       ├── config.ts       # Your tool's config
│       └── index.tsx       # Your tool's component
│
├── components/
│   ├── ToolLayout.tsx      # Shared layout for all tool pages
│   ├── ToolCard.tsx        # Tool card displayed on home page
│   ├── Header.tsx          # Site header
│   └── Footer.tsx          # Site footer
│
├── pages/
│   ├── Index.tsx           # Home page (shows all tools)
│   ├── ToolPage.tsx        # Dynamic tool page wrapper
│   ├── About.tsx           # About page
│   └── Contact.tsx         # Contact page
│
└── App.tsx                 # Routes configuration
```

---

## 🚀 How to Add a New Tool (3 Simple Steps)

### Step 1: Create Tool Folder
Create a new folder in `src/microtools/` with your tool name (use kebab-case):
```
src/microtools/json-formatter/
```

### Step 2: Add config.ts
Create `config.ts` inside your tool folder:

```typescript
import { ToolConfig } from "../types";

export const config: ToolConfig = {
  id: "json-formatter",              // Must match folder name
  name: "JSON Formatter",            // Display name
  description: "Format and validate JSON data beautifully",
  icon: "Braces",                    // Lucide icon name
  category: "Formatters",            // Category for filtering
  featured: true,                    // Show in featured section (optional)
  tags: ["json", "format", "validate"] // Tags for search (optional)
};
```

**Available Icon Names:** Find any icon from [Lucide Icons](https://lucide.dev/icons/)
- Examples: "Code", "Wrench", "Sparkles", "Settings", "FileText", "Image", "Calculator"

**Category Examples:**
- "Formatters"
- "Converters" 
- "Generators"
- "Utilities"
- "Text Tools"
- "Image Tools"

### Step 3: Add index.tsx
Create `index.tsx` inside your tool folder:

```typescript
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const JsonFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(JSON.parse(input), null, 2);
      setOutput(formatted);
    } catch (error) {
      setOutput("Invalid JSON");
    }
  };

  return (
    <div className="space-y-6">
      {/* Tool Description */}
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5">
        <h2 className="text-xl font-semibold mb-2">How to Use</h2>
        <p className="text-muted-foreground">
          Paste your JSON and click Format to beautify it.
        </p>
      </Card>

      {/* Tool Interface */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Input</h3>
          <Input
            placeholder="Paste JSON here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={handleFormat} className="mt-4 w-full">
            Format
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Output</h3>
          <pre className="p-4 bg-muted rounded-lg">
            {output || "Formatted JSON will appear here..."}
          </pre>
        </Card>
      </div>
    </div>
  );
};

export default JsonFormatter;
```

### Step 4: Register Your Tool
Open `src/microtools/registry.ts` and add your tool:

```typescript
// Import your tool
import { config as jsonFormatterConfig } from "./json-formatter/config";
import JsonFormatterComponent from "./json-formatter/index";

// Add to the registry
export const toolsRegistry: ToolModule[] = [
  {
    config: exampleToolConfig,
    component: ExampleToolComponent,
  },
  {
    config: jsonFormatterConfig,      // 👈 Add this
    component: JsonFormatterComponent, // 👈 Add this
  },
];
```

### ✅ That's It!
Your tool will automatically:
- ✅ Appear on the home page
- ✅ Be searchable
- ✅ Be filterable by category
- ✅ Have its own route at `/tools/json-formatter`
- ✅ Have proper layout with header/footer

---

## 🎨 Available UI Components

All components from shadcn/ui are available. Common ones:

```typescript
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
```

---

## 🎯 Quick Reference

### File Locations
- **Tool Code**: `src/microtools/[tool-name]/index.tsx`
- **Tool Config**: `src/microtools/[tool-name]/config.ts`
- **Tool Registry**: `src/microtools/registry.ts`
- **Routes**: Automatically handled, no manual route needed!

### What Happens Automatically
1. Tool appears on home page
2. Search functionality works
3. Category filtering works
4. Route is created at `/tools/[tool-id]`
5. Layout with header/footer applied
6. Tool metadata displayed

### Making a Tool Featured
Set `featured: true` in your config.ts to show it in the featured section.

---

## 📝 Example Tools to Build

1. **Text Tools**
   - Case Converter (uppercase, lowercase, title case)
   - Word Counter
   - Text Diff Checker

2. **Formatters**
   - JSON Formatter
   - XML Formatter
   - SQL Formatter

3. **Converters**
   - Base64 Encoder/Decoder
   - Color Converter (HEX, RGB, HSL)
   - Unit Converter

4. **Generators**
   - UUID Generator
   - QR Code Generator
   - Lorem Ipsum Generator

5. **Utilities**
   - Hash Generator (MD5, SHA)
   - Regex Tester
   - Image Resizer

---

## 🐛 Troubleshooting

**Tool not appearing?**
- Check if you added it to `registry.ts`
- Verify the folder name matches the `id` in config
- Make sure you imported both config and component

**Icon not showing?**
- Check icon name spelling (case-sensitive)
- Browse available icons at lucide.dev/icons

**Build errors?**
- Ensure all imports are correct
- Check for TypeScript errors in your component
- Verify config.ts exports the config object

---

## 🎉 You're Ready!

Now you can easily add 100+ tools to your MicroTools Hub. Each tool is completely independent and follows the same simple pattern.

Happy coding! 🚀
