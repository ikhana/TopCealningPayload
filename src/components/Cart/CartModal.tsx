'use client'

import { Price } from '@/components/Price'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import type { Media, Product } from '@/payload-types'
import { useCart } from '@/providers/Cart'
import { ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/cn'
import { DeleteItemButton } from './DeleteItemButton'
import { EditItemQuantityButton } from './EditItemQuantityButton'
import { OpenCartButton } from './OpenCart'

export function CartModal() {
  const { cart, cartQuantity, cartTotal } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  
  // Keep ref for future use if needed
  const quantityRef = useRef(
    cart?.items?.length
      ? cart.items.reduce((quantity, product) => (product.quantity || 0) + quantity, 0)
      : 0,
  )
  const pathname = usePathname()

  // ❌ DISABLED AUTO-OPEN: Comment out the auto-open functionality
  // useEffect(() => {
  //   // Open cart modal when quantity changes.
  //   if (cartQuantity !== quantityRef.current) {
  //     // But only if it's not already open (quantity also changes when editing items in cart).
  //     if (!isOpen && pathname !== '/checkout') {
  //       setIsOpen(true)
  //     }

  //     // Always update the quantity reference
  //     quantityRef.current = cartQuantity
  //   }
  // }, [isOpen, cartQuantity, pathname])

  // Close cart modal only on pathname changes, not on cart updates
  useEffect(() => {
    // Close the cart modal when the pathname changes.
    setIsOpen(false)
  }, [pathname])

  // ✅ FIX: Prevent modal from closing when cart items are deleted
  // Use useCallback to prevent unnecessary rerenders
  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open)
  }, [])

  // ✅ FIX: Memoize cart items to prevent unnecessary rerenders
  const cartItems = React.useMemo(() => {
    return cart?.items || []
  }, [cart?.items])

  return (
    <Sheet onOpenChange={handleOpenChange} open={isOpen}>
      <SheetTrigger asChild>
        <OpenCartButton quantity={cartQuantity} />
      </SheetTrigger>

      <SheetContent className={cn(
        "flex flex-col w-full max-w-lg",
        // Bourbon Heritage Theme
        "bg-antique-white dark:bg-charcoal-black",
        "border-l border-smoky-gray/20 dark:border-antique-brass/20"
      )}>
        <SheetHeader className="border-b border-smoky-gray/10 dark:border-antique-brass/10 pb-4">
          <SheetTitle className={cn(
            "font-playfair text-2xl font-bold",
            "text-deep-charcoal dark:text-antique-white"
          )}>
            My Cart
          </SheetTitle>

          <SheetDescription className={cn(
            "font-sourcesans",
            "text-antique-brass dark:text-smoky-gray"
          )}>
            Manage your cart here, add items to view the total.
          </SheetDescription>
        </SheetHeader>

        {!cart || cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-12">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center mb-6",
              "bg-copper-bourbon/10 dark:bg-copper-bourbon/20"
            )}>
              <ShoppingCart className={cn(
                "h-10 w-10",
                "text-copper-bourbon dark:text-charcoal-gold"
              )} />
            </div>
            <p className={cn(
              "text-center text-xl font-semibold font-playfair mb-2",
              "text-deep-charcoal dark:text-antique-white"
            )}>
              Your cart is empty
            </p>
            <p className={cn(
              "text-center text-sm font-sourcesans",
              "text-antique-brass dark:text-smoky-gray"
            )}>
              Add some handcrafted pieces to get started
            </p>
          </div>
        ) : (
          <div className="grow flex px-4">
            <div className="flex flex-col justify-between w-full">
              <ul className="grow overflow-auto py-4 pr-4 space-y-4">
                {cartItems.map((item, i) => {
                  const product = item.product

                  // ✅ TYPE GUARD: Ensure product is a full Product object, not just an ID
                  if (typeof product === 'string' || typeof product === 'number' || !item || !item.url || !product)
                    return <React.Fragment key={i} />

                  // ✅ TYPE GUARD: Safely access product properties
                  const productData = product as Product
                  
                  // ✅ TYPE GUARD: Check if meta.image is a full Media object
                  const metaImage = productData.meta?.image && typeof productData.meta.image === 'object'
                    ? (productData.meta.image as Media)
                    : undefined

                  // ✅ TYPE GUARD: Check if gallery[0] is a full Media object  
                  const firstGalleryImage = productData.gallery?.[0] && typeof productData.gallery[0] === 'object'
                    ? (productData.gallery[0] as Media)
                    : undefined

                  const image = firstGalleryImage || metaImage
                  let price = productData.price

                  const isVariant = Boolean(item.variant)
                  const variant = productData.variants?.length
                    ? productData.variants.find((v) => v.id === item.variant)
                    : undefined

                  if (isVariant && variant) {
                    price = variant.price
                  }

                  return (
                    <li className="flex w-full flex-col" key={`${item.id}-${i}`}>
                      <div className={cn(
                        "relative flex w-full flex-row justify-between p-4 mr-3 rounded-lg transition-all duration-200",
                        "bg-white/60 dark:bg-deep-charcoal/60",
                        "border border-smoky-gray/10 dark:border-antique-brass/10",
                        "hover:bg-white/80 dark:hover:bg-deep-charcoal/80",
                        "hover:shadow-sm"
                      )}>
                        <div className="absolute z-40 -top-2 -right-2">
                          <DeleteItemButton item={item} />
                        </div>
                        
                        <Link 
                          className="z-30 flex flex-row space-x-4 flex-1 mr-4" 
                          href={item.url}
                          onClick={(e) => {
                            // Only close modal if user actually navigates
                            // Don't close on delete operations
                            if (!(e.target as HTMLElement).closest('[data-delete-button]')) {
                              setIsOpen(false)
                            }
                          }}
                        >
                          <div className={cn(
                            "relative h-16 w-16 cursor-pointer overflow-hidden rounded-lg",
                            "border-2 border-copper-bourbon/20 dark:border-charcoal-gold/20",
                            "bg-copper-bourbon/5 dark:bg-charcoal-gold/5",
                            "hover:border-copper-bourbon/40 dark:hover:border-charcoal-gold/40",
                            "transition-colors duration-200"
                          )}>
                            {image?.url && (
                              <Image
                                alt={image.alt || productData.title || ''}
                                className="h-full w-full object-cover"
                                height={94}
                                src={image.url}
                                width={94}
                              />
                            )}
                          </div>

                          <div className="flex flex-1 flex-col justify-center text-base">
                            <span className={cn(
                              "font-semibold leading-tight font-playfair",
                              "text-deep-charcoal dark:text-antique-white"
                            )}>
                              {productData.title}
                            </span>
                            {isVariant && variant ? (
                              <p className={cn(
                                "text-sm font-sourcesans capitalize mt-1",
                                "text-antique-brass dark:text-smoky-gray"
                              )}>
                                {variant.options
                                  ?.map((option) => {
                                    return option.slug
                                  })
                                  .join(', ')}
                              </p>
                            ) : null}
                          </div>
                        </Link>
                        
                        <div className="flex h-16 flex-col justify-between">
                          {price && (
                            <Price
                              amount={price}
                              className={cn(
                                "flex justify-end space-y-2 text-right text-sm font-semibold",
                                "text-copper-bourbon dark:text-charcoal-gold"
                              )}
                              currencyCode={'usd'}
                            />
                          )}
                          <div className={cn(
                            "ml-auto flex h-9 flex-row items-center rounded-lg",
                            "border border-smoky-gray/20 dark:border-antique-brass/20",
                            "bg-white/60 dark:bg-deep-charcoal/60"
                          )}>
                            <EditItemQuantityButton item={item} type="minus" />
                            <p className="w-6 text-center">
                              <span className={cn(
                                "w-full text-sm font-semibold",
                                "text-deep-charcoal dark:text-antique-white"
                              )}>
                                {item.quantity}
                              </span>
                            </p>
                            <EditItemQuantityButton item={item} type="plus" />
                          </div>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
              
              <div className="px-4">
                <div className={cn(
                  "py-4 text-sm border-t",
                  "border-smoky-gray/20 dark:border-antique-brass/20"
                )}>
                  <div className={cn(
                    "mb-4 flex items-center justify-between border-b pb-3 pt-1",
                    "border-smoky-gray/20 dark:border-antique-brass/20"
                  )}>
                    <p className={cn(
                      "font-semibold font-sourcesans text-base",
                      "text-deep-charcoal dark:text-antique-white"
                    )}>
                      Total
                    </p>
                    <Price
                      amount={cartTotal.amount}
                      className={cn(
                        "text-right text-lg font-bold font-playfair",
                        "text-copper-bourbon dark:text-charcoal-gold"
                      )}
                      currencyCode={cartTotal.currency}
                    />
                  </div>

                  <Button 
                    asChild 
                    className={cn(
                      "w-full h-12 font-semibold text-base rounded-lg",
                      "bg-copper-bourbon hover:bg-copper-bourbon/90",
                      "text-antique-white",
                      "shadow-lg hover:shadow-xl",
                      "transition-all duration-300 hover:scale-[1.02]",
                      "border-2 border-copper-bourbon/20",
                      "dark:bg-charcoal-gold dark:hover:bg-charcoal-gold/90",
                      "dark:text-charcoal-black dark:border-charcoal-gold/20"
                    )}
                  >
                    <Link className="w-full" href="/checkout" onClick={() => setIsOpen(false)}>
                      Proceed to Checkout
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}