import { useEffect, useMemo, useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Label } from './ui/label'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { convertValue } from '../lib/convert'
import { formatNumber } from '../lib/format'
import { loadRounding, pushHistory, saveRounding } from '../lib/storage'
import { useToast } from './ui/toast'

export default function ConvertCard({ category, units, onHistoryChange }) {
  const { toast } = useToast()
  const [fromUnit, setFromUnit] = useState(units[0].value)
  const [toUnit, setToUnit] = useState(units[1]?.value || units[0].value)
  const [raw, setRaw] = useState('')
  const [rounding, setRounding] = useState({ mode: 'auto' }) // or { mode:'fixed', digits: 2|3|4 }

  useEffect(() => {
    const r = loadRounding()
    setRounding(r?.mode ? r : { mode: 'auto' })
  }, [])

  const value = useMemo(() => Number(raw), [raw])
  const result = useMemo(() => {
    if (raw.trim() === '' || Number.isNaN(value)) return NaN
    if (value < 0 && category !== 'temperature') return NaN
    return convertValue(category, fromUnit, toUnit, value)
  }, [raw, value, fromUnit, toUnit, category])

  function swap() {
    const a = fromUnit
    setFromUnit(toUnit)
    setToUnit(a)
  }

  function copy() {
    const s = formatNumber(result, rounding)
    if (!s) return
    navigator.clipboard.writeText(s)
    toast({ 
      title: '📋 Copied!', 
      description: `"${s}" copied to clipboard` 
    })
  }

  function reset() { setRaw('') }

  function saveToHistory() {
    if (!Number.isFinite(result)) {
      toast({ 
        title: 'Cannot Save ❌', 
        description: 'Please enter a valid value first.',
        variant: 'destructive'
      })
      return
    }
    
    const item = {
      ts: Date.now(),
      category,
      fromValue: value,
      fromUnit,
      toUnit,
      result,
    }
    
    try {
      const saved = pushHistory(item)
      if (saved) {
        onHistoryChange && onHistoryChange()
        toast({
          title: '✅ Saved Successfully!',
          description: `${formatNumber(item.fromValue, { mode: 'auto' })} ${item.fromUnit} → ${formatNumber(item.result, { mode: 'auto' })} ${item.toUnit}`
        })
      } else {
        toast({
          title: '⚠️ Already in History',
          description: 'This conversion was recently saved.',
          variant: 'default'
        })
      }
    } catch (e) {
      toast({ 
        title: '❌ Save Failed', 
        description: e.message || 'Storage error occurred',
        variant: 'destructive'
      })
    }
  }

  function setAuto() {
    const r = { mode: 'auto' }
    setRounding(r); saveRounding(r)
  }

  function setFixed(d) {
    const r = { mode: 'fixed', digits: d }
    setRounding(r); saveRounding(r)
  }

  const formatted = Number.isFinite(result) ? formatNumber(result, rounding) : ''

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
        <div className="space-y-1.5">
          <Label htmlFor="fromValue">Value</Label>
          <Input id="fromValue" type="number" inputMode="decimal" placeholder="Enter value"
            value={raw} onChange={(e) => setRaw(e.target.value)} />
        </div>

        <div className="hidden md:flex items-center justify-center">
          <Button type="button" variant="secondary" className="mt-6" onClick={swap} aria-label="Swap units">⇄</Button>
        </div>

        <div className="space-y-1.5">
          <Label>From Unit</Label>
          <Select value={fromUnit} onValueChange={setFromUnit}>
            <SelectTrigger><SelectValue placeholder="From" /></SelectTrigger>
            <SelectContent>
              {units.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="md:hidden">
          <Button type="button" variant="secondary" className="w-full" onClick={swap}>Swap</Button>
        </div>

        <div className="space-y-1.5">
          <Label>To Unit</Label>
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger><SelectValue placeholder="To" /></SelectTrigger>
            <SelectContent>
              {units.map(u => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Result</Label>
          <Input readOnly value={formatted} placeholder="—" aria-live="polite" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={copy}>Copy</Button>
        <Button variant="outline" onClick={reset}>Reset</Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Rounding: {rounding.mode === 'auto' ? 'Auto' : `Fixed (${rounding.digits})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={setAuto}>Auto</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFixed(2)}>Fixed (2)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFixed(3)}>Fixed (3)</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFixed(4)}>Fixed (4)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="secondary" onClick={saveToHistory}>Save to History</Button>
      </div>

      {raw !== '' && Number.isNaN(value) && (
        <p className="text-sm text-red-600">Please enter a numeric value.</p>
      )}
      {raw !== '' && value < 0 && category !== 'temperature' && (
        <p className="text-sm text-red-600">Negative values are only allowed for temperature.</p>
      )}
    </div>
  )
}
