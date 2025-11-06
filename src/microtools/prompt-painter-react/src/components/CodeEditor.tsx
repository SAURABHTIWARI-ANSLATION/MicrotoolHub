import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Editor from "@monaco-editor/react";
import { Code2, Settings } from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const CodeEditor = ({ value, onChange }: CodeEditorProps) => {
  const editorRef = useRef<any>(null);
  const [isDark, setIsDark] = useState(true);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    // Check theme and update editor accordingly
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    };
    
    checkTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    setIsEditorReady(true);

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // Prevent default save and trigger format instead
      const event = new CustomEvent('format-code');
      document.dispatchEvent(event);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
      // Clear editor
      const event = new CustomEvent('clear-code');
      document.dispatchEvent(event);
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyC, () => {
      // Copy code
      const event = new CustomEvent('copy-code');
      document.dispatchEvent(event);
    });

    // Configure Monaco Editor
    monaco.editor.defineTheme('tailwind-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'tag', foreground: 'ff6b6b', fontStyle: 'bold' },
        { token: 'attribute.name', foreground: '4ecdc4', fontStyle: 'italic' },
        { token: 'attribute.value', foreground: '45b7d1' },
        { token: 'string', foreground: '98d8c8' },
        { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff79c6', fontStyle: 'bold' },
      ],
      colors: {
        'editor.background': '#0f172a',
        'editor.foreground': '#e2e8f0',
        'editorLineNumber.foreground': '#64748b',
        'editorLineNumber.activeForeground': '#94a3b8',
        'editor.selectionBackground': '#334155',
        'editor.inactiveSelectionBackground': '#1e293b',
      }
    });

    monaco.editor.defineTheme('tailwind-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'tag', foreground: 'd73a49', fontStyle: 'bold' },
        { token: 'attribute.name', foreground: '005cc5', fontStyle: 'italic' },
        { token: 'attribute.value', foreground: '032f62' },
        { token: 'string', foreground: '22863a' },
        { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'd73a49', fontStyle: 'bold' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#24292e',
        'editorLineNumber.foreground': '#959da5',
        'editorLineNumber.activeForeground': '#586069',
        'editor.selectionBackground': '#c8e1ff',
        'editor.inactiveSelectionBackground': '#e1f5fe',
      }
    });

    // Set initial theme
    monaco.editor.setTheme(isDark ? 'tailwind-dark' : 'tailwind-light');

    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: '"Fira Code", "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
      lineHeight: 22,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      tabSize: 2,
      insertSpaces: true,
      formatOnPaste: true,
      formatOnType: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: {
        other: true,
        comments: false,
        strings: true
      }
    });
  };

  // Update theme when it changes
  useEffect(() => {
    if (isEditorReady && editorRef.current) {
      const monaco = (window as any).monaco;
      if (monaco) {
        monaco.editor.setTheme(isDark ? 'tailwind-dark' : 'tailwind-light');
      }
    }
  }, [isDark, isEditorReady]);

  return (
    <motion.div
      className="h-full glass-panel rounded-2xl overflow-hidden shadow-xl"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-destructive animate-pulse"></span>
            <span className="w-3 h-3 rounded-full bg-accent animate-pulse" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-3 h-3 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }}></span>
            <Code2 className="w-5 h-5 ml-2 text-primary" />
            <span className="text-gradient">HTML Editor</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Settings className="w-4 h-4" />
            <span>Monaco Editor</span>
          </div>
        </div>
      </div>
      
      {/* Editor */}
      <div className="h-[calc(100%-76px)]">
        <Editor
          height="100%"
          defaultLanguage="html"
          value={value}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          theme={isDark ? 'tailwind-dark' : 'tailwind-light'}
          options={{
            fontSize: 14,
            fontFamily: '"Fira Code", "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
            lineHeight: 22,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: {
              other: true,
              comments: false,
              strings: true
            },
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
              indentation: true
            },
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            contextmenu: true,
            mouseWheelZoom: true,
          }}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }
        />
      </div>
    </motion.div>
  );
};
