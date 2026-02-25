// src/app/(app)/products/[slug]/page.tsx
import type { Media, Product } from '@/payload-types'
import type { Metadata } from 'next'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { ProductClientWrapper } from '@/components/product/ProductClientWrapper'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { Button } from '@/components/ui/button'
import { getServerSideURL } from '@/utilities/getURL'
import configPromise from '@payload-config'
import { ChevronLeftIcon } from 'lucide-react'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React, { Suspense } from 'react'

const getMediaUrl = (media: number | Media | null | undefined): string | undefined => {
  if (!media || typeof media === 'number') return undefined
  return media.url ?? undefined
}

const getCategoryTitle = (category: number | { title: string } | null | undefined): string | undefined => {
  if (!category || typeof category === 'number') return undefined
  return category.title
}

const extractTextFromRichText = (richText: any): string | undefined => {
  if (typeof richText === 'string') return richText
  if (!richText?.root?.children) return undefined
  
  const extractText = (node: any): string => {
    if (typeof node === 'string') return node
    if (node.text) return node.text
    if (node.children) {
      return node.children.map(extractText).join(' ')
    }
    return ''
  }
  
  const extracted = richText.root.children.map(extractText).join(' ').trim()
  return extracted || undefined
}

const getEffectivePrice = (product: Product): { price: number; originalPrice?: number; isOnSale: boolean } => {
  if (!product.enableVariants && product.saleConfiguration?.saleActive && product.saleConfiguration?.salePrice) {
    return {
      price: product.saleConfiguration.salePrice,
      originalPrice: product.price || undefined,
      isOnSale: true
    }
  }
  
  if (!product.enableVariants) {
    return {
      price: product.price || 0,
      isOnSale: false
    }
  }
  
  return {
    price: product.price || 0,
    isOnSale: false
  }
}

