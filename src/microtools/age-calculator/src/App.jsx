import { useEffect, useMemo, useState } from 'react'
import { computeAge } from './lib/age'
import { addHistoryItem, getHistory, clearHistory } from './lib/storage'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  CalendarIcon, 
  CakeIcon, 
  ClockIcon, 
  CalculatorIcon, 
  RotateCcwIcon, 
  CopyIcon, 
  TrashIcon 
} from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'

function Field({ id, label, children }) {
  return (
    <div className="mb-4">
      <Label htmlFor={id} className="text-sm font-medium mb-1 block">
        {label}
      </Label>
      {children}
    </div>
  )
}

export default function App() {
  const [dob, setDob] = useState('')
  const [tob, setTob] = useState('') // optional
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [historyVersion, setHistoryVersion] = useState(0)
  const { toast } = useToast()
  const history = useMemo(() => getHistory(), [historyVersion])

  useEffect(() => { document.title = 'Age Calculator' }, [])

  function onCalculate() {
    setError('')
    try {
      const out = computeAge(dob, tob)
      setResult(out)

      // Save to history
      addHistoryItem({
        dob, tob,
        summary: out.summary,
        ts: Date.now()
      })
      setHistoryVersion(x => x + 1)
    } catch (e) {
      setResult(null)
      setError(e.message || 'Invalid input')
    }
  }

  function onReset() {
    setDob('')
    setTob('')
    setResult(null)
    setError('')
  }

  function onCopy() {
    if (!result) return
    navigator.clipboard.writeText(result.summary)
    toast({
      title: "Copied!",
      description: "Age summary copied to clipboard!",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <CakeIcon className="mr-2" />
            Precise Age Calculator
          </h1>
          <p className="text-gray-600">
            Calculate your exact age in years, months, days, hours, minutes, and seconds
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <ClockIcon className="mr-2" />
              Enter Your Details
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field id="dob" label="Date of Birth">
                <Input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className={error && !dob ? "border-red-500" : ""}
                />
                {error && !dob && (
                  <p className="text-sm text-red-500 mt-1">Please select a valid date</p>
                )}
              </Field>
              
              <Field id="tob" label="Time of Birth (optional)">
                <Input
                  id="tob"
                  type="time"
                  value={tob}
                  onChange={(e) => setTob(e.target.value)}
                />
              </Field>
              
              <Field id="tz" label="Timezone">
                <Input
                  id="tz"
                  value={Intl.DateTimeFormat().resolvedOptions().timeZone}
                  readOnly
                />
              </Field>
            </div>

            {error && dob && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
              <Button onClick={onCalculate} className="flex items-center">
                <CalculatorIcon className="mr-2 h-4 w-4" />
                Calculate
              </Button>
              <Button variant="outline" onClick={onReset} className="flex items-center">
                <RotateCcwIcon className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button 
                variant="outline" 
                onClick={onCopy} 
                disabled={!result}
                className="flex items-center"
              >
                <CopyIcon className="mr-2 h-4 w-4" />
                Copy Summary
              </Button>
            </div>
          </CardContent>
        </Card>

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <CakeIcon className="mr-2" />
                  Age Breakdown
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  DOB: {result.formattedDob}
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <Stat label="Years" value={result.years} />
                  <Stat label="Months" value={result.months} />
                  <Stat label="Days" value={result.days} />
                  <Stat label="Hours" value={result.hours} />
                  <Stat label="Minutes" value={result.minutes} />
                  <Stat label="Seconds" value={result.seconds} />
                </div>
                
                <div className="border-t my-4 pt-4">
                  <h3 className="font-medium mb-3">Total Counts</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm p-2 bg-gray-100 rounded">
                      {result.totals.months} Total Months
                    </div>
                    <div className="text-sm p-2 bg-gray-100 rounded">
                      {result.totals.weeks} Total Weeks
                    </div>
                    <div className="text-sm p-2 bg-gray-100 rounded">
                      {result.totals.days} Total Days
                    </div>
                    <div className="text-sm p-2 bg-gray-100 rounded">
                      {result.totals.hours} Total Hours
                    </div>
                    <div className="text-sm p-2 bg-gray-100 rounded">
                      {result.totals.minutes} Total Minutes
                    </div>
                    <div className="text-sm p-2 bg-gray-100 rounded">
                      {result.totals.seconds} Total Seconds
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Additional Information
                </h2>
                <p className="text-gray-600 text-sm mb-4">
                  Weekday, next birthday & countdown
                </p>
                
                <div className="space-y-3">
                  <div className="p-3 bg-gray-100 rounded">
                    <p className="font-medium">Born on:</p>
                    <p>{result.weekday}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded">
                    <p className="font-medium">Next birthday:</p>
                    <p>{result.nextBirthday.date}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded">
                    <p className="font-medium">Time until next birthday:</p>
                    <p>{result.nextBirthday.countdown}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded">
                    <p className="font-medium">Summary:</p>
                    <p>{result.summary}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Calculation History
              </h2>
              {history.length > 0 && (
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => { clearHistory(); setHistoryVersion(n=>n+1) }}
                  className="flex items-center"
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Clear History
                </Button>
              )}
            </div>
            
            {history.length === 0 ? (
              <div className="text-center p-6 bg-gray-100 rounded">
                <p className="text-gray-600">
                  No calculations yet. Start by entering your date of birth above.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {history.map((h, i) => (
                  <div key={h.ts + '-' + i} className="p-4 border rounded">
                    <p className="font-medium">{h.summary}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      DOB: {h.dob || '—'} {h.tob ? (', ' + h.tob) : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(h.ts).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg text-center">
      <p className="text-sm opacity-90 font-medium">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}