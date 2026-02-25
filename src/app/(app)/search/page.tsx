import { Grid } from '@/components/Grid'
import { ProductGridItem } from '@/components/ProductGridItem'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const metadata = {
  description: 'Search our handcrafted collections of premium bourbon accessories and cigar essentials.',
  title: 'Search - Handcrafted Collections',
}

type SearchParams = { [key: string]: string | string[] | undefined }

type Props = {
  searchParams: Promise<SearchParams>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q: searchValue, sort } = await searchParams
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    select: {
      title: true,
      slug: true,
      gallery: true,
      categories: true,
      currency: true,
      price: true,
    },
    ...(sort ? { sort } : { sort: 'title' }),
    ...(searchValue
      ? {
          where: {
            or: [
              { title: { like: searchValue } },
              { searchableDescription: { like: searchValue } },
            ],
          },
        }
      : {}),
  })

  const resultsText = products.docs.length > 1 ? 'products' : 'product'

  return (
    <div>
      
     
      {searchValue && (
        <div className="mb-6 text-center">
          <p className="text-sm font-sourcesans text-smoky-gray dark:text-antique-white/70">
            {products.docs.length === 0 
              ? 'No handcrafted pieces found for ' 
              : `${products.docs.length} ${resultsText} found for `
            }
            <span className="font-semibold text-copper-bourbon">&ldquo;{searchValue}&rdquo;</span>
          </p>
        </div>
      )}

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
              {searchValue ? 'No products found' : 'No products available'}
            </h3>
            
            <p className="text-sm font-sourcesans text-smoky-gray dark:text-antique-white/70">
              {searchValue 
                ? 'Try adjusting your search or browse our categories.'
                : 'New handcrafted pieces coming soon.'
              }
            </p>
            
          </div>
        </div>
      )}
      
    </div>
  )
}