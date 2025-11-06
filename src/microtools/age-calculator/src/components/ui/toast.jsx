import React from 'react'
import * as ToastPr from '@radix-ui/react-toast'
import { cn } from './utils'

const ToastContext = React.createContext(null)

export function ToastProvider({ children }) {
  const [open, setOpen] = React.useState(false)
  const [msg, setMsg] = React.useState({})
  const toast = (t) => { setMsg(t); setOpen(false); requestAnimationFrame(() => setOpen(true)) }

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPr.Provider swipeDirection="right">
        {children}

        <ToastPr.Root
          open={open}
          onOpenChange={setOpen}
          className={cn('fixed bottom-4 right-4 z-50 rounded-2xl border bg-white px-4 py-3 shadow-md')}
        >
          {msg.title && <ToastPr.Title className="font-semibold">{msg.title}</ToastPr.Title>}
          {msg.description && <ToastPr.Description className="text-sm text-gray-600">{msg.description}</ToastPr.Description>}
        </ToastPr.Root>

        <ToastPr.Viewport className="fixed bottom-0 right-0 z-50 m-0 flex max-h-screen w-full flex-col p-0 sm:max-w-[420px]" />
      </ToastPr.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within <ToastProvider />')
  return ctx
}
