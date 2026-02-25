// src/components/Footer/index.tsx - SERVER COMPONENT

import config from '@payload-config'
import { getPayload } from 'payload'
import { FooterClient } from './index.client'

export async function Footer() {
  try {
    const payload = await getPayload({ config })
    
    const footer = await payload.findGlobal({
      slug: 'footer',
      depth: 2,
      draft: false,
    })
    
    return <FooterClient footer={footer} />
  } catch (error) {
    console.error('Error fetching footer:', error)
    
    // Fallback footer
    const fallbackFooter = {
      logo: null,
      tagline: 'Strategic financial planning and wealth management solutions.',
      sections: [],
      newsletter: {
        enabled: false,
        title: '',
        description: ''
      },
      socialLinks: {},
      legalLinks: [],
      copyright: '© {year} Mazco LLC. All rights reserved.',
      id: '',
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
    
    return <FooterClient footer={fallbackFooter as any} />
  }
}