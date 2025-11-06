import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';

const JsonOutput = ({ jsonData, filename = 'converted-data' }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const formatJson = (data) => {
    if (!data) return '';
    try {
      return JSON.stringify(data, null, 2);
    } catch (error) {
      return 'Invalid JSON data';
    }
  };

  const highlightJson = (jsonString) => {
    if (!jsonString) return '';
    
    return jsonString
      .replace(/(".*?")(:)/g, '<span class="key">$1</span><span class="punctuation">$2</span>')
      .replace(/(".*?")(,|\n|\r)/g, '<span class="string">$1</span><span class="punctuation">$2</span>')
      .replace(/(\d+\.?\d*)(,|\n|\r|\}|\])/g, '<span class="number">$1</span><span class="punctuation">$2</span>')
      .replace(/(true|false)(,|\n|\r|\}|\])/g, '<span class="boolean">$1</span><span class="punctuation">$2</span>')
      .replace(/(null)(,|\n|\r|\}|\])/g, '<span class="null">$1</span><span class="punctuation">$2</span>')
      .replace(/(\{|\}|\[|\]|,)/g, '<span class="punctuation">$1</span>');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formatJson(jsonData));
      setCopied(true);
      toast({
        title: "Copied!",
        description: "JSON data copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadJson = () => {
    const blob = new Blob([formatJson(jsonData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "JSON file has been downloaded",
    });
  };

  const formattedJson = formatJson(jsonData);
  const highlightedJson = highlightJson(formattedJson);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">JSON Output</h3>
        
        <div className="flex space-x-2">
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            disabled={!jsonData}
            className="flex items-center space-x-2"
          >
            {copied ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </Button>
          
          <Button
            onClick={downloadJson}
            variant="outline"
            size="sm"
            disabled={!jsonData}
            className="flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/50 rounded-lg border border-muted-foreground/20 overflow-hidden">
        <pre className="p-4 text-sm font-mono overflow-auto max-h-[400px] syntax-highlight">
          {jsonData ? (
            <code dangerouslySetInnerHTML={{ __html: highlightedJson }} />
          ) : (
            <span className="text-muted-foreground italic">
              No data to display. Upload a CSV file or enter text above.
            </span>
          )}
        </pre>
      </div>
      
      {jsonData && Array.isArray(jsonData) && (
        <p className="text-sm text-muted-foreground">
          Generated {jsonData.length} JSON object{jsonData.length !== 1 ? 's' : ''}
        </p>
      )}
    </motion.div>
  );
};

export default JsonOutput;