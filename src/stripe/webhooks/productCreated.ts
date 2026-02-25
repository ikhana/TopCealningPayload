import type { StripeWebhookHandler } from '@payloadcms/plugin-stripe/types'
import type Stripe from 'stripe'

const logs = true

/**
 * This webhook will run whenever a product is created in Stripe
 * It will sync the product data to Payload
 */
export const productCreated: StripeWebhookHandler<{
  data: {
    object: Stripe.Product
  }
}> = async (args) => {
  const { event, payload } = args

  const stripeProduct = event.data.object

  if (logs) {
    payload.logger.info(`Syncing Stripe product ${stripeProduct.id} to Payload...`)
  }

  try {
    // Check if this product was created from Payload (has payloadID in metadata)
    const payloadID = stripeProduct.metadata?.payloadID

    if (payloadID) {
      // This product was created from Payload, just update the stripeID
      const existingProduct = await payload.findByID({
        collection: 'products',
        id: payloadID,
        context: {
          triggerFrom: 'stripeWebhook', // Prevent infinite sync loops
        },
      })

      if (existingProduct && !(existingProduct as any).stripeID) {
        // The Stripe plugin will automatically handle setting the stripeID
        // through its own internal webhook handlers
        if (logs) {
          payload.logger.info(`Product ${payloadID} will have stripeID set by Stripe plugin`)
        }
      }
      return
    }

    // This product was created directly in Stripe, create it in Payload
    // Check if product already exists in Payload (by stripeID)
    const existingProducts = await payload.find({
      collection: 'products',
      where: {
        stripeID: {
          equals: stripeProduct.id,
        },
      },
    })

    if (existingProducts.docs.length > 0) {
      if (logs) {
        payload.logger.info(`Product with Stripe ID ${stripeProduct.id} already exists in Payload`)
      }
      return
    }

    // Create the product in Payload
    const newProduct = await payload.create({
      collection: 'products',
      context: {
        triggerFrom: 'stripeWebhook', // Prevent infinite sync loops
      },
      data: {
        title: stripeProduct.name,
        searchableDescription: stripeProduct.description || '',
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
        } : undefined,
        gallery: [], // Required field - empty array for products created from Stripe
        price: 0, // Price will be set by price webhooks
        stock: 0, // Default stock
        enableVariants: false, // Default to simple product
        _status: stripeProduct.active ? 'published' : 'draft',
        slug: stripeProduct.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        // Initialize other fields with defaults
        categories: [],
        relatedProducts: [],
        layout: [],
        meta: {
          title: stripeProduct.name,
          description: stripeProduct.description || '',
        },
        // The stripeID will be set automatically by the Stripe plugin
      },
    })

    if (logs) {
      payload.logger.info(`✅ Successfully created product ${newProduct.id} from Stripe product ${stripeProduct.id}`)
    }
  } catch (error: unknown) {
    payload.logger.error(`Error syncing Stripe product: ${error}`)
  }
}