// src/components/Grid/tile.tsx
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import clsx from 'clsx'

type Label = {
  title: string
  amount: number
  currencyCode: string
  isOnSale?: boolean
  originalAmount?: number
}

export function GridTileImage({
  media,
  label,
  className,
  size = 'default',
}: {
  media?: MediaType | string
  label?: Label
  className?: string
  size?: 'default' | 'small' | 'medium' | 'large'
}) {
  return (
    <div
      className={clsx(
        'group flex size-full items-center justify-center overflow-hidden hover:border-blue-600 dark:hover:border-blue-600',
        className,
      )}
    >
      {media && (
        <Media
          className="relative size-full object-contain"
          imgClassName="size-full object-contain"
          resource={media}
          size={size}
        />
      )}
      {label && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-sm font-semibold text-white mb-1">{label.title}</h3>
          <div className="flex items-center gap-2">
            {label.isOnSale && label.originalAmount ? (
              <>
                <span className="text-sm text-gray-300 line-through">
                  ${(label.originalAmount / 100).toFixed(2)}
                </span>
                <span className="text-lg font-bold text-white">
                  ${(label.amount / 100).toFixed(2)}
                </span>
                <span className="text-xs text-green-400 font-semibold">
                  {Math.round((1 - label.amount / label.originalAmount) * 100)}% OFF
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-white">
                ${(label.amount / 100).toFixed(2)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}