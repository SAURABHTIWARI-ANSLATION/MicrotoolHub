// src/App.jsx
import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Label } from './components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { ScrollArea } from './components/ui/scroll-area'
import { Tabs } from './components/ui/tabs'

// ✅ fixed paths (no ./lib/)
import { getHistory, pushHistory, clearHistory, removeHistoryItem } from './lib/storage'
import { LengthUnits, WeightUnits, TempUnits, LengthFactors, WeightFactors } from './lib/constants'

import { ArrowLeftRight, Clock, History, Star, Sun, Moon, Zap, Ruler, Weight, Thermometer, Sparkles, TrendingUp } from 'lucide-react'

// Temperature conversion functions
const convertTemperature = (value, fromUnit, toUnit) => {
  // Convert to Celsius first
  let celsius = value
  if (fromUnit === 'F') {
    celsius = (value - 32) * 5/9
  } else if (fromUnit === 'K') {
    celsius = value - 273.15
  }
  
  // Convert from Celsius to target
  if (toUnit === 'C') return celsius
  if (toUnit === 'F') return celsius * 9/5 + 32
  if (toUnit === 'K') return celsius + 273.15
  return celsius
}

const unitSymbols = {
  length: { m: 'm', km: 'km', cm: 'cm', mm: 'mm', in: 'in', ft: 'ft', yd: 'yd', mi: 'mi' },
  weight: { kg: 'kg', g: 'g', mg: 'mg', lb: 'lb', oz: 'oz', t: 't' },
  temperature: { C: '°C', F: '°F', K: 'K' }
}

const categoryUnits = {
  length: LengthUnits,
  weight: WeightUnits,
  temperature: TempUnits
}

const categoryIcons = {
  length: Ruler,
  weight: Weight,
  temperature: Thermometer
}

const categoryColors = {
  length: {
    bg: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-500',
    shadow: 'shadow-blue-500/50'
  },
  weight: {
    bg: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-500',
    shadow: 'shadow-blue-500/50'
  },
  temperature: {
    bg: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-500',
    shadow: 'shadow-blue-500/50'
  }
}

