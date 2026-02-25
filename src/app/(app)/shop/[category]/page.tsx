import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

export async function generateMetadata({
  params: paramsPromise,
}: {
  params: Promise<{ category: string }>
}) {
  const { category } = await paramsPromise
  const payload = await getPayload({ config: configPromise })
  
  const categoryDoc = (
    await payload.find({
      collection: 'categories',
      where: { slug: { equals: category } },
      limit: 1,
    })
  ).docs?.[0]

  return {
    title: categoryDoc?.title ? `${categoryDoc.title} - Handcrafted Collections` : 'Category - Handcrafted Collections',
    description: categoryDoc?.description || 'Browse our premium handcrafted collection',
  }
}

export default async function CategoryPage({
  params: paramsPromise,
  searchParams: searchParamsPromise,
}: {
  params: Promise<{ category: string }>
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await searchParamsPromise
  const searchValue = searchParams?.q
  const sort = searchParams?.sort

  const { category } = await paramsPromise
  const payload = await getPayload({ config: configPromise })

  // Get the category details
  const categoryDoc = (
    await payload.find({
      collection: 'categories',
      where: { slug: { equals: category } },
      limit: 1,
    })
  ).docs?.[0]

  // If category doesn't exist, show 404
  if (!categoryDoc) {
    notFound()
  }

  // Get products for this category
  const products = await payload.find({
    collection: 'products',
    ...(sort ? { sort } : { sort: 'title' }),
    where: {
      and: [
        { categories: { contains: categoryDoc.id } },
        ...(searchValue
          ? [
              {
                or: [
                  { title: { like: searchValue } },
                  { searchableDescription: { like: searchValue } },
                ],
              },
            ]
          : []),
      ],
    },
  })

  const resultsText = products.docs.length > 1 ? 'products' : 'product'

  return (
    <React.Fragment>
      
      
      {(searchValue || categoryDoc.description) && (
        <div className="bg-antique-white dark:bg-deep-charcoal border-b border-smoky-gray/10 dark:border-antique-brass/10">
          <div className="container py-4">
            
        
            {categoryDoc.description && !searchValue && (
              <p className="text-sm font-sourcesans text-smoky-gray dark:text-antique-white/70 mb-3">
                {categoryDoc.description}
              </p>
            )}
            
        
            {searchValue && (
              <p className="text-sm font-sourcesans text-smoky-gray dark:text-antique-white/70">
                {products.docs.length === 0 
                  ? `No ${categoryDoc.title.toLowerCase()} found for ` 
                  : `${products.docs.length} ${resultsText} in ${categoryDoc.title} for `
                }
                <span className="font-semibold text-copper-bourbon">&ldquo;{searchValue}&rdquo;</span>
              </p>
            )}
            
          </div>
        </div>
      )}

      
      <div className="bg-antique-white dark:bg-deep-charcoal py-8 lg:py-12">
        <div className="container">
          
          {products?.docs.length > 0 ? (
            <Grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {products.docs.map((product) => (
                <ProductGridItem key={product.slug} product={product} />
              ))}
            </Grid>
          ) : (
            
          
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                
                <div className="bg-copper-bourbon/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-copper-bourbon/20 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-copper-bourbon/40 rounded-sm" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold font-playfair text-deep-charcoal dark:text-antique-white mb-2">
                  {searchValue 
                    ? `No ${categoryDoc.title.toLowerCase()} found` 
                    : `No ${categoryDoc.title.toLowerCase()} available`
                  }
                </h3>
                
                <p className="text-sm font-sourcesans text-smoky-gray dark:text-antique-white/70">
                  {searchValue 
                    ? 'Try adjusting your search terms.'
                    : 'New pieces coming soon.'
                  }
                </p>
                
              </div>
            </div>
          )}
          
        </div>
      </div>
      
    </React.Fragment>
  )
}