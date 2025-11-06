import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Zap, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

import FileUpload from '../components/FileUpload';
import TextInput from '../components/TextInput';
import JsonOutput from '../components/JsonOutput';
import ParserSettings from '../components/ParserSettings';
import { parseCSV, parseCSVText, parseTextToJson, detectDelimiter } from '../utils/parser';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check for saved theme preference or use system preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
      }
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('file');
  const [settings, setSettings] = useState({
    delimiter: ',',
    header: true,
    skipEmptyLines: true
  });
  
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    await processFile(file);
  };

  const processFile = async (file: File) => {
    if (!file) return;
    
    setIsProcessing(true);
    try {
      const result = await parseCSV(file, settings);
      setJsonOutput(result);
      toast({
        title: "Success!",
        description: `Converted ${Array.isArray(result) ? result.length : 1} rows to JSON`,
      });
    } catch (error: any) {
      toast({
        title: "Parsing Error",
        description: error.message,
        variant: "destructive",
      });
      setJsonOutput(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextInput(value);
    
    if (value.trim()) {
      processText(value);
    } else {
      setJsonOutput(null);
    }
  };

  const processText = async (text: string) => {
    if (!text.trim()) return;
    
    setIsProcessing(true);
    try {
      // Detect if it's CSV-like data
      const detectedDelimiter = detectDelimiter(text);
      const hasMultipleColumns = text.includes(detectedDelimiter);
      
      let result;
      if (hasMultipleColumns) {
        // Parse as CSV
        const csvSettings = { ...settings, delimiter: detectedDelimiter };
        result = await parseCSVText(text, csvSettings);
      } else {
        // Parse as generic text to JSON
        result = parseTextToJson(text);
      }
      
      setJsonOutput(result);
    } catch (error: any) {
      toast({
        title: "Parsing Error",
        description: error.message,
        variant: "destructive",
      });
      setJsonOutput(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSettingsChange = (newSettings: typeof settings) => {
    setSettings(newSettings);
    
    // Re-process current data with new settings
    if (selectedFile && activeTab === 'file') {
      processFile(selectedFile);
    } else if (textInput.trim() && activeTab === 'text') {
      processText(textInput);
    }
  };

return (
    <div className="min-h-screen bg-background dark:bg-background/90">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden border-b border-border/50 backdrop-blur-sm dark:border-border/30"
      >
        {/* Running gradient overlay */}
        <div className={`absolute inset-0 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-sky-400 via-emerald-400 to-cyan-400 opacity-30' 
            : 'bg-gradient-to-r from-yellow-400 via-red-400 to-emerald-400 opacity-20'
        } gradient-running`} />
        
        {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="absolute right-4 top-4 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-border shadow-sm hover:bg-accent/50 transition-colors z-10"
            aria-label="Toggle dark mode"
          >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          )}
        </button>
        <div className="container mx-auto px-4 py-6">
          <div className="relative z-10 flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-br from-sky-400 to-emerald-400' 
                  : 'bg-gradient-to-br from-yellow-400 to-red-400'
              } flex items-center justify-center shadow-lg`}>
                <FileSpreadsheet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-sky-400 to-emerald-400' 
                    : 'bg-gradient-to-r from-yellow-500 via-red-500 to-emerald-500'
                } bg-clip-text text-transparent`}>CSV to JSON Parser</h1>
              <p className="text-muted-foreground dark:text-muted-foreground/80">Convert CSV files and text to JSON with advanced parsing options</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-card/80 dark:bg-card/90 backdrop-blur-sm rounded-xl p-1 border border-border/50 shadow-sm"
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/50 p-1 rounded-lg">
                  <TabsTrigger value="file" className="flex items-center space-x-2">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>File Upload</span>
                  </TabsTrigger>
                  <TabsTrigger value="text" className="flex items-center space-x-2">
                    <Zap className="w-4 h-4" />
                    <span>Text Input</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="file" className="mt-0">
                  <FileUpload 
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                  />
                </TabsContent>
                
                <TabsContent value="text" className="mt-0">
                  <TextInput
                    value={textInput}
                    onChange={handleTextInputChange}
                    placeholder="Paste CSV data here or any text to convert to JSON..."
                  />
                </TabsContent>
              </Tabs>
            </motion.div>

            {/* Processing Indicator */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center space-x-3 p-4 bg-primary/10 rounded-lg border border-primary/20"
              >
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-primary font-medium">Processing data...</span>
              </motion.div>
            )}

            {/* JSON Output */}
            <JsonOutput 
              jsonData={jsonOutput}
              filename={selectedFile ? selectedFile.name.replace(/\.\w+$/, '') : 'converted-data'}
            />
          </div>

          {/* Settings Sidebar */}
          <div className="space-y-6">
            <ParserSettings 
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
            
            {/* Usage Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border border-border/30 shadow-sm backdrop-blur-sm"
            >
              <h3 className="font-semibold mb-3 flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <span>Quick Tips</span>
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Drag & drop CSV files for instant conversion</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Paste any text data for flexible JSON conversion</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Adjust delimiter and header settings as needed</span>
                </li>
                <li className="flex items-start space-x-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span>Copy or download the generated JSON</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;