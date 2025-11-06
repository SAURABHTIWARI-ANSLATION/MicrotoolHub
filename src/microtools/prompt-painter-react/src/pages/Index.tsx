import { useState, useEffect } from "react";
import { html as beautifyHtml } from "js-beautify";
import { CodeEditor } from "../components/CodeEditor";
import { PreviewPanel } from "../components/PreviewPanel";
import { Toolbar } from "../components/Toolbar";
import { ThemeToggle } from "../components/ThemeToggle";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const defaultHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML Live Preview with Tailwind CSS</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: '#667eea',
            secondary: '#764ba2'
          }
        }
      }
    }
  </script>
  <style>
    /* Custom styles can still be used alongside Tailwind */
    .gradient-bg {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
  </style>
</head>
<body class="min-h-screen gradient-bg flex items-center justify-center p-10">
  <div class="bg-white/95 backdrop-blur-lg rounded-2xl p-10 max-w-2xl shadow-2xl border border-white/30">
    <!-- Header Section -->
    <div class="text-center mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-4">
        ✨ HTML Live Preview with 
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Tailwind CSS
        </span>
      </h1>
      <p class="text-gray-600 text-lg leading-relaxed mb-4">
        Edit the code on the left to see your changes appear here in real-time.
      </p>
      <p class="text-gray-500">
        Now with full <strong class="text-primary">Tailwind CSS</strong> support! 🎨
      </p>
    </div>

    <!-- Feature Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div class="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 rounded-lg border border-blue-200">
        <div class="flex items-center mb-2">
          <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <h3 class="font-semibold text-gray-700">Live Preview</h3>
        </div>
        <p class="text-sm text-gray-600">Real-time HTML rendering</p>
      </div>
      
      <div class="bg-gradient-to-br from-purple-50 to-pink-100 p-4 rounded-lg border border-purple-200">
        <div class="flex items-center mb-2">
          <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
          <h3 class="font-semibold text-gray-700">Tailwind CSS</h3>
        </div>
        <p class="text-sm text-gray-600">Full utility-first CSS framework</p>
      </div>
    </div>

    <!-- Interactive Button -->
    <div class="text-center">
      <button 
        onclick="this.classList.toggle('bg-green-500'); this.classList.toggle('bg-primary'); this.textContent = this.textContent === 'Click Me!' ? 'Clicked! 🎉' : 'Click Me!'"
        class="bg-primary hover:bg-secondary text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
        Click Me!
      </button>
    </div>

    <!-- Live Demo Section -->
    <div class="mt-8 p-4 bg-gray-50 rounded-lg border-l-4 border-primary">
      <h4 class="font-semibold text-gray-700 mb-2">🎨 Try Live Editing:</h4>
      <div class="space-y-2 text-sm text-gray-600">
        <p>• Change <code class="bg-gray-200 px-1 rounded">text-black</code> to <code class="bg-gray-200 px-1 rounded">text-red-500</code></p>
        <p>• Modify <code class="bg-gray-200 px-1 rounded">bg-blue-500</code> to any color</p>
        <p>• Add <code class="bg-gray-200 px-1 rounded">hover:scale-110 transition-transform</code></p>
      </div>
    </div>
    
    <!-- Test Elements -->
    <div class="mt-4 space-y-3">
      <div class="bg-blue-500 text-white p-3 rounded-lg text-center hover:bg-blue-600 transition-colors">
        Edit me! Try changing bg-blue-500 to bg-red-500
      </div>
      <p class="text-black text-center">
        Change my color from text-black to text-green-500!
      </p>
    </div>
  </div>
</body>
</html>`;

const Index = () => {
  const [code, setCode] = useState(defaultHtml);

  // Add keyboard shortcut event listeners
  useEffect(() => {
    const handleFormatCode = () => handleFormat();
    const handleClearCode = () => handleClear();
    const handleCopyCode = () => handleCopy();

    document.addEventListener('format-code', handleFormatCode);
    document.addEventListener('clear-code', handleClearCode);
    document.addEventListener('copy-code', handleCopyCode);

    return () => {
      document.removeEventListener('format-code', handleFormatCode);
      document.removeEventListener('clear-code', handleClearCode);
      document.removeEventListener('copy-code', handleCopyCode);
    };
  }, [code]);

  const handleFormat = () => {
    const formatted = beautifyHtml(code, {
      indent_size: 2,
      indent_char: " ",
      max_preserve_newlines: 2,
      preserve_newlines: true,
      end_with_newline: true,
    });
    setCode(formatted);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleClear = () => {
    setCode("");
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <motion.div
        className="max-w-[1800px] mx-auto space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl shadow-xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="animate-float"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Sparkles className="w-10 h-10 text-primary drop-shadow-lg" />
            </motion.div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-gradient drop-shadow-sm">
                HTML Live Preview
              </h1>
              <p className="text-muted-foreground mt-2 font-medium">
                ✨ Format, preview, and perfect your HTML code in real-time
              </p>
            </div>
          </div>
          <ThemeToggle />
        </motion.div>

        {/* Toolbar */}
        <Toolbar onFormat={handleFormat} onCopy={handleCopy} onClear={handleClear} />

        {/* Editor and Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-280px)] min-h-[600px]">
          <CodeEditor value={code} onChange={setCode} />
          <PreviewPanel html={code} />
        </div>
      </motion.div>
    </div>
  );
};

export default Index;