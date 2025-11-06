import * as React from "react"
import { cn } from "./utils.jsx"

const Slot = React.forwardRef(({ children, ...props }, ref) => {
  if (React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      ref,
    })
  }
  return React.createElement("span", { ...props, ref, className: cn(props.className) }, children)
})
Slot.displayName = "Slot"

export { Slot }