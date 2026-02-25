// src/components/Cart/OpenCart.tsx - Updated with Copper-Bourbon Theme
import { ShoppingCart } from 'lucide-react'

export function OpenCartButton({
  className,
  quantity,
  ...rest
}: {
  className?: string
  quantity?: number
}) {
  return (
    <button
      className={className || "flex items-center justify-center w-5 h-5 text-antique-white hover:text-copper-bourbon transition-colors duration-300 relative"}
      aria-label={`Cart ${quantity ? `(${quantity} items)` : ''}`}
      {...rest}
    >
      <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" strokeWidth={2} />
      {quantity ? (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-copper-bourbon text-antique-white text-xs rounded-full flex items-center justify-center font-bold text-[10px] border border-antique-white/20">
          {quantity > 99 ? '99+' : quantity}
        </span>
      ) : null}
    </button>
  )
}