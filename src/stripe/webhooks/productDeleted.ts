import type { StripeWebhookHandler } from '@payloadcms/plugin-stripe/types'
import type Stripe from 'stripe'

const logs = true

/**
 * This webhook will run whenever a product is deleted in Stripe
 * It will update the product status in Payload (we don't delete to preserve data)
 */
export const productDeleted: StripeWebhookHandler<{
  data: {
    object: Stripe.Product
  }
}> = async (args) => {
  const { event, payload } = args

  const stripeProduct = event.data.object

  if (logs) {
    payload.logger.info(`Processing deletion of Stripe product ${stripeProduct.id}...`)
  }

  try {
    // Check if this was triggered from Payload
    const payloadID = stripeProduct.metadata?.payloadID
    
    if (payloadID) {
      // This deletion might have originated from Payload
      if (logs) {
        payload.logger.info(`Product ${payloadID} deleted in Stripe`)
      }
    }

    // Find the product in Payload by stripeID
    const existingProducts = await payload.find({
      collection: 'products',
      where: {
        stripeID: {
          equals: stripeProduct.id,
        },
      },
    })

    if (existingProducts.docs.length === 0) {
      if (logs) {
        payload.logger.warn(`Product with Stripe ID ${stripeProduct.id} not found in Payload`)
      }
      return
    }

    const product = existingProducts.docs[0]

    // Instead of deleting, set the product to draft status
    const updatedProduct = await payload.update({
      collection: 'products',
      id: product.id,
      context: {
        triggerFrom: 'stripeWebhook', // Prevent infinite sync loops
      },
      data: {
        _status: 'draft',
        // Keep all existing data
        title: product.title,
        description: product.description,
        searchableDescription: product.searchableDescription,
        gallery: product.gallery,
        price: product.price,
        stock: product.stock,
        enableVariants: product.enableVariants,
        variants: product.variants,
        variantOptions: product.variantOptions,
        categories: product.categories,
        relatedProducts: product.relatedProducts,
        layout: product.layout,
        meta: product.meta,
        slug: product.slug,
      },
    })

    if (logs) {
      payload.logger.info(`✅ Successfully unpublished product ${updatedProduct.id} after Stripe deletion`)
    }
  } catch (error: unknown) {
    payload.logger.error(`Error processing Stripe product deletion: ${error}`)
  }
}