export default function App() {
  const [category, setCategory] = useState('length')
  const [fromUnit, setFromUnit] = useState('')
  const [toUnit, setToUnit] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [result, setResult] = useState('')
  const [historyVersion, setHistoryVersion] = useState(0)
  const [recentConversions, setRecentConversions] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  
  // Remove the toggle state
  // const [isFahrenheit, setIsFahrenheit] = useState(false)
  
  const history = getHistory()
  const CategoryIcon = categoryIcons[category]

  // Initialize units when category changes
  useEffect(() => {
    const units = categoryUnits[category] || []
    if (units.length > 0) {
      setFromUnit(units[0].value)
      setToUnit(units[1]?.value || units[0].value)
    }
    setInputValue('')
    setResult('')
  }, [category])

  // Update result when inputs change
  useEffect(() => {
    if (!inputValue || !fromUnit || !toUnit) {
      setResult('')
      return
    }

    const numValue = parseFloat(inputValue)
    if (isNaN(numValue)) {
      setResult('Invalid')
      return
    }

    try {
      let convertedValue
      if (category === 'temperature') {
        convertedValue = convertTemperature(numValue, fromUnit, toUnit)
      } else {
        // For length and weight
        const factors = category === 'length' ? LengthFactors : WeightFactors
        const baseValue = numValue * factors[fromUnit]
        convertedValue = baseValue / factors[toUnit]
      }
      
      setResult(convertedValue.toFixed(6).replace(/\.?0+$/, ''))
    } catch {
      setResult('Error')
    }
  }, [inputValue, fromUnit, toUnit, category])

  const handleSwapUnits = () => {
    const temp = fromUnit
    setFromUnit(toUnit)
    setToUnit(temp)
    if (result && !isNaN(parseFloat(result))) {
      setInputValue(result)
    }
  }

  const handleConvert = useCallback(() => {
    if (!inputValue || !fromUnit || !toUnit || !result || result === 'Invalid' || result === 'Error') return
    
    setIsConverting(true)
    
    const conversionRecord = {
      category,
      fromValue: parseFloat(inputValue),
      fromUnit,
      toUnit,
      result,
      ts: Date.now()
    }
    
    pushHistory(conversionRecord)
    setHistoryVersion(prev => prev + 1)
    
    // Update recent conversions (keep last 5)
    setRecentConversions(prev => {
      const newConversions = [conversionRecord, ...prev.slice(0, 4)]
      return newConversions
    })
    
    setTimeout(() => setIsConverting(false), 300)
  }, [category, fromUnit, toUnit, inputValue, result])

  const handleClearHistory = () => {
    clearHistory()
    setHistoryVersion(prev => prev + 1)
    setRecentConversions([])
  }

  const handleDeleteHistoryItem = (id) => {
    removeHistoryItem(id)
    setHistoryVersion(prev => prev + 1)
  }

  const units = categoryUnits[category] || []

  useEffect(() => { 
    document.title = 'Unit Converter Pro' 
  }, [])

  // Keyboard: Enter triggers Save to History
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Enter' && inputValue) {
        e.preventDefault()
        handleConvert()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [inputValue, handleConvert])

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-red-300' : 'bg-gray-100'}`}>
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        {/* Header */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 rounded-2xl bg-white shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Unit Converter Pro
                  </h1>
                  <p className="mt-1 text-sm md:text-base text-gray-600 font-medium">
                    Precision conversion at your fingertips
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
                className={`rounded-lg h-10 w-10 border ${isFavorite ? 'bg-yellow-400 border-yellow-500 text-white' : ''}`}
              >
                <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-lg h-10 w-10 border"
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Main Area */}
          <div className="xl:col-span-2 space-y-6">
            {/* Category Selector */}
            <Card className="border rounded-xl shadow-sm">
              <CardContent className="p-4 md:p-6">
                <div className="grid w-full grid-cols-3 gap-2">
                  <button
                    className={`py-3 rounded-lg font-medium transition-colors ${category === 'length' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => setCategory('length')}
                  >
                    Length
                  </button>
                  <button
                    className={`py-3 rounded-lg font-medium transition-colors ${category === 'weight' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => setCategory('weight')}
                  >
                    Weight
                  </button>
                  <button
                    className={`py-3 rounded-lg font-medium transition-colors ${category === 'temperature' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                    onClick={() => setCategory('temperature')}
                  >
                    Temp
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Conversion Panel */}
            <Card className="border rounded-xl shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 rounded-lg bg-blue-500 text-white">
                    <CategoryIcon className="w-5 h-5" />
                  </div>
                  Conversion Panel
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-6">
                {/* Inputs */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
                  <div className="lg:col-span-2 space-y-2">
                    <Label className="text-sm font-medium text-gray-700">From Value</Label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleConvert()}
                      className="h-12 text-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Unit</Label>
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map(unit => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-center items-end pb-1">
                    <Button 
                      onClick={handleSwapUnits} 
                      size="icon"
                      className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600"
                    >
                      <ArrowLeftRight className="w-4 h-4 text-white" />
                    </Button>
                  </div>
                  
                  <div className="lg:col-span-2 space-y-2">
                    <Label className="text-sm font-medium text-gray-700">To Value</Label>
                    <Input
                      type="text"
                      readOnly
                      value={result}
                      placeholder="0.00"
                      className="h-12 text-lg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Unit</Label>
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {units.map(unit => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Result Display */}
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-600">Conversion Result</div>
                      <div className="text-lg font-bold text-gray-800">
                        {inputValue || '0'} {unitSymbols[category]?.[fromUnit] || fromUnit} → {result || '0'} {unitSymbols[category]?.[toUnit] || toUnit}
                      </div>
                    </div>
                    <Button 
                      onClick={handleConvert}
                      disabled={isConverting || !inputValue || !result || result === 'Invalid' || result === 'Error'}
                      className="h-10 px-4 text-sm"
                    >
                      {isConverting ? 'Converting...' : 'Save to History'}
                    </Button>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button 
                    onClick={() => { setInputValue(''); setResult('') }} 
                    variant="outline"
                    className="h-10 px-4 text-sm"
                  >
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Recent Conversions */}
            <Card className="border rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5" />
                  Recent Conversions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentConversions.length > 0 ? (
                  <ScrollArea className="h-40">
                    <div className="space-y-2 pr-4">
                      {recentConversions.map((conv, index) => (
                        <div 
                          key={index} 
                          className="p-3 rounded-lg bg-gray-50 border"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-800">{conv.fromValue} {unitSymbols[conv.category]?.[conv.fromUnit]}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span>→</span>
                              <span className="font-medium text-blue-600">
                                {conv.result} {unitSymbols[conv.category]?.[conv.toUnit]}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Clock className="w-12 h-12 mb-3 text-gray-400" />
                    <p className="text-gray-500">No recent conversions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Right: History / Stats */}
          <div className="space-y-6">
            {/* Full History */}
            <Card className="border rounded-xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    <span>History</span>
                  </div>
                  <span className="text-sm font-normal text-gray-500">
                    ({history.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history.length > 0 ? (
                  <div className="space-y-3">
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2 pr-4">
                        {[...history].reverse().map(item => (
                          <div 
                            key={item.id || item.ts} 
                            className="group p-3 rounded-lg bg-gray-50 border relative"
                          >
                            <button
                              onClick={() => handleDeleteHistoryItem(item.id || item.ts)}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-gray-500 hover:bg-red-500 hover:text-white"
                            >
                              ×
                            </button>
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-xs font-medium uppercase px-2 py-1 rounded bg-blue-100 text-blue-800">
                                {item.category}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(item.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="text-sm space-y-1">
                              <div className="font-medium">{item.fromValue} {unitSymbols[item.category]?.[item.fromUnit]}</div>
                              <div className="flex items-center gap-2">
                                <span>→</span>
                                <span className="font-medium text-blue-600">
                                  {item.result} {unitSymbols[item.category]?.[item.toUnit]}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <Button 
                      onClick={handleClearHistory} 
                      variant="destructive" 
                      className="w-full h-10 text-sm"
                    >
                      Clear All History
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <History className="w-16 h-16 mb-3 text-gray-400" />
                    <p className="text-gray-500">No history yet</p>
                    <p className="text-sm mt-1 text-gray-400">Start converting!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="border rounded-xl shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">Statistics</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Conversions</span>
                    <span className="font-medium">{history.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recent</span>
                    <span className="font-medium">{recentConversions.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Made with ❤️ • Unit Converter Pro © 2025
          </p>
        </footer>
      </div>
    </div>
  )
}
