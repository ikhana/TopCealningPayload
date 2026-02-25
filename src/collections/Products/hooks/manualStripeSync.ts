import type { Product } from '@/payload-types'
import type { CollectionAfterChangeHook } from 'payload'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2022-08-01',
})

const logs = true

/**
 * Manual sync hook for products to Stripe
 * This handles the complex pricing structure that the plugin's sync can't handle
 */
export const manualStripeSync: CollectionAfterChangeHook<Product> = async ({
  doc,
  req,
  operation,
  previousDoc,
}) => {
  // Skip sync if:
  // 1. The skipSync flag is set (automatically managed by Stripe plugin)
  // 2. The product is not published
  // 3. We're in a webhook context (to prevent infinite loops)
  if ((doc as any).skipSync || doc._status !== 'published' || req.context?.triggerFrom === 'stripeWebhook') {
    return doc
  }

  try {
    let stripeProduct: Stripe.Product
    const stripeID = (doc as any).stripeID

    // Create or update product in Stripe
    if (operation === 'create' || !stripeID) {
      if (logs) {
        req.payload.logger.info(`Creating new product in Stripe for ${doc.title}`)
      }

      // Create product in Stripe
      stripeProduct = await stripe.products.create({
        name: doc.title,
        description: doc.searchableDescription || undefined,
        active: true,
        metadata: {
          payloadID: String(doc.id),
        },
      })

      // Update the document with the Stripe ID
      // This will be handled by the Stripe plugin's webhook
      
      if (logs) {
        req.payload.logger.info(`✅ Created Stripe product ${stripeProduct.id}`)
      }
    } else {
      // Update existing product in Stripe
      if (logs) {
        req.payload.logger.info(`Updating Stripe product ${stripeID}`)
      }

      stripeProduct = await stripe.products.update(stripeID, {
        name: doc.title,
        description: doc.searchableDescription || undefined,
        active: doc._status === 'published',
        metadata: {
          payloadID: String(doc.id),
        },
      })

      if (logs) {
        req.payload.logger.info(`✅ Updated Stripe product ${stripeProduct.id}`)
      }
    }

    // Handle pricing - this is the complex part
    if (!doc.enableVariants && doc.price !== undefined) {
      // For simple products, manage a single price
      await manageSinglePrice({
        productId: stripeProduct.id,
        price: doc.price,
        currency: 'usd',
        payload: req.payload,
        productPayloadId: String(doc.id),
      })
    } else if (doc.enableVariants && doc.variants) {
      // For variant products, manage multiple prices
      await manageVariantPrices({
        productId: stripeProduct.id,
        variants: doc.variants,
        currency: 'usd',
        payload: req.payload,
        productPayloadId: String(doc.id),
      })
    }
  } catch (error: unknown) {
    req.payload.logger.error(`Error syncing product to Stripe: ${error}`)
    // Don't throw - we don't want to break the save operation
  }

  return doc
}

async function manageSinglePrice({
  productId,
  price,
  currency,
  payload,
  productPayloadId,
}: {
  productId: string
  price: number
  currency: string
  payload: any
  productPayloadId: string
}) {
  try {
    // List all prices for this product
    const existingPrices = await stripe.prices.list({
      product: productId,
      limit: 100,
    })

    const priceInCents = Math.round(price * 100)

    // Find active price with matching amount
    const matchingPrice = existingPrices.data.find(
      (p) => p.active && p.unit_amount === priceInCents && p.currency === currency
    )

    if (!matchingPrice) {
      // Deactivate all existing prices
      await Promise.all(
        existingPrices.data
          .filter((p) => p.active)
          .map((p) => stripe.prices.update(p.id, { active: false }))
      )

      // Create new price
      const newPrice = await stripe.prices.create({
        product: productId,
        unit_amount: priceInCents,
        currency: currency,
        metadata: {
          payloadProductId: productPayloadId,
        },
      })

      if (logs) {
        payload.logger.info(`✅ Created new Stripe price ${newPrice.id}`)
      }
    } else {
      // Deactivate other prices
      await Promise.all(
        existingPrices.data
          .filter((p) => p.active && p.id !== matchingPrice.id)
          .map((p) => stripe.prices.update(p.id, { active: false }))
      )

      if (logs) {
        payload.logger.info(`✅ Using existing Stripe price ${matchingPrice.id}`)
      }
    }
  } catch (error: unknown) {
    payload.logger.error(`Error managing price in Stripe: ${error}`)
  }
}

async function manageVariantPrices({
  productId,
  variants,
  currency,
  payload,
  productPayloadId,
}: {
  productId: string
  variants: NonNullable<Product['variants']>
  currency: string
  payload: any
  productPayloadId: string
}) {
  try {
    // List all existing prices for this product
    const existingPrices = await stripe.prices.list({
      product: productId,
      limit: 100,
    })

    // Create a map of variant identifiers to prices
    const variantPriceMap = new Map<string, { 
      price: number; 
      stripePriceId?: string;
      variantId: string;
    }>()
    
    variants.forEach((variant) => {
      if (variant.active) {
        // Create a unique identifier for this variant
        const variantKey = variant.options
          .map((o) => `${o.slug}:${o.value}`)
          .sort()
          .join('|')
        
        variantPriceMap.set(variantKey, {
          price: variant.price,
          stripePriceId: variant.stripePriceID,
          variantId: variant.id!,
        })
      }
    })

    // Track which prices we want to keep active
    const activePriceIds = new Set<string>()

    // Process each variant
    for (const [variantKey, variantData] of variantPriceMap) {
      const priceInCents = Math.round(variantData.price * 100)
      
      // Check if we already have a matching price
      const matchingPrice = existingPrices.data.find(
        (p) => p.unit_amount === priceInCents && 
               p.currency === currency &&
               p.metadata?.variantKey === variantKey
      )

      if (matchingPrice) {
        activePriceIds.add(matchingPrice.id)
        
        if (!matchingPrice.active) {
          await stripe.prices.update(matchingPrice.id, { active: true })
        }
      } else {
        // Create new price
        const newPrice = await stripe.prices.create({
          product: productId,
          unit_amount: priceInCents,
          currency: currency,
          metadata: {
            variantKey: variantKey,
            payloadProductId: productPayloadId,
            payloadVariantId: variantData.variantId,
          },
        })
        
        activePriceIds.add(newPrice.id)
        
        if (logs) {
          payload.logger.info(`✅ Created new variant price ${newPrice.id} for variant ${variantKey}`)
        }
      }
    }

    // Deactivate prices that are no longer needed
    await Promise.all(
      existingPrices.data
        .filter((p) => p.active && !activePriceIds.has(p.id))
        .map((p) => stripe.prices.update(p.id, { active: false }))
    )

  } catch (error: unknown) {
    payload.logger.error(`Error managing variant prices in Stripe: ${error}`)
  }
}