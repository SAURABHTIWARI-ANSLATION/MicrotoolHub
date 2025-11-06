import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { clearHistory, removeHistoryItem, getHistoryStats } from '../lib/storage'
import { formatNumber } from '../lib/format'
import { useToast } from './ui/toast'

export default function HistoryPanel({ history, onClear }) {
  const { toast } = useToast()
  const stats = getHistoryStats()

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast({ 
      title: '📋 Copied!', 
      description: `"${text}" copied to clipboard` 
    })
  }

  const deleteItem = (id) => {
    const success = removeHistoryItem(id)
    if (success) {
      onClear() // Refresh the history
      toast({ 
        title: '🗑️ Deleted', 
        description: 'History item removed successfully' 
      })
    } else {
      toast({ 
        title: '❌ Error', 
        description: 'Failed to delete item',
        variant: 'destructive'
      })
    }
  }

  const clearAllHistory = () => {
    const success = clearHistory()
    if (success) {
      onClear()
      toast({ 
        title: '🧹 History Cleared', 
        description: 'All conversion history has been cleared' 
      })
    } else {
      toast({ 
        title: '❌ Error', 
        description: 'Failed to clear history',
        variant: 'destructive'
      })
    }
  }

  const formatRelativeTime = (timestamp) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return new Date(timestamp).toLocaleDateString()
  }

  const getCategoryColor = (category) => {
    const colors = {
      length: 'bg-blue-50 text-blue-600 border-blue-200',
      weight: 'bg-green-50 text-green-600 border-green-200',
      temperature: 'bg-orange-50 text-orange-600 border-orange-200'
    }
    return colors[category] || 'bg-gray-50 text-gray-600 border-gray-200'
  }

  return (
    <Card>
      <CardHeader>
        <div className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 mb-2">
            <span>📊 Conversion History</span>
            <span className="text-sm font-normal text-gray-500">({history.length}/10)</span>
          </CardTitle>
          {stats.totalConversions > 0 && (
            <p className="text-xs text-gray-400">
              {Object.entries(stats.categoryStats).map(([cat, count]) => 
                `${cat}: ${count}`
              ).join(' • ')}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 opacity-50">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No conversions yet</h3>
            <p className="text-gray-500 text-sm mb-1">Your conversion history will appear here</p>
            <p className="text-gray-400 text-xs">Start converting units to build your history</p>
          </div>
        ) : (
          <>
            <ScrollArea className="h-96">
              <div className="space-y-3 pr-2">
                {history.map((h, i) => (
                  <Card key={h.id || h.ts + '-' + i} className="border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-xs font-medium uppercase tracking-wide px-2.5 py-1 rounded-full border ${getCategoryColor(h.category)}`}>
                          {h.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {formatRelativeTime(h.ts)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteItem(h.id || h.ts)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                            title="Delete this conversion"
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center py-3">
                        <div className="w-full max-w-sm">
                          <div className="flex items-center justify-center gap-4">
                            <div className="text-center flex-1">
                              <div className="font-bold text-lg text-gray-900 mb-1">
                                {formatNumber(h.fromValue, { mode: 'auto' })}
                              </div>
                              <div className="text-sm text-gray-600 font-medium">{h.fromUnit}</div>
                            </div>
                            
                            <div className="flex-shrink-0 mx-2">
                              <div className="flex items-center">
                                <div className="w-6 h-0.5 bg-gradient-to-r from-blue-400 to-green-400"></div>
                                <div className="text-green-500 text-lg ml-1">→</div>
                              </div>
                            </div>
                            
                            <div className="text-center flex-1">
                              <div className="font-bold text-lg text-green-600 mb-1">
                                {formatNumber(h.result, { mode: 'auto' })}
                              </div>
                              <div className="text-sm text-gray-600 font-medium">{h.toUnit}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center mt-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => copyToClipboard(`${formatNumber(h.result, { mode: 'auto' })} ${h.toUnit}`)}
                          className="text-xs hover:bg-blue-50 text-blue-600 font-medium"
                        >
                          📋 Copy Result
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {history.length >= 8 && (
                <div className="text-center mt-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    💡 Tip: History is limited to 10 items. Older conversions are automatically removed.
                  </p>
                </div>
              )}
            </ScrollArea>
            
            {/* Clear All button moved to bottom */}
            <div className="text-center mt-4 pt-4 border-t border-gray-100">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllHistory}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              >
                🗑️ Clear All History
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
