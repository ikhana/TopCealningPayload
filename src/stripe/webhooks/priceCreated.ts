import type { StripeWebhookHandler } from '@payloadcms/plugin-stripe/types'
import type Stripe from 'stripe'

const logs = true

/**
 * This webhook will run whenever a price is created in Stripe
 * It will sync the price to the associated product in Payload
 */
export const priceCreated: StripeWebhookHandler<{
  data: {
    object: Stripe.Price
  }
}> = async (args) => {
  const { event, payload } = args

  const stripePrice = event.data.object

  if (logs) {
    payload.logger.info(`Syncing Stripe price ${stripePrice.id} to Payload...`)
  }

  try {
    // Only process prices that are associated with a product
    if (!stripePrice.product) {
      if (logs) {
        payload.logger.warn(`Price ${stripePrice.id} has no associated product`)
      }
      return
    }

    const stripeProductId = typeof stripePrice.product === 'string' 
      ? stripePrice.product 
      : stripePrice.product.id

    // Find the product in Payload by stripeID
    const existingProducts = await payload.find({
      collection: 'products',
      where: {
        stripeID: {
          equals: stripeProductId,
        },
      },
    })

    if (existingProducts.docs.length === 0) {
      if (logs) {
        payload.logger.warn(`Product with Stripe ID ${stripeProductId} not found in Payload`)
      }
      return
    }

    const product = existingProducts.docs[0]

    // Convert Stripe's price format (cents) to your format
    const priceInDollars = stripePrice.unit_amount ? stripePrice.unit_amount / 100 : 0

    // Check if this price has variant metadata
    const variantKey = stripePrice.metadata?.variantKey

    if (variantKey && product.enableVariants && product.variants) {
      // This is a variant price
      const updatedVariants = product.variants.map((variant) => {
        const currentVariantKey = variant.options
          .map((o) => `${o.slug}:${o.value}`)
          .sort()
          .join('|')
        
        if (currentVariantKey === variantKey) {
          return {
            ...variant,
            price: priceInDollars,
            stripePriceID: stripePrice.id,
          }
        }
        return variant
      })

      await payload.update({
        collection: 'products',
        id: product.id,
        context: {
          triggerFrom: 'stripeWebhook', // Prevent infinite sync loops
        },
        data: {
          // Preserve all fields
          title: product.title,
          description: product.description,
          searchableDescription: product.searchableDescription,
          gallery: product.gallery,
          price: product.price,
          stock: product.stock,
          enableVariants: product.enableVariants,
          variants: updatedVariants,
          variantOptions: product.variantOptions,
          categories: product.categories,
          relatedProducts: product.relatedProducts,
          layout: product.layout,
          meta: product.meta,
          slug: product.slug,
          _status: product._status,
        },
      })

      if (logs) {
        payload.logger.info(`✅ Successfully updated variant price for product ${product.id}`)
      }
    } else {
      // This is a simple product price
      await payload.update({
        collection: 'products',
        id: product.id,
        context: {
          triggerFrom: 'stripeWebhook', // Prevent infinite sync loops
        },
        data: {
          // Update price
          price: priceInDollars,
          stripePriceID: stripePrice.id,
          // Preserve all other fields
          title: product.title,
          description: product.description,
          searchableDescription: product.searchableDescription,
          gallery: product.gallery,
          stock: product.stock,
          enableVariants: product.enableVariants,
          variants: product.variants,
          variantOptions: product.variantOptions,
          categories: product.categories,
          relatedProducts: product.relatedProducts,
          layout: product.layout,
          meta: product.meta,
          slug: product.slug,
          _status: product._status,
        },
      })

      if (logs) {
        payload.logger.info(`✅ Successfully updated product ${product.id} with price ${priceInDollars} from Stripe`)
      }
    }
  } catch (error: unknown) {
    payload.logger.error(`Error syncing Stripe price: ${error}`)
  }
}