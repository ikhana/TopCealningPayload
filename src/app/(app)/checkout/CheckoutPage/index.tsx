'use client'

import { LoadingShimmer } from '@/components/LoadingShimmer'
import { Media } from '@/components/Media'
import { Message } from '@/components/Message'
import { Price } from '@/components/Price'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/providers/Auth'
import { useCart } from '@/providers/Cart'
import { useTheme } from '@/providers/Theme'
import { cn } from '@/utilities/cn'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { Fragment, Suspense, useEffect, useRef, useState } from 'react'

import { CheckoutForm } from '../CheckoutForm'

const apiKey = `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
const stripe = loadStripe(apiKey)

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<null | string>(null)
  const [clientSecret, setClientSecret] = useState()
  const hasRequestedPaymentIntent = useRef(false)
  const { theme } = useTheme()
  const [email, setEmail] = useState('')
  const [emailEditable, setEmailEditable] = useState(true)

  const { cart, cartIsEmpty, cartTotal } = useCart()

  useEffect(() => {
    if (
      cartTotal.amount &&
      cartTotal.amount > 0 &&
      (user || (Boolean(email) && !emailEditable)) &&
      hasRequestedPaymentIntent.current === false
    ) {
      hasRequestedPaymentIntent.current = true

      const makeIntent = async () => {
        try {
          const body = !user
            ? {
                amount: cartTotal.amount,
                email,
              }
            : {
                amount: cartTotal.amount,
              }

          const paymentReq = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/create-payment-intent`,
            {
              ...(body
                ? {
                    body: JSON.stringify(body),
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }
                : {}),
              credentials: 'include',
              method: 'POST',
            },
          )

          const res = await paymentReq.json()

          if (res.error) {
            setError(res.error)
          } else if (res.client_secret) {
            setError(null)
            setClientSecret(res.client_secret)
          }
        } catch (e) {
          setError('Something went wrong.')
        }
      }

      void makeIntent()
    }
  }, [cartTotal, user, emailEditable, email])

  if (!stripe) return null

  return (
    <div className="flex flex-col items-stretch justify-stretch md:flex-row grow">
      <div className="basis-full lg:basis-1/2 flex flex-col gap-8 lg:pr-8 pt-8">
        <h2 className={cn(
          "font-medium text-3xl font-playfair",
          "text-deep-charcoal dark:text-antique-white"
        )}>
          Contact
        </h2>
        {!user && (
          <div className={cn(
            "rounded-lg p-4 grow w-full flex items-center border",
            "bg-copper-bourbon/5 dark:bg-charcoal-gold/5",
            "border-copper-bourbon/20 dark:border-charcoal-gold/20"
          )}>
            <Button 
              asChild 
              className={cn(
                "no-underline text-inherit bg-copper-bourbon hover:bg-copper-bourbon/90",
                "text-antique-white border-copper-bourbon/20"
              )} 
              variant="outline"
            >
              <Link href="/login">Log in</Link>
            </Button>
            <p className={cn(
              "mt-0 font-sourcesans",
              "text-deep-charcoal dark:text-antique-white"
            )}>
              <span className="mx-2">or</span>
              <Link 
                href="/create-account"
                className={cn(
                  "text-copper-bourbon hover:text-copper-bourbon/80",
                  "hover:underline transition-colors duration-200"
                )}
              >
                create an account
              </Link>
            </p>
          </div>
        )}
        {user ? (
          <div className={cn(
            "rounded-lg p-4 w-full border",
            "bg-white/80 dark:bg-deep-charcoal/80",
            "border-smoky-gray/20 dark:border-antique-brass/20"
          )}>
            <div>
              <p className={cn(
                "font-sourcesans font-semibold",
                "text-deep-charcoal dark:text-antique-white"
              )}>
                {user.email}
              </p>
              <p className={cn(
                "font-sourcesans",
                "text-antique-brass dark:text-smoky-gray"
              )}>
                Not you? {' '}
                <Link 
                  href="/logout"
                  className={cn(
                    "text-copper-bourbon hover:text-copper-bourbon/80",
                    "hover:underline transition-colors duration-200"
                  )}
                >
                  Log out
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className={cn(
            "rounded-lg p-4 w-full border",
            "bg-white/80 dark:bg-deep-charcoal/80",
            "border-smoky-gray/20 dark:border-antique-brass/20"
          )}>
            <div>
              <p className={cn(
                "mb-4 font-sourcesans",
                "text-deep-charcoal dark:text-antique-white"
              )}>
                Enter your email to checkout as a guest.
              </p>
              <div className="max-w-sm mb-4">
                <Label 
                  htmlFor="email"
                  className={cn(
                    "font-sourcesans font-semibold",
                    "text-antique-brass dark:text-smoky-gray"
                  )}
                >
                  Email Address
                </Label>
                <Input
                  disabled={!emailEditable}
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  className={cn(
                    "border-smoky-gray/30 dark:border-antique-brass/30",
                    "bg-white dark:bg-charcoal-black",
                    "focus:border-copper-bourbon dark:focus:border-charcoal-gold",
                    "text-deep-charcoal dark:text-antique-white"
                  )}
                />
              </div>
              <Button
                disabled={!email}
                onClick={() => {
                  setEmailEditable(false)
                }}
                className={cn(
                  "bg-copper-bourbon hover:bg-copper-bourbon/90",
                  "text-antique-white",
                  "disabled:bg-smoky-gray/30 disabled:text-smoky-gray"
                )}
              >
                Continue as guest
              </Button>
            </div>
          </div>
        )}

        <h2 className={cn(
          "font-medium text-3xl font-playfair",
          "text-deep-charcoal dark:text-antique-white"
        )}>
          Payment
        </h2>

        {cartIsEmpty && (
          <div className={cn(
            "rounded-lg p-4 border",
            "bg-orange-50 dark:bg-orange-900/20",
            "border-orange-200 dark:border-orange-700/30"
          )}>
            <p className={cn(
              "font-sourcesans",
              "text-orange-800 dark:text-orange-300"
            )}>
              Your cart is empty.{' '}
              <Link 
                href="/shop"
                className={cn(
                  "text-copper-bourbon hover:text-copper-bourbon/80",
                  "hover:underline transition-colors duration-200"
                )}
              >
                Continue shopping?
              </Link>
            </p>
          </div>
        )}
        {!clientSecret && !error && (
          <div className="my-8">
            <LoadingShimmer number={2} />
          </div>
        )}
        {!clientSecret && error && (
          <div className="my-8">
            <Message error={error} />

            <Button 
              onClick={() => router.refresh()}
              className={cn(
                "bg-copper-bourbon hover:bg-copper-bourbon/90",
                "text-antique-white"
              )}
            >
              Try again
            </Button>
          </div>
        )}
        <Suspense fallback={<React.Fragment />}>
          {clientSecret && (
            <Fragment>
              {error && (
                <p className={cn(
                  "text-red-600 dark:text-red-400 font-sourcesans"
                )}>
                  {`Error: ${error}`}
                </p>
              )}
              <Elements
                options={{
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      borderRadius: '8px',
                      colorPrimary: theme === 'dark' ? '#D4AF37' : '#8B4513', // charcoal-gold : copper-bourbon
                      gridColumnSpacing: '20px',
                      gridRowSpacing: '20px',
                      colorBackground: theme === 'dark' ? '#1C1C1C' : '#FAF9F7', // deep-charcoal : antique-white
                      colorDanger: '#EF4444',
                      colorDangerText: '#EF4444',
                      colorIcon: theme === 'dark' ? '#FAF9F7' : '#2C2C2C', // antique-white : deep-charcoal
                      colorText: theme === 'dark' ? '#FAF9F7' : '#2C2C2C', // antique-white : deep-charcoal
                      colorTextPlaceholder: theme === 'dark' ? '#A0A0A0' : '#7A7A7A', // smoky-gray variations
                      fontFamily: '"Source Sans Pro", "Geist", sans-serif',
                      fontSizeBase: '16px',
                      fontWeightBold: '600',
                      fontWeightNormal: '500',
                      spacingUnit: '4px',
                    },
                  },
                  clientSecret,
                }}
                stripe={stripe}
              >
                <CheckoutForm />
              </Elements>
            </Fragment>
          )}
        </Suspense>
      </div>

      {!cartIsEmpty && (
        <div className={cn(
          "basis-full lg:basis-1/2 lg:pl-8 p-8 border-l flex flex-col gap-8",
          "bg-antique-white/30 dark:bg-deep-charcoal/30",
          "border-smoky-gray/20 dark:border-antique-brass/20"
        )}>
          <h2 className={cn(
            "text-3xl font-medium font-playfair",
            "text-deep-charcoal dark:text-antique-white"
          )}>
            Your cart
          </h2>
          {cart?.items?.map((item, index) => {
            if (typeof item.product === 'object' && item.product) {
              const {
                product,
                product: { id, meta, title, gallery },
                quantity,
                variant: variantId,
              } = item

              if (!quantity) return null

              const image = gallery?.[0] || meta?.image

              return (
                <div className="flex items-start gap-4" key={index}>
                  <div className={cn(
                    "flex items-stretch justify-stretch h-20 w-20 p-2 rounded-lg border",
                    "border-copper-bourbon/20 dark:border-charcoal-gold/20",
                    "bg-copper-bourbon/5 dark:bg-charcoal-gold/5"
                  )}>
                    <div className="relative w-full h-full">
                      {image && typeof image !== 'string' && (
                        <Media 
                          className="" 
                          fill 
                          imgClassName="rounded-lg object-cover" 
                          resource={typeof image === 'number' ? String(image) : image} 
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex grow justify-between items-center">
                    <div className="flex flex-col gap-1">
                      <p className={cn(
                        "font-medium text-lg font-playfair",
                        "text-deep-charcoal dark:text-antique-white"
                      )}>
                        {title}
                      </p>
                      {variantId && (
                        <p className={cn(
                          "text-sm font-mono tracking-[0.1em]",
                          "text-antique-brass dark:text-smoky-gray"
                        )}>
                          {product.variants
                            ?.find((v) => v.id === variantId)
                            ?.options.map((option) => option.value)
                            .join(', ')}
                        </p>
                      )}
                      <div className={cn(
                        "font-sourcesans font-semibold",
                        "text-copper-bourbon dark:text-charcoal-gold"
                      )}>
                        {'x'}
                        {quantity}
                      </div>
                    </div>

                    {product.price && (
                      <Price 
                        amount={product.price} 
                        currencyCode="usd"
                        className={cn(
                          "font-bold font-playfair",
                          "text-copper-bourbon dark:text-charcoal-gold"
                        )}
                      />
                    )}
                  </div>
                </div>
              )
            }
            return null
          })}
          <hr className="border-smoky-gray/20 dark:border-antique-brass/20" />
          <div className="flex justify-between items-center gap-2">
            <span className={cn(
              "uppercase font-bold font-playfair tracking-wide",
              "text-deep-charcoal dark:text-antique-white"
            )}>
              Total
            </span>
            <Price 
              className={cn(
                "text-3xl font-medium font-playfair",
                "text-copper-bourbon dark:text-charcoal-gold"
              )}
              amount={cartTotal.amount} 
              currencyCode="usd" 
            />
          </div>
        </div>
      )}
    </div>
  )
}