const getVariantPriceRange = (variants: Product['variants']) => {
  if (!variants || variants.length === 0) return { min: 0, max: 0, hasActiveSale: false }
  
  const activePrices = variants
    .filter(v => v.active)
    .map(v => ({
      regular: v.price || 0,
      sale: v.saleActive && v.salePrice ? v.salePrice : null,
      effective: v.saleActive && v.salePrice ? v.salePrice : v.price || 0
    }))
    .filter(p => p.regular > 0)
  
  if (activePrices.length === 0) return { min: 0, max: 0, hasActiveSale: false }
  
  const effectivePrices = activePrices.map(p => p.effective)
  const hasActiveSale = activePrices.some(p => p.sale !== null)
  
  return {
    min: Math.min(...effectivePrices),
    max: Math.max(...effectivePrices),
    hasActiveSale
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) {
    return {
      title: 'Product Not Found | Blind Buford',
      description: 'The product you are looking for could not be found.',
    }
  }

  const metaTitle = product.meta?.title ?? product.title
  
  const metaDescription = product.meta?.description ?? 
                          extractTextFromRichText(product.description) ?? 
                          product.searchableDescription ?? 
                          undefined
  
  let ogImage: string | undefined
  const metaImageUrl = getMediaUrl(product.meta?.image)
  if (metaImageUrl) {
    ogImage = `${getServerSideURL()}${metaImageUrl}`
  } else if (product.gallery?.length) {
    const firstGalleryImageUrl = getMediaUrl(product.gallery[0])
    if (firstGalleryImageUrl) {
      ogImage = `${getServerSideURL()}${firstGalleryImageUrl}`
    }
  }

  const categoryNames = product.categories
    ?.map(cat => getCategoryTitle(cat))
    .filter((title): title is string => Boolean(title))
    .join(', ') ?? undefined

  return {
    title: `${metaTitle} | Blind Buford`,
    description: metaDescription ?? undefined,
    keywords: categoryNames ?? undefined,
    openGraph: {
      title: metaTitle,
      description: metaDescription ?? undefined,
      type: 'website',
      siteName: 'Blind Buford',
      url: `${getServerSideURL()}/products/${product.slug}`,
      images: ogImage ? [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: product.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription ?? undefined,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: `${getServerSideURL()}/products/${product.slug}`,
    },
  }
}

type Args = {
  params: Promise<{
    slug: string
  }>
}

function ConfiguratorSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 bg-copper-bourbon/20 dark:bg-charcoal-gold/20 rounded w-1/3" />
        <div className="h-12 bg-copper-bourbon/10 dark:bg-charcoal-gold/10 rounded-lg" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-copper-bourbon/20 dark:bg-charcoal-gold/20 rounded w-1/4" />
        <div className="h-12 bg-copper-bourbon/10 dark:bg-charcoal-gold/10 rounded-lg" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-copper-bourbon/20 dark:bg-charcoal-gold/20 rounded w-1/2" />
        <div className="h-10 bg-copper-bourbon/10 dark:bg-charcoal-gold/10 rounded-lg" />
      </div>
    </div>
  )
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const product = await queryProductBySlug({ slug })

  if (!product) return notFound()

  const variants = product.enableVariants ? product?.variants : []
  const metaImage = typeof product.meta?.image !== 'string' ? product.meta?.image : undefined
  
  const hasStock = product.enableVariants
    ? variants?.some((variant) => variant?.stock && variant.stock > 0)
    : (product.stock || 0) > 0

  let minPrice = 0
  let maxPrice = 0
  let hasActiveSale = false

  if (product.enableVariants && product.variants?.length) {
    const priceRange = getVariantPriceRange(product.variants)
    minPrice = priceRange.min
    maxPrice = priceRange.max
    hasActiveSale = priceRange.hasActiveSale
  } else {
    const priceInfo = getEffectivePrice(product)
    minPrice = priceInfo.price
    maxPrice = priceInfo.price
    hasActiveSale = priceInfo.isOnSale
  }

  const productDescription = product.meta?.description ?? 
                            extractTextFromRichText(product.description) ?? 
                            product.searchableDescription ?? 
                            undefined

  const productImages = product.gallery
    ?.map(img => {
      const url = getMediaUrl(img)
      return url ? `${getServerSideURL()}${url}` : null
    })
    .filter((url): url is string => Boolean(url)) || []

  const categoryString = product.categories
    ?.map(cat => getCategoryTitle(cat))
    .filter((title): title is string => Boolean(title))
    .join(' > ') ?? undefined

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: productDescription,
    image: productImages,
    brand: {
      '@type': 'Brand',
      name: 'Blind Buford'
    },
    offers: {
      '@type': 'AggregateOffer',
      url: `${getServerSideURL()}/products/${product.slug}`,
      priceCurrency: 'USD',
      lowPrice: (minPrice / 100).toFixed(2),
      highPrice: (maxPrice / 100).toFixed(2),
      offerCount: product.enableVariants ? product.variants?.length || 1 : 1,
      availability: hasStock 
        ? 'https://schema.org/InStock' 
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'Blind Buford'
      }
    },
    ...(categoryString && { category: categoryString }),
    sku: product.id?.toString(),
    ...(product.enableComponentCustomization && {
      additionalProperty: [
        {
          '@type': 'PropertyValue',
          name: 'Customizable',
          value: 'Yes'
        }
      ]
    })
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: getServerSideURL()
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: `${getServerSideURL()}/shop`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `${getServerSideURL()}/products/${product.slug}`
      }
    ]
  }

  const relatedProducts = product.relatedProducts?.filter((relatedProduct): relatedProduct is Product => 
    typeof relatedProduct === 'object' && 'id' in relatedProduct
  ) ?? []
  
  const gallery = product.gallery?.filter((image): image is Media => 
    typeof image === 'object' && 'url' in image
  ) ?? []

  return (
    <React.Fragment>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
        type="application/ld+json"
      />
      
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
        type="application/ld+json"
      />
      
      <div className="container pt-4 pb-2">
        <Button asChild variant="ghost">
          <Link href="/shop" className="text-antique-brass dark:text-smoky-gray hover:text-copper-bourbon dark:hover:text-charcoal-gold">
            <ChevronLeftIcon className="w-4 h-4" />
            All products
          </Link>
        </Button>
      </div>

      <div className="container">
        <Suspense fallback={
          <div className="flex flex-col rounded-xl border border-antique-brass/20 dark:border-charcoal-gold/20 p-6 md:p-8 lg:p-10 lg:flex-row lg:gap-10 bg-gradient-to-br from-antique-white via-white to-antique-white/80 dark:from-charcoal-black/90 dark:via-charcoal-black dark:to-charcoal-black/80 shadow-xl shadow-copper-bourbon/5 dark:shadow-charcoal-gold/5">
            <div className="h-96 bg-copper-bourbon/10 dark:bg-charcoal-gold/10 rounded-lg animate-pulse basis-full lg:basis-1/2" />
            <div className="basis-full lg:basis-1/2">
              <ConfiguratorSkeleton />
            </div>
          </div>
        }>
          <ProductClientWrapper 
            product={product}
            gallery={gallery}
          />
        </Suspense>
      </div>

      {product.layout && (
        <div className="mt-16">
          <RenderBlocks blocks={product.layout} />
        </div>
      )}

      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
    </React.Fragment>
  )
}

const queryProductBySlug = async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'products',
    depth: 2,
    draft,
    limit: 1,
    overrideAccess: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
}