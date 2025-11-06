import { motion } from 'framer-motion';
import { Settings, Info } from 'lucide-react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const ParserSettings = ({ settings, onSettingsChange }) => {
  const handleDelimiterChange = (value) => {
    onSettingsChange({ ...settings, delimiter: value });
  };

  const handleHeaderToggle = (checked) => {
    onSettingsChange({ ...settings, header: checked });
  };

  const handleSkipEmptyToggle = (checked) => {
    onSettingsChange({ ...settings, skipEmptyLines: checked });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-muted/30 border-muted-foreground/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-primary" />
            <span>Parser Settings</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delimiter">Delimiter</Label>
            <Select value={settings.delimiter} onValueChange={handleDelimiterChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select delimiter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=",">Comma (,)</SelectItem>
                <SelectItem value=";">Semicolon (;)</SelectItem>
                <SelectItem value="\t">Tab (\t)</SelectItem>
                <SelectItem value="|">Pipe (|)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Label htmlFor="header">First row as header</Label>
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <Switch
              id="header"
              checked={settings.header}
              onCheckedChange={handleHeaderToggle}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="skipEmpty">Skip empty lines</Label>
            <Switch
              id="skipEmpty"
              checked={settings.skipEmptyLines}
              onCheckedChange={handleSkipEmptyToggle}
            />
          </div>
          
          <div className="pt-2 border-t border-muted-foreground/20">
            <p className="text-xs text-muted-foreground">
              Adjust these settings to match your data format for optimal parsing results.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ParserSettings;