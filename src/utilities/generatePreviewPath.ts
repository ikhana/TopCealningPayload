interface GeneratePreviewPathArgs {
  path: string
  collection?: string
  slug?: string
}

export const generatePreviewPath = ({ path, collection, slug }: GeneratePreviewPathArgs): string => {
  const params = new URLSearchParams()
  
  params.append('path', encodeURIComponent(path))
  
  if (collection) {
    params.append('collection', collection)
  }
  
  if (slug) {
    params.append('slug', slug)
  }
  
  return `/next/preview?${params.toString()}`
}