import type { StripeWebhookHandler } from '@payloadcms/plugin-stripe/types'
import type Stripe from 'stripe'

const logs = true

/**
 * This webhook will run whenever a price is updated in Stripe
 * It will sync the updated price to the associated product in Payload
 */
export const priceUpdated: StripeWebhookHandler<{
  data: {
    object: Stripe.Price
  }
}> = async (args) => {
  const { event, payload } = args

  const stripePrice = event.data.object

  if (logs) {
    payload.logger.info(`Updating price from Stripe price ${stripePrice.id}...`)
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
      // This is a variant price update
      const updatedVariants = product.variants.map((variant) => {
        const currentVariantKey = variant.options
          .map((o) => `${o.slug}:${o.value}`)
          .sort()
          .join('|')
        
        if (currentVariantKey === variantKey || variant.stripePriceID === stripePrice.id) {
          return {
            ...variant,
            price: priceInDollars,
            stripePriceID: stripePrice.id,
            active: stripePrice.active ? variant.active : false, // Deactivate variant if price is inactive
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
      // This is a simple product price update
      // Check if this is the active price for the product
      const isActivePrice = product.stripePriceID === stripePrice.id || stripePrice.active

      if (isActivePrice) {
        await payload.update({
          collection: 'products',
          id: product.id,
          context: {
            triggerFrom: 'stripeWebhook', // Prevent infinite sync loops
          },
          data: {
            // Update price
            price: priceInDollars,
            stripePriceID: stripePrice.active ? stripePrice.id : product.stripePriceID,
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
          payload.logger.info(`✅ Successfully updated product ${product.id} with updated price ${priceInDollars} from Stripe`)
        }
      } else {
        if (logs) {
          payload.logger.info(`Skipping inactive price ${stripePrice.id} update for product ${product.id}`)
        }
      }
    }
  } catch (error: unknown) {
    payload.logger.error(`Error updating price from Stripe: ${error}`)
  }
}