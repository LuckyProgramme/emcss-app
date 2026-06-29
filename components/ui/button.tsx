import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[0.25rem] border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-[#e7ff04] text-[#001c95] hover:bg-[#d8ef00] font-semibold",
        outline:
          "border-[rgba(70,72,50,0.3)] bg-transparent text-[#e7ff04] hover:bg-[#e7ff04]/10",
        secondary:
          "bg-[#55a183]/20 text-[#55a183] hover:bg-[#55a183]/30",
        ghost:
          "hover:bg-[#2a2a2a] text-[#c7c9ab] hover:text-[#e4e2e1]",
        destructive:
          "bg-[#ffb4ab]/15 text-[#ffb4ab] hover:bg-[#ffb4ab]/25",
        link: "text-[#e7ff04] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 gap-1.5 px-4 py-2",
        xs: "h-6 gap-1 px-2 text-xs rounded-[0.25rem] [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-3 text-[0.8rem] rounded-[0.25rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-1.5 px-5",
        icon: "size-9",
        "icon-xs": "size-6 rounded-[0.25rem] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-[0.25rem]",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
