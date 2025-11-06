import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

const TextInput = ({ value, onChange, placeholder }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full space-y-3"
    >
      <div className="flex items-center space-x-2">
        <FileText className="w-5 h-5 text-primary" />
        <Label className="text-base font-semibold">Manual Input</Label>
      </div>
      
      <Textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="min-h-[200px] resize-none font-mono text-sm bg-muted/50 border-muted-foreground/20 focus:border-primary transition-colors"
      />
      
      <p className="text-xs text-muted-foreground">
        Enter CSV data or any text to convert to JSON
      </p>
    </motion.div>
  );
};

export default TextInput;