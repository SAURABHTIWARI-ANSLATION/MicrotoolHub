import Papa from 'papaparse';

interface ParseSettings {
  header?: boolean;
  delimiter?: string;
  skipEmptyLines?: boolean;
}

export const parseCSV = (file: File, settings: ParseSettings = {}): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const config = {
      header: settings.header || true,
      delimiter: settings.delimiter || ',',
      skipEmptyLines: settings.skipEmptyLines || true,
      transformHeader: (header) => header.trim(),
      transform: (value) => {
        // Try to parse numbers
        if (!isNaN(Number(value)) && value !== '') {
          const num = parseFloat(value);
          return isNaN(num) ? value.trim() : num;
        }
        
        // Try to parse booleans
        const lowerValue = value.toLowerCase().trim();
        if (lowerValue === 'true') return true;
        if (lowerValue === 'false') return false;
        if (lowerValue === 'null' || lowerValue === '') return null;
        
        return value.trim();
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`Parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(error);
      }
    };

    Papa.parse(file, config);
  });
};

export const parseCSVText = (text: string, settings: ParseSettings = {}): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const config = {
      header: settings.header || true,
      delimiter: settings.delimiter || ',',
      skipEmptyLines: settings.skipEmptyLines || true,
      transformHeader: (header) => header.trim(),
      transform: (value) => {
        // Try to parse numbers
        if (!isNaN(Number(value)) && value !== '') {
          const num = parseFloat(value);
          return isNaN(num) ? value.trim() : num;
        }
        
        // Try to parse booleans
        const lowerValue = value.toLowerCase().trim();
        if (lowerValue === 'true') return true;
        if (lowerValue === 'false') return false;
        if (lowerValue === 'null' || lowerValue === '') return null;
        
        return value.trim();
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`Parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
        } else {
          resolve(results.data);
        }
      },
      error: (error) => {
        reject(error);
      }
    };

    Papa.parse(text, config);
  });
};

export const parseTextToJson = (text: string): any => {
  // Try to parse as JSON first
  try {
    return JSON.parse(text);
  } catch (e) {
    // If not JSON, try to convert lines to array
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) return null;
    
    // If single line, try to split by common delimiters
    if (lines.length === 1) {
      const line = lines[0];
      const delimiters = [',', ';', '\t', '|'];
      
      for (const delimiter of delimiters) {
        if (line.includes(delimiter)) {
          const parts = line.split(delimiter).map(part => {
            const trimmed = part.trim();
            // Try to parse as number
            if (!isNaN(Number(trimmed)) && trimmed !== '') {
              const num = parseFloat(trimmed);
              return isNaN(num) ? trimmed : num;
            }
            return trimmed;
          });
          return parts;
        }
      }
      
      // If no delimiters found, return as single item array
      return [line.trim()];
    }
    
    // Multiple lines - return as array
    return lines.map(line => {
      const trimmed = line.trim();
      // Try to parse as number
      if (!isNaN(Number(trimmed)) && trimmed !== '') {
        const num = parseFloat(trimmed);
        return isNaN(num) ? trimmed : num;
      }
      return trimmed;
    });
  }
};

export const detectDelimiter = (text: string): string => {
  const delimiters = [',', ';', '\t', '|'];
  const firstLine = text.split('\n')[0];
  
  let maxCount = 0;
  let detectedDelimiter = ',';
  
  delimiters.forEach(delimiter => {
    const count = (firstLine.match(new RegExp(`\\${delimiter}`, 'g')) || []).length;
    if (count > maxCount) {
      maxCount = count;
      detectedDelimiter = delimiter;
    }
  });
  
  return detectedDelimiter;
};