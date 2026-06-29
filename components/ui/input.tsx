import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-[0.25rem] border-0 bg-[#2a2a2a] px-3 py-2 text-sm text-[#e4e2e1] outline-none transition-all placeholder:text-[#adadad] focus-visible:bg-[#353535] focus-visible:ring-0 focus-visible:outline-2 focus-visible:outline-[#e7ff04] focus-visible:outline-offset-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#e4e2e1]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
