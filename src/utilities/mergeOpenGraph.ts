import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Top Cleaning Team offers professional residential and commercial cleaning in Broward County, FL. Trusted, detailed, and tailored to your space.',
  images: [
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/og-image.jpg`,
    },
  ],
  siteName: 'Top Cleaning Team',
  locale: 'en_US',
  title: 'Top Cleaning Team | Professional Cleaning Services',
}

export const mergeOpenGraph = (og?: Partial<Metadata['openGraph']>): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
