import type { Metadata } from 'next'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'TopCleaning offers professional residential and commercial cleaning services — trusted, eco-friendly, and tailored to your home.',
  images: [
    {
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/og-image.jpg`,
    },
  ],
  siteName: 'TopCleaning',
  title: 'TopCleaning | Professional Cleaning Services',
}

export const mergeOpenGraph = (og?: Partial<Metadata['openGraph']>): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
