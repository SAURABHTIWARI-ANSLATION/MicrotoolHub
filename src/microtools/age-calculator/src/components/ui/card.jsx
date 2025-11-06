import React from 'react'
import { cn } from './utils'

export function Card({ className, ...props }) {
  return <div className={cn('rounded-3xl border border-gray-200 bg-white shadow-sm', className)} {...props} />
}

export function CardHeader({ className, ...props }) {
  return <div className={cn('p-5', className)} {...props} />
}
export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-xl font-bold', className)} {...props} />
}
export function CardDescription({ className, ...props }) {
  return <p className={cn('text-sm text-gray-500', className)} {...props} />
}
export function CardContent({ className, ...props }) {
  return <div className={cn('p-5 pt-0', className)} {...props} />
}
