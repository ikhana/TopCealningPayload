import type { StripeWebhookHandler } from '@payloadcms/plugin-stripe/types'
import type Stripe from 'stripe'

const logs = true

/**
 * This webhook will run whenever a product is updated in Stripe
 * It will sync the updated product data to Payload
 */
export const productUpdated: StripeWebhookHandler<{
  data: {
    object: Stripe.Product
  }
}> = async (args) => {
  const { event, payload } = args

  const stripeProduct = event.data.object

  if (logs) {
    payload.logger.info(`Updating product from Stripe product ${stripeProduct.id}...`)
  }

  try {
    // Check if this was triggered from Payload (to prevent loops)
    const payloadID = stripeProduct.metadata?.payloadID
    
    if (payloadID) {
      // This update originated from Payload, skip to prevent loop
      if (logs) {
        payload.logger.info(`Skipping update for product ${payloadID} as it originated from Payload`)
      }
      return
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

    // Update the product in Payload
    const updatedProduct = await payload.update({
      collection: 'products',
      id: product.id,
      context: {
        triggerFrom: 'stripeWebhook', // Prevent infinite sync loops
      },
      data: {
        title: stripeProduct.name,
        searchableDescription: stripeProduct.description || product.searchableDescription,
        description: stripeProduct.description ? {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                    text: stripeProduct.description,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                textFormat: 0,
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
        } : product.description,
        // Preserve all other fields that aren't synced from Stripe
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
        _status: stripeProduct.active ? 'published' : 'draft',
      },
    })

    if (logs) {
      payload.logger.info(`✅ Successfully updated product ${updatedProduct.id} from Stripe product ${stripeProduct.id}`)
    }
  } catch (error: unknown) {
    payload.logger.error(`Error updating product from Stripe: ${error}`)
  }
}