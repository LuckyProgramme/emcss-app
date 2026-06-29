import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-[0.25rem] border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap tracking-[0.05em] transition-all [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "bg-[#55a183]/20 text-[#55a183]",
        secondary:
          "bg-[#e7ff04]/15 text-[#b8cc00]",
        destructive:
          "bg-[#ffb4ab]/15 text-[#ffb4ab]",
        outline:
          "border-[rgba(70,72,50,0.4)] text-[#c7c9ab]",
        ghost:
          "text-[#adadad] hover:bg-[#2a2a2a]",
        link: "text-[#e7ff04] underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
        style: { fontFamily: "var(--font-label, system-ui)" },
